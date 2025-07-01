<?php

namespace App\Http\Controllers;

use App\Models\Statistic;
use Barryvdh\Snappy\Facades\SnappyPdf;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class StatisticController extends Controller
{
    public function index(Request $request)
    {
        // Get summary data for charts
        $summaryData = $this->getSummaryData($request);
        
        return Inertia::render('StatisticsHome', [
            'summaryData' => $summaryData,
            'filters' => $request->only(['transaction_type', 'start_date', 'end_date', 'product_name'])
        ]);
    }
    
    public function transactions(Request $request)
    {
        $query = Statistic::query();

        // Apply filters
        if ($request->filled('transaction_type')) {
            $query->where('transaction_type', $request->transaction_type);
        }

        if ($request->filled('product_name')) {
            $query->where('product_name', 'like', '%' . $request->product_name . '%');
        }

        // To show all history by default:
        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('transaction_date', [$request->start_date, $request->end_date]);
        }
        // else: no date filter, show all

        $startDate = $request->start_date ?? null;
        $endDate = $request->end_date ?? null;

        // Get paginated results
        $statistics = $query->orderBy('transaction_date', 'desc')
                           ->paginate(20)
                           ->withQueryString();

        // Get summary data for charts
        $summaryData = $this->getSummaryData($request);

        return Inertia::render('StatisticsTransactions', [
            'statistics' => $statistics,
            'summaryData' => $summaryData,
            'filters' => [
                'transaction_type' => $request->transaction_type,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'product_name' => $request->product_name,
                'period' => $request->period,
            ]
        ]);
    }

    public function envoyeurs(Request $request)
    {
        $startDate = $request->start_date ?? null;
        $endDate = $request->end_date ?? null;

        $query = \App\Models\BonsDeReception::query()
            ->select(
                'envoyeur',
                DB::raw('COUNT(*) as total_operations'),
                DB::raw('SUM(prix_total) as total_prix'),
                DB::raw('MAX(date) as last_operation_date')
            )
            ->groupBy('envoyeur');

        if ($startDate) {
            $query->where('date', '>=', $startDate);
        }
        if ($endDate) {
            $query->where('date', '<=', $endDate);
        }
        if ($request->filled('search')) {
            $query->where('envoyeur', 'like', '%' . $request->search . '%');
        }

        $envoyeurStats = $query->get();

        return Inertia::render('StatisticsEnvoyeurs', [
            'envoyeurStats' => $envoyeurStats,
            'filters' => $request->only(['start_date', 'end_date', 'search'])
        ]);
    }

    public function graphs(Request $request)
    {
        // Génère la liste des 6 derniers mois (format YYYY-MM)
        $months = collect(range(0, 5))->map(function ($i) {
            return now()->subMonths(5 - $i)->format('Y-m');
        })->toArray();

        // Dépôt : quantité et prix total par mois
        $depotStats = Statistic::select(
                DB::raw("DATE_FORMAT(transaction_date, '%Y-%m') as month"),
                DB::raw('SUM(quantity) as total_quantity'),
                DB::raw('SUM(prix_total) as total_prix')
            )
            ->where('transaction_type', 'bon_reception')
            ->groupBy('month')
            ->get()
            ->keyBy('month');

        $depotData = [
            'labels' => $months,
            'quantities' => array_map(fn($m) => $depotStats[$m]->total_quantity ?? 0, $months),
            'prix_totals' => array_map(fn($m) => $depotStats[$m]->total_prix ?? 0, $months),
        ];

        // Comparatif : pour chaque mois, quantité/prix total de chaque type
        $types = [
            'bon_reception' => 'Dépôt',
            'perte' => 'Perdu',
            'transfer' => 'Transféré',
        ];
        $comparatifDatasets = [];
        foreach ($types as $typeKey => $typeLabel) {
            $stats = Statistic::select(
                    DB::raw("DATE_FORMAT(transaction_date, '%Y-%m') as month"),
                    DB::raw('SUM(quantity) as total_quantity'),
                    DB::raw('SUM(prix_total) as total_prix')
                )
                ->where('transaction_type', $typeKey)
                ->groupBy('month')
                ->get()
                ->keyBy('month');

            $comparatifDatasets[] = [
                'label' => "Quantité $typeLabel",
                'data' => array_map(fn($m) => $stats[$m]->total_quantity ?? 0, $months),
                'backgroundColor' => $typeKey === 'bon_reception' ? 'rgba(75,192,192,0.6)' : ($typeKey === 'perte' ? 'rgba(255,99,132,0.6)' : 'rgba(153,102,255,0.6)'),
                'borderColor' => $typeKey === 'bon_reception' ? 'rgba(75,192,192,1)' : ($typeKey === 'perte' ? 'rgba(255,99,132,1)' : 'rgba(153,102,255,1)'),
                'borderWidth' => 1,
                'stack' => 'quantite',
            ];
            $comparatifDatasets[] = [
                'label' => "Prix total $typeLabel",
                'data' => array_map(fn($m) => $stats[$m]->total_prix ?? 0, $months),
                'backgroundColor' => $typeKey === 'bon_reception' ? 'rgba(255,206,86,0.6)' : ($typeKey === 'perte' ? 'rgba(255,159,64,0.6)' : 'rgba(54,162,235,0.6)'),
                'borderColor' => $typeKey === 'bon_reception' ? 'rgba(255,206,86,1)' : ($typeKey === 'perte' ? 'rgba(255,159,64,1)' : 'rgba(54,162,235,1)'),
                'borderWidth' => 1,
                'stack' => 'prix',
                'yAxisID' => 'y1',
                'type' => 'bar',
            ];
        }

        return Inertia::render('StatisticsGraphs', [
            'depotData' => $depotData,
            'comparatifData' => [
                'labels' => $months,
                'datasets' => $comparatifDatasets,
            ],
            'filters' => $request->only(['transaction_type', 'start_date', 'end_date', 'product_name'])
        ]);
    }

    private function getSummaryData($request)
    {
        $startDate = $request->start_date ?? Carbon::now()->subMonth()->format('Y-m-d');
        $endDate = $request->end_date ?? Carbon::now()->format('Y-m-d');

        // Transaction counts by type
        $transactionCounts = Statistic::select('transaction_type', DB::raw('count(*) as count'))
            ->betweenDates($startDate, $endDate)
            ->groupBy('transaction_type')
            ->get();

        // Daily transaction trends
        $dailyTrends = Statistic::select(
                DB::raw('DATE(transaction_date) as date'),
                'transaction_type',
                DB::raw('count(*) as count')
            )
            ->betweenDates($startDate, $endDate)
            ->groupBy('date', 'transaction_type')
            ->orderBy('date')
            ->get();

        // Top products by activity
        $topProducts = Statistic::select('product_name', DB::raw('count(*) as activity_count'))
            ->betweenDates($startDate, $endDate)
            ->groupBy('product_name')
            ->orderBy('activity_count', 'desc')
            ->limit(10)
            ->get();

        // Quantity movements
        $quantityMovements = Statistic::select(
                'transaction_type',
                DB::raw('SUM(CASE WHEN transaction_type = "transfer" THEN -quantity ELSE quantity END) as net_quantity')
            )
            ->betweenDates($startDate, $endDate)
            ->groupBy('transaction_type')
            ->get();

        return [
            'transactionCounts' => $transactionCounts,
            'dailyTrends' => $dailyTrends,
            'topProducts' => $topProducts,
            'quantityMovements' => $quantityMovements,
            'dateRange' => ['start' => $startDate, 'end' => $endDate]
        ];
    }

    public function envoyeurDetail($envoyeur, Request $request)
    {
        $bons = \App\Models\BonsDeReception::where('envoyeur', $envoyeur)
            ->orderByDesc('date')
            ->get();

        return Inertia::render('StatisticsEnvoyeurDetail', [
            'envoyeur' => $envoyeur,
            'bons' => $bons,
        ]);
    }
}

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
            'recuperation' => 'pdf.bon-recuperation',
            default => abort(404, 'PDF non disponible pour ce type'),
        };

        $pdf = SnappyPdf::loadView($view, compact('stat'));
        return $pdf->stream('transaction-'.$stat->id.'.pdf');
    }
}