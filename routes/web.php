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
use App\Http\Controllers\DestinationController;
use App\Http\Controllers\StatisticPDFController;
use App\Http\Controllers\StatisticController;
use App\Http\Controllers\ProduitPerduController;

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
    Route::get('/produits-perdus', [ProduitPerduController::class, 'index'])->middleware(['auth']);
    
    // Reception forms
    Route::get('/bons-de-receptions', [BonDeReceptionController::class, 'index'])->name('bons-de-receptions.index');
    Route::get('/bons-de-receptions/create', [BonDeReceptionController::class, 'create'])->name('bons-de-receptions.create');
    Route::post('/bons-de-receptions', [BonDeReceptionController::class, 'store'])->name('bons.store');
    Route::get('/bons-de-receptions/{id}/edit', [BonDeReceptionController::class, 'edit'])->name('bons-de-receptions.edit');
    Route::put('/bons-de-receptions/{id}', [BonDeReceptionController::class, 'update'])->name('bons-de-receptions.update');
    Route::delete('/bons-de-receptions/{id}', [BonDeReceptionController::class, 'destroy'])->name('bons-de-receptions.destroy');

    // Bon de Commande
    Route::get('/bons-de-commandes', [\App\Http\Controllers\BonDeCommandeController::class, 'index'])->name('bons-de-commandes.index');
    Route::get('/bons-de-commandes/create', [\App\Http\Controllers\BonDeCommandeController::class, 'create'])->name('bons-de-commandes.create');
    Route::post('/bons-de-commandes', [\App\Http\Controllers\BonDeCommandeController::class, 'store'])->name('bons-de-commandes.store');
    Route::get('/bons-de-commandes/{id}/pdf', [\App\Http\Controllers\PDFBonDeCommandeController::class, 'generatePDF'])->name('bons-de-commandes.pdf');

    // PDF generation
    Route::get('/generate-pdf/{bonId}', [PDFController::class, 'generatePDF'])->name('generate-pdf');
        
    // Statistics
    Route::get('/statistics', [StatisticController::class, 'index'])->name('statistics');
    Route::get('/statistics/graphs', [StatisticController::class, 'graphs'])->name('statistics.graphs');
    Route::get('/statistics/transactions', [StatisticController::class, 'transactions'])->name('statistics.transactions');
    Route::get('/statistics/envoyeurs', [StatisticController::class, 'envoyeurs'])->name('statistics.envoyeurs');
    Route::get('/statistics/pdf/{id}', [StatisticPDFController::class, 'show'])->name('statistics.pdf');
    Route::get('/statistics/envoyeurs/{envoyeur}', [StatisticController::class, 'envoyeurDetail'])->name('statistics.envoyeurs.detail');

    Route::post('/produits/perdre', [ProduitPerduController::class, 'perdre'])->name('produits.perdre');
});

// Remove these duplicate routes that were outside the auth middleware
// Route::get('/bons-de-receptions', function () {
//     return Inertia::render('BonsDeReceptions');
// });
// 
// Route::post('/produits/transferer', [ProduitTransfereController::class, 'store'])->name('produits.transferer');
// Route::get('/produits-transferes', [ProduitTransfereController::class, 'index'])->name('produits.transferes');
Route::post('/destinations', [DestinationController::class, 'store'])->name('destinations.store');
Route::get('/destinations', [DestinationController::class, 'index'])->name('destinations.index');



