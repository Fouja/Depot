<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use App\Models\ProduitTransfere;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ProduitTransfereController extends Controller
{
    public function index()
    {
        $produitsTransferes = ProduitTransfere::with('produit')->orderBy('date_transfert', 'desc')->get()->map(function ($transfert) {
            $prixUnitaire = $transfert->produit ? $transfert->produit->prix_unitaire : (\App\Models\Produit::where('nom', $transfert->produit_id)->value('prix_unitaire'));
            $prixTotal = $prixUnitaire ? ($prixUnitaire * $transfert->quantite) : null;
            return [
                'id' => $transfert->id,
                'produit_id' => $transfert->produit_id,
                'quantite' => $transfert->quantite,
                'destination' => $transfert->destination,
                'type_transfert' => $transfert->type_transfert,
                'nom_personnel' => $transfert->nom_personnel,
                'date_transfert' => $transfert->date_transfert,
                'created_at' => $transfert->created_at,
                'updated_at' => $transfert->updated_at,
                'type_produit' => $transfert->type_produit,
                'unite' => $transfert->unite,
                'marque' => $transfert->marque,
                'dosage' => $transfert->dosage,
                'image_url' => $transfert->image_url,
                'prix_unitaire' => $prixUnitaire,
                'prix_total' => $prixTotal,
            ];
        });
        
        return Inertia::render('ProduitsTransferes', [
            'produitsTransferes' => $produitsTransferes
        ]);
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'produit_nom' => 'required|string',
            'quantite' => 'required|numeric|min:0.01',
            'unite' => 'required|string',
            'type_produit' => 'required|string',
            'marque' => 'nullable|string',
            'dosage' => 'nullable|string',
            'destination' => 'required|string',
            'type_transfert' => 'required|in:interne,externe',
        ]);
        
        // Check if there's enough quantity available
        $produit = DB::table('produits')
            ->select(DB::raw('SUM(quantite) as total_quantite'))
            ->where('nom', $validated['produit_nom'])
            ->first();
            
        if (!$produit || $produit->total_quantite < $validated['quantite']) {
            return back()->withErrors(['quantite' => 'Quantité insuffisante disponible']);
        }
        
        // Create the transfer record
        $produitTransfere = ProduitTransfere::create([
            'produit_nom' => $validated['produit_nom'],
            'quantite' => $validated['quantite'],
            'unite' => $validated['unite'],
            'type_produit' => $validated['type_produit'],
            'marque' => $validated['marque'],
            'dosage' => $validated['dosage'],
            'destination' => $validated['destination'],
            'type_transfert' => $validated['type_transfert'],
            'date_transfert' => now(),
        ]);
        
        // Log the transaction in the statistics table
        \App\Models\Statistic::create([
            'transaction_type' => 'transfer',
            'product_name' => $validated['produit_nom'],
            'quantity' => $validated['quantite'],
            'unite' => $validated['unite'],
            'destination' => $validated['destination'],
            'personnel' => $validated['nom_personnel'],
            'type_transfert' => $validated['type_transfert'],
            'reference_id' => $produitTransfere->id,
            'reference_type' => ProduitTransfere::class,
            'transaction_date' => now(),
            'prix_unitaire' => $produit->prix_unitaire,
            'prix_total' => $produit->prix_unitaire * $validated['quantite'],
            'additional_data' => null,
        ]);
        
        // Update the product quantity
        // Find the product with the most quantity to deduct from
        $produitsToUpdate = Produit::where('nom', $validated['produit_nom'])
            ->orderBy('quantite', 'desc')
            ->get();
            
        $remainingQuantity = $validated['quantite'];
        
        foreach ($produitsToUpdate as $produit) {
            if ($remainingQuantity <= 0) break;
            
            if ($produit->quantite >= $remainingQuantity) {
                $produit->quantite -= $remainingQuantity;
                $produit->save();
                $remainingQuantity = 0;
            } else {
                $remainingQuantity -= $produit->quantite;
                $produit->quantite = 0;
                $produit->save();
            }
        }
        
        return redirect()->route('produits-transfere');
    }

    // Return a transferred product back to depot
    public function recuperer(Request $request)
    {
        $validated = $request->validate([
            'transfert_id' => 'required|integer|exists:produits_transferes,id',
            'quantite' => 'required|numeric|min:0.01', // ✅ numeric
        ]);

        DB::beginTransaction();

        try {
            $transfert = ProduitTransfere::findOrFail($validated['transfert_id']);

            if ($validated['quantite'] > $transfert->quantite) {
                return back()->withErrors(['quantite' => 'Quantité à récupérer supérieure à la quantité transférée']);
            }

            // Ajoute la quantité au dépôt
            $produit = Produit::where('nom', $transfert->produit_id)->first();
            if ($produit) {
                $produit->quantite += $validated['quantite'];
                $produit->save();
            } else {
                Produit::create([
                    'nom' => $transfert->produit_id,
                    'quantite' => $validated['quantite'],
                    'unite' => $transfert->unite,
                    'type' => $transfert->type_produit,
                    'marque' => $transfert->marque,
                    'dosage' => $transfert->dosage,
                    'image_url' => $transfert->image_url
                ]);
            }

            // Mets à jour ou supprime le transfert
            if ($validated['quantite'] == $transfert->quantite) {
                $transfert->delete();
            } else {
                $transfert->quantite -= $validated['quantite'];
                $transfert->save();
            }

            // Record recuperation in statistics
            \App\Services\StatisticService::recordRecuperation(
                $transfert->produit_id,
                $validated['quantite'],
                $transfert->unite,
                $transfert->nom_personnel,
                $transfert->id
            );

            DB::commit();
            return redirect()->route('produits.depot')->with('success', 'Produit récupéré avec succès');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['message' => 'Une erreur est survenue: ' . $e->getMessage()]);
        }
    }

    // Transfer a product from depot to another location
    public function transferer(Request $request)
    {
        // Validate request
        $validated = $request->validate([
            'produit_id' => 'required|string',
            'quantite' => 'required|numeric|min:0.01', // ✅ numeric
            'destination' => 'required|string',
            'type_transfert' => 'required|in:interne,externe',
            'nom_personnel' => 'required|string',
        ]);
        
        // Start a database transaction
        DB::beginTransaction();
        
        try {
            // Find the product by name
            $produit = Produit::where('nom', $validated['produit_id'])->first();
            
            if (!$produit || $produit->quantite < $validated['quantite']) {
                return back()->withErrors(['message' => 'Produit non trouvé ou quantité insuffisante']);
            }
            
            // Reduce the quantity in the original product
            $produit->quantite -= $validated['quantite'];
            $produit->save();
            
            // Create a transfer record with all product information
            $produitTransfere = ProduitTransfere::create([
                'produit_id' => $validated['produit_id'],
                'quantite' => $validated['quantite'],
                'destination' => $validated['destination'],
                'type_transfert' => $validated['type_transfert'],
                'nom_personnel' => $validated['nom_personnel'],
                'date_transfert' => now(),
                // Additional fields from the product
                'unite' => $produit->unite,
                'type_produit' => $produit->type,
                'marque' => $produit->marque,
                'dosage' => $produit->dosage,
                'image_url' => $produit->image_url
            ]);
            
            // Log the transaction in the statistics table
            \App\Models\Statistic::create([
                'transaction_type' => 'transfer',
                'product_name' => $produit->nom,
                'quantity' => $validated['quantite'],
                'unite' => $produit->unite,
                'destination' => $validated['destination'],
                'personnel' => $validated['nom_personnel'],
                'type_transfert' => $validated['type_transfert'],
                'reference_id' => $produitTransfere->id,
                'reference_type' => ProduitTransfere::class,
                'transaction_date' => now(),
                'prix_unitaire' => $produit->prix_unitaire,
                'prix_total' => $produit->prix_unitaire * $validated['quantite'],
                'additional_data' => null,
            ]);
            
            DB::commit();
            
            return redirect()->back()->with('success', 'Produit transféré avec succès');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['message' => 'Une erreur est survenue: ' . $e->getMessage()]);
        }
    }
}