<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use Inertia\Inertia;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;

class ProduitController extends Controller
{
    public function index()
    {
        // Group products by name only and sum their quantities
        // Using MIN() instead of ANY_VALUE() for MariaDB compatibility
        $produits = Produit::select(
            DB::raw('MIN(id) as id'),
            'nom', 
            'type',
            'unite',
            'marque',
            'dosage',
            'image_url',
            'prix_unitaire',
            DB::raw('SUM(quantite) as quantite')
        )
        ->groupBy('nom', 'type', 'unite', 'marque', 'dosage', 'image_url', 'prix_unitaire')
        ->get();
            
        return inertia('ProduitsDepot', ['produits' => $produits]);
    }

    public function create()
    {
        $produits = Produit::distinct()->orderBy('nom')->pluck('nom');
        return Inertia::render('BonsDeReceptions/Create', [
            'produits' => $produits,
        ]);
    }
}