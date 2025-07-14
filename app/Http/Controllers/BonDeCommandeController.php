<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\BonDeCommande;
use App\Models\ProduitBonDeCommande;

class BonDeCommandeController extends Controller
{
    public function index()
    {
        $bons = BonDeCommande::with('produits')->orderByDesc('date')->get();
        return Inertia::render('BonsDeCommandes', [
            'bons' => $bons,
        ]);
    }

    public function create()
    {
        $lastBon = BonDeCommande::orderByDesc('id')->first();
        $nextNumber = $lastBon ? $lastBon->id + 1 : 1;
        $numero = 'BC-' . str_pad($nextNumber, 7, '0', STR_PAD_LEFT);

        return Inertia::render('BonsDeCommandes/CreateBon', [
            'numero' => $numero,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'numero' => 'required|unique:bon_de_commandes',
            'date' => 'required|date',
            'envoyeur' => 'required|string',
            'produits' => 'required|array|min:1',
            'produits.*.nom' => 'required|string',
            'produits.*.quantite' => 'required|numeric',
            'produits.*.type' => 'required|string',
            'produits.*.marque' => 'nullable|string',
            'produits.*.description' => 'nullable|string',
            'produits.*.unite' => 'required|string',
        ]);

        $bon = BonDeCommande::create([
            'numero' => $validated['numero'],
            'date' => $validated['date'],
            'envoyeur' => $validated['envoyeur'],
        ]);

        foreach ($validated['produits'] as $produit) {
            $bon->produits()->create($produit);
        }

        return redirect('/bons-de-commandes');
    }
}