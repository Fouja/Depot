<?php

namespace App\Http\Controllers;

use App\Models\ProduitPerdu;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProduitPerduController extends Controller
{
    public function index()
    {
        return Inertia::render('ProduitsPerdus', [
            'perdus' => ProduitPerdu::with('produit')->latest()->get()
        ]);
    }
}