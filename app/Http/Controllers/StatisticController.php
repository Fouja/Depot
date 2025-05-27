<?php

namespace App\Http\Controllers;

use App\Models\Statistic;
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

        if ($request->filled('start_date')) {
            $query->where('transaction_date', '>=', $request->start_date);
        }

        if ($request->filled('end_date')) {
            $query->where('transaction_date', '<=', $request->end_date);
        }

        if ($request->filled('product_name')) {
            $query->where('product_name', 'like', '%' . $request->product_name . '%');
        }

        // Get paginated results
        $statistics = $query->orderBy('transaction_date', 'desc')
                           ->paginate(20)
                           ->withQueryString();

        // Get summary data for charts
        $summaryData = $this->getSummaryData($request);

        return Inertia::render('StatisticsTransactions', [
            'statistics' => $statistics,
            'summaryData' => $summaryData,
            'filters' => $request->only(['transaction_type', 'start_date', 'end_date', 'product_name'])
        ]);
    }

    public function envoyeurs(Request $request)
    {
        // Start with a base query
        $query = DB::table('bons_de_reception')
            ->select(
                'envoyeur',
                DB::raw('COUNT(*) as total_bons'),
                DB::raw('SUM(JSON_LENGTH(produits)) as total_products'),
                DB::raw('MAX(date) as last_reception_date')
            )
            ->groupBy('envoyeur');

        // Apply filters
        if ($request->filled('start_date')) {
            $query->where('date', '>=', $request->start_date);
        }

        if ($request->filled('end_date')) {
            $query->where('date', '<=', $request->end_date);
        }

        if ($request->filled('search')) {
            $query->where('envoyeur', 'like', '%' . $request->search . '%');
        }

        // Get results
        $envoyeurStats = $query->get();

        return Inertia::render('StatisticsEnvoyeurs', [
            'envoyeurStats' => $envoyeurStats,
            'filters' => $request->only(['start_date', 'end_date', 'search'])
        ]);
    }

    public function graphs(Request $request)
    {
        // Get summary data for charts
        $summaryData = $this->getSummaryData($request);
    
        return Inertia::render('StatisticsGraphs', [
            'summaryData' => $summaryData,
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
}