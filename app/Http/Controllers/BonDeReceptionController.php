<?php

namespace App\Http\Controllers;

use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Envoyeur;
use App\Models\BonsDeReception; // <-- AJOUTE CETTE LIGNE

class BonDeReceptionController extends Controller
{
    public function index()
    {
        // Pour la liste
        $bons = BonsDeReception::with('produits')->orderByDesc('date')->get();
        return Inertia::render('BonsDeReceptions', [
            'bons' => $bons,
        ]);
    }

    public function create()
    {
        $envoyeurs = \App\Models\Envoyeur::orderBy('nom')->pluck('nom')->toArray();
        $produits = \App\Models\Produit::orderBy('nom')->distinct()->pluck('nom')->toArray();

        // Génère le prochain numéro de bon
        $lastBon = \App\Models\BonsDeReception::orderByDesc('id')->first();
        $nextNumber = $lastBon ? $lastBon->id + 1 : 1;
        $numero = 'BR-' . str_pad($nextNumber, 7, '0', STR_PAD_LEFT);

        return Inertia::render('BonsDeReceptions/Create', [
            'envoyeurs' => $envoyeurs,
            'produits' => $produits,
            'numero' => $numero, // Passe le numéro généré
        ]);
    }

   
    public function store(Request $request)
    {
        // Enregistre l'envoyeur AVANT la validation
        if ($request->filled('envoyeur')) {
            Envoyeur::firstOrCreate(['nom' => $request->envoyeur]);
        }

        $validated = $request->validate([
            'numero' => 'required|unique:bons_de_receptions',
            'date' => 'required|date',
            'envoyeur' => 'required|string',
            'image' => 'nullable|image|max:2048',
            'produits' => 'required|array|min:1',
            'produits.*.nom' => 'required|string',
            'produits.*.quantite' => 'required|numeric',
            'produits.*.type' => 'required|in:outillages,consommables,autres',
            'produits.*.peremption' => 'nullable|date',
            'produits.*.marque' => 'nullable|string',
            'produits.*.dosage' => 'nullable|string',
            'produits.*.description' => 'nullable|string',
            'produits.*.unite' => 'required|in:pièce,kg,litre,mètre',
            'produits.*.prix_unitaire' => 'required|numeric|min:0',
        ]);

        $imagePath = $request->file('image') ? $request->file('image')->store('bon-images', 'public') : null;

        // Calcul du prix total du bon
        $prixTotal = 0;
        foreach ($validated['produits'] as $produitData) {
            $prixTotal += ($produitData['quantite'] * $produitData['prix_unitaire']);
        }

        $bon = \App\Models\BonsDeReception::create([
            'numero' => $validated['numero'],
            'date' => $validated['date'],
            'envoyeur' => $validated['envoyeur'],
            'type' => $validated['produits'][0]['type'],
            'image_path' => $imagePath,
            'prix_total' => $prixTotal,
        ]);

        foreach ($validated['produits'] as $produitData) {
            \App\Models\Produit::create([
                'unite' => $produitData['unite'],
                'bon_id' => $bon->id,
                'nom' => $produitData['nom'],
                'quantite' => $produitData['quantite'],
                'type' => $produitData['type'],
                'peremption' => $produitData['peremption'],
                'marque' => $produitData['marque'],
                'dosage' => $produitData['dosage'],
                'description' => $produitData['description'],
                'prix_unitaire' => $produitData['prix_unitaire'],
                'prix_total' => $produitData['quantite'] * $produitData['prix_unitaire'],
            ]);

            \App\Models\Statistic::create([
                'transaction_type' => 'bon_reception',
                'product_name' => $produitData['nom'],
                'quantity' => $produitData['quantite'],
                'unite' => $produitData['unite'],
                'destination' => null,
                'personnel' => null,
                'type_transfert' => null,
                'reference_id' => $bon->id,
                'reference_type' => \App\Models\BonsDeReception::class,
                'transaction_date' => now(),
                'prix_unitaire' => $produitData['prix_unitaire'],
                'prix_total' => $produitData['quantite'] * $produitData['prix_unitaire'],
                'additional_data' => null,
            ]);
        }

        // Redirige vers la liste des bons
        return redirect()->route('bons-de-receptions.index')->with('success', 'Bon créé avec succès');
    }

    public function edit($id)
    {
        $bon = \App\Models\BonsDeReception::with('produits')->findOrFail($id);
        $envoyeurs = \App\Models\Envoyeur::orderBy('nom')->pluck('nom')->toArray();
        $produits = \App\Models\Produit::orderBy('nom')->distinct()->pluck('nom')->toArray();

        return Inertia::render('BonsDeReceptions/Edit', [
            'bon' => $bon,
            'envoyeurs' => $envoyeurs,
            'produits' => $produits,
        ]);
    }

    public function update(Request $request, $id)
    {
        $bon = \App\Models\BonsDeReception::findOrFail($id);

        $validated = $request->validate([
            'numero' => 'required|unique:bons_de_receptions,numero,' . $bon->id,
            'date' => 'required|date',
            'envoyeur' => 'required|string',
            'image' => 'nullable|image|max:2048',
            'produits' => 'required|array|min:1',
            'produits.*.nom' => 'required|string',
            'produits.*.quantite' => 'required|numeric',
            'produits.*.type' => 'required|in:outillages,consommables,autres',
            'produits.*.peremption' => 'nullable|date',
            'produits.*.marque' => 'nullable|string',
            'produits.*.dosage' => 'nullable|string',
            'produits.*.description' => 'nullable|string',
            'produits.*.unite' => 'required|in:pièce,kg,litre,mètre,ml,mg',
            'produits.*.prix_unitaire' => 'required|numeric|min:0',
        ]);

        $imagePath = $request->file('image') ? $request->file('image')->store('bon-images', 'public') : $bon->image_path;

        // Calcul du prix total du bon
        $prixTotal = 0;
        foreach ($validated['produits'] as $produitData) {
            $prixTotal += ($produitData['quantite'] * $produitData['prix_unitaire']);
        }

        $bon->update([
            'numero' => $validated['numero'],
            'date' => $validated['date'],
            'envoyeur' => $validated['envoyeur'],
            'type' => $validated['produits'][0]['type'],
            'image_path' => $imagePath,
            'prix_total' => $prixTotal,
        ]);

        // Supprime les anciens produits et recrée les nouveaux
        $bon->produits()->delete();
        foreach ($validated['produits'] as $produitData) {
            $bon->produits()->create([
                'unite' => $produitData['unite'],
                'nom' => $produitData['nom'],
                'quantite' => floatval($produitData['quantite']),
                'type' => $produitData['type'],
                'peremption' => $produitData['peremption'],
                'marque' => $produitData['marque'],
                'dosage' => $produitData['dosage'],
                'description' => $produitData['description'],
                'prix_unitaire' => $produitData['prix_unitaire'],
                'prix_total' => $produitData['quantite'] * $produitData['prix_unitaire'],
            ]);
        }

        // Historise la modification du bon
        \App\Models\Statistic::create([
            'transaction_type' => 'bon_modification',
            'product_name' => $bon->produits()->pluck('nom')->implode(', '),
            'quantity' => $bon->produits()->sum('quantite'),
            'unite' => '', // ou laisse vide ou concatène les unités
            'destination' => null,
            'personnel' => null,
            'type_transfert' => null,
            'reference_id' => $bon->id,
            'reference_type' => \App\Models\BonsDeReception::class,
            'transaction_date' => now(),
            'prix_unitaire' => null,
            'prix_total' => $bon->prix_total,
            'additional_data' => json_encode(['action' => 'modification', 'user' => auth()->user()?->name]),
        ]);

        return redirect()->route('bons-de-receptions.index')->with('success', 'Bon modifié avec succès');
    }

    public function destroy($id)
    {
        $bon = \App\Models\BonsDeReception::findOrFail($id);
        $bon->produits()->delete(); // Supprime les produits liés
        $bon->delete();

        // Historise la suppression du bon
        \App\Models\Statistic::create([
            'transaction_type' => 'bon_suppression',
            'product_name' => $bon->produits()->pluck('nom')->implode(', '),
            'quantity' => $bon->produits()->sum('quantite'),
            'unite' => '', // ou laisse vide ou concatène les unités
            'destination' => null,
            'personnel' => null,
            'type_transfert' => null,
            'reference_id' => $bon->id,
            'reference_type' => \App\Models\BonsDeReception::class,
            'transaction_date' => now(),
            'prix_unitaire' => null,
            'prix_total' => $bon->prix_total,
            'additional_data' => json_encode(['action' => 'suppression', 'user' => auth()->user()?->name]),
        ]);

        return redirect()->route('bons-de-receptions.index')->with('success', 'Bon supprimé avec succès');
    }
}