<?php

namespace App\Http\Controllers;

use Barryvdh\Snappy\Facades\SnappyPdf;

class PDFController extends Controller
{
    public function generatePDF($bonId)
    {
        $bon = \App\Models\BonsDeReception::with('produits')
            ->findOrFail($bonId); // Utilise l'ID

        $pdf = SnappyPdf::loadView('pdf.bon-reception', compact('bon'));
        
        return $pdf->stream('bon-reception-'.$bon->numero.'.pdf');
    }
}
