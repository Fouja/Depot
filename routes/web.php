<?php
namespace App\Http\Controllers;
use App\Models\Produit;
use App\Models\Bon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\PDFController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProduitTransfereController;
use App\Http\Controllers\BonDeReceptionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProduitController;

// Existing routes
Route::get('/op', function () {
    return Inertia::render('Op');
});

// Authentication routes
Route::get('/login', [AuthController::class, 'loginView'])->name('login');
Route::post('/login', [AuthController::class, 'login']);

Route::post('/logout', [AuthController::class, 'logout']);

// Protected routes
Route::middleware(['auth'])->group(function () {
    Route::get('/', [AuthController::class, 'homeView'])->name('home');
    Route::get('/test', function () {
        return Inertia::render('Test');
    });
    
    // New Inertia page routes
    // Products in depot
    Route::get('/produits-depot', [ProduitController::class, 'index'])->name('produits.depot');
    
    // Transferred products
    Route::get('/produits-transferes', [ProduitTransfereController::class, 'index'])->name('produits.transferes');
    Route::post('/produits/transferer', [ProduitTransfereController::class, 'transferer'])->name('produits.transferer');
    Route::post('/produits/recuperer', [ProduitTransfereController::class, 'recuperer'])->name('produits.recuperer');
    
    // Lost products
    Route::get('/produits-perdus', function () {
        return Inertia::render('ProduitsPerdus');
    });
    
    // Reception forms
    Route::get('/bons-de-receptions', [BonDeReceptionController::class, 'index'])->name('bons.index');
    Route::get('/bons-de-receptions/create', function () {
        return Inertia::render('BonsDeReceptions/Create');
    })->name('bons.create');
    Route::post('/bons-de-receptions', [BonDeReceptionController::class, 'store'])->name('bons.store');
    
    // PDF generation
    Route::get('/generate-pdf/{numero}', [PDFController::class, 'generatePDF'])->name('generate-pdf');
        
    // Statistics
    Route::get('/statistics', [StatisticController::class, 'index'])->name('statistics');
    Route::get('/statistics/graphs', [StatisticController::class, 'graphs'])->name('statistics.graphs');
    Route::get('/statistics/transactions', [StatisticController::class, 'transactions'])->name('statistics.transactions');
    Route::get('/statistics/envoyeurs', [StatisticController::class, 'envoyeurs'])->name('statistics.envoyeurs');
});

// Remove these duplicate routes that were outside the auth middleware
// Route::get('/bons-de-receptions', function () {
//     return Inertia::render('BonsDeReceptions');
// });
// 
// Route::post('/produits/transferer', [ProduitTransfereController::class, 'store'])->name('produits.transferer');
// Route::get('/produits-transferes', [ProduitTransfereController::class, 'index'])->name('produits.transferes');



