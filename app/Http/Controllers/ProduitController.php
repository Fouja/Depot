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
            'nom', 
            DB::raw('SUM(quantite) as quantite'), 
            DB::raw('MIN(unite) as unite'), 
            DB::raw('MIN(type) as type'),
            DB::raw('MIN(marque) as marque'),
            DB::raw('MIN(dosage) as dosage'),
            DB::raw('MIN(image_url) as image_url')
        )
        ->groupBy('nom')
        ->get();
            
        return inertia('ProduitsDepot', ['produits' => $produits]);
    }
}