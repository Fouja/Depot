<?php

namespace App\Http\Controllers;

use App\Models\Statistic;
use Barryvdh\Snappy\Facades\SnappyPdf;

class StatisticPDFController extends Controller
{
    public function show($id)
    {
        $stat = Statistic::findOrFail($id);

        if ($stat->transaction_type === 'bon_reception') {
            // Redirige vers le PDF du bon de réception existant
            return redirect()->route('generate-pdf', ['bonId' => $stat->reference_id]);
        }

        $view = match ($stat->transaction_type) {
            'transfer' => 'pdf.bon-transfert',
            'recuperation' => 'pdf.recuperation',
            default => abort(404, 'PDF non disponible pour ce type'),
        };

        $pdf = SnappyPdf::loadView($view, compact('stat'));
        return $pdf->stream('transaction-'.$stat->id.'.pdf');
    }
}