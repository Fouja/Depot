<?php

namespace App\Http\Controllers;

use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BonDeReceptionController extends Controller
{
    public function index()
    {
        return Inertia::render('BonsDeReceptions', [
            'bons' => \App\Models\BonsDeReception::with('produits')->latest()->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('BonsDeReceptions');
    }

   
    public function store(Request $request)
    {
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
            'produits.*.marque' => 'required|string',
            'produits.*.dosage' => 'nullable|string',
            'produits.*.description' => 'nullable|string',
            'produits.*.unite' => 'required|in:pièce,kg,litre,mètre',
        ]);

        $imagePath = $request->file('image') ? $request->file('image')->store('bon-images', 'public') : null;

        $bon = \App\Models\BonsDeReception::create([
            'numero' => $validated['numero'],
            'date' => $validated['date'],
            'envoyeur' => $validated['envoyeur'],
            'type' => $validated['produits'][0]['type'],
            'image_path' => $imagePath
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
                'description' => $produitData['description']
            ]);
        }

        return redirect()->route('generate-pdf', ['numero' => $bon->numero]);
    }
}