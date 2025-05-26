<?php

namespace App\Http\Controllers;

use Barryvdh\Snappy\Facades\SnappyPdf;

class PDFController extends Controller
{
    public function generatePDF($numero)
    {
        $bon = \App\Models\BonsDeReception::with('produits')
            ->where('numero', $numero)
            ->firstOrFail();

        $pdf = SnappyPdf::loadView('pdf.bon-reception', compact('bon'));
        
        return $pdf->stream('bon-reception-'.$numero.'.pdf');
    }
}