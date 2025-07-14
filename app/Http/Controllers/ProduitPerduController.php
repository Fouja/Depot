<?php

namespace App\Http\Controllers;

use App\Models\ProduitPerdu;
use App\Models\Produit;
use App\Models\ProduitTransfere;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ProduitPerduController extends Controller
{
    public function index()
    {
        // Transform the data to match the frontend field names
        $produitsPerdus = ProduitPerdu::with('user', 'produit')->get()->map(function ($perdu) {
            return [
                'id' => $perdu->id,
                'produit_id' => $perdu->produit_id,
                'produit_nom' => $perdu->produit ? $perdu->produit->nom : '', // Add product name
                'quantite' => $perdu->quantity, // Map quantity to quantite
                'motif' => $perdu->description, // Map description to motif
                'created_at' => $perdu->created_at,
                'user' => $perdu->user ? ['name' => $perdu->user->name] : null,
                'prix_unitaire' => $perdu->produit ? $perdu->produit->prix_unitaire : null,
                'prix_total' => $perdu->produit ? ($perdu->produit->prix_unitaire * $perdu->quantity) : null,
            ];
        });

        return Inertia::render('ProduitsPerdus', [
            'produitsPerdus' => $produitsPerdus
        ]);
    }

    public function perdre(Request $request)
    {
        $request->validate([
            'produit_id' => 'required',  // Remove the exists validation
            'quantite' => 'required|integer|min:1',
            'description' => 'required|string|max:255',
            'transfert_id' => 'nullable|exists:produits_transferes,id'
        ]);

        // Log the request data for debugging
        Log::info('Perdre request data:', $request->all());

        DB::transaction(function () use ($request) {
            // Find the product by ID or name
            $produit = is_numeric($request->produit_id) 
                ? Produit::find($request->produit_id) 
                : Produit::where('nom', $request->produit_id)->first();
                
            if (!$produit) {
                throw new \Exception('Product not found');
            }
            
            // Create lost product record
            ProduitPerdu::create([
                'produit_id' => $produit->id,  // Always use the numeric ID
                'quantity' => $request->quantite,
                'description' => $request->description,
                'date_perte' => now(),
                'user_id' => Auth::id()
            ]);

            // Log after creating the record
            Log::info('ProduitPerdu record created');

            // Deduct from original product
            $produit = Produit::findOrFail($request->produit_id);
            $produit->decrement('quantite', $request->quantite);
            Log::info('Decremented quantity from original product');

            // If this is from a transfer, update or delete the transfer record
            if ($request->transfert_id) {
                $transfert = ProduitTransfere::findOrFail($request->transfert_id);
                if ($transfert->quantite <= $request->quantite) {
                    $transfert->delete();
                    Log::info('Deleted transfer record');
                } else {
                    $transfert->decrement('quantite', $request->quantite);
                    Log::info('Decremented quantity from transfer record');
                }
            }
        });

        return redirect()->back()->with('success', 'Perte enregistrée avec succès');
    }
}