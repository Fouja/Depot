<?php

namespace App\Http\Controllers;

use Barryvdh\Snappy\Facades\SnappyPdf;
use App\Models\BonDeCommande;

class PDFBonDeCommandeController extends Controller
{
    public function generatePDF($bonId)
    {
        $bon = BonDeCommande::with('produits')->findOrFail($bonId);
        $pdf = SnappyPdf::loadView('pdf.bon-de-commande', compact('bon'));
        return $pdf->stream('bon-de-commande-' . $bon->numero . '.pdf');
    }
}
