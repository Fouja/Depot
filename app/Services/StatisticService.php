<?php

namespace App\Services;

use App\Models\Statistic;
use App\Models\Produit;
use App\Models\ProduitTransfere;
use App\Models\BonsDeReception;
use Carbon\Carbon;

class StatisticService
{
    public static function recordProductAdded(Produit $produit)
    {
        Statistic::create([
            'transaction_type' => 'product_added',
            'product_name' => $produit->nom,
            'quantity' => $produit->quantite,
            'unite' => $produit->unite,
            'reference_id' => $produit->id,
            'reference_type' => Produit::class,
            'transaction_date' => $produit->created_at ?? now(),
            'additional_data' => [
                'type' => $produit->type,
                'marque' => $produit->marque,
                'dosage' => $produit->dosage,
                'bon_id' => $produit->bon_id
            ]
        ]);
    }

    public static function recordTransfer(ProduitTransfere $transfer)
    {
        Statistic::create([
            'transaction_type' => 'transfer',
            'product_name' => $transfer->produit->nom ?? 'Unknown',
            'quantity' => $transfer->quantite,
            'unite' => $transfer->unite,
            'destination' => $transfer->destination,
            'personnel' => $transfer->nom_personnel,
            'type_transfert' => $transfer->type_transfert,
            'reference_id' => $transfer->id,
            'reference_type' => ProduitTransfere::class,
            'transaction_date' => $transfer->date_transfert,
            'additional_data' => [
                'type_produit' => $transfer->type_produit,
                'marque' => $transfer->marque,
                'dosage' => $transfer->dosage,
                'produit_id' => $transfer->produit_id
            ]
        ]);
    }

    public static function recordRecuperation($productName, $quantity, $unite, $personnel, $originalTransferId)
    {
        Statistic::create([
            'transaction_type' => 'recuperation',
            'product_name' => $productName,
            'quantity' => $quantity,
            'unite' => $unite,
            'personnel' => $personnel,
            'reference_id' => $originalTransferId,
            'reference_type' => ProduitTransfere::class,
            'transaction_date' => now(),
            'additional_data' => [
                'original_transfer_id' => $originalTransferId
            ]
        ]);
    }

    public static function recordBonDeReception(BonsDeReception $bon)
    {
        Statistic::create([
            'transaction_type' => 'bon_reception',
            'product_name' => 'Bon de Réception',
            'quantity' => $bon->quantite,
            'unite' => $bon->unite,
            'reference_id' => $bon->id,
            'reference_type' => BonsDeReception::class,
            'transaction_date' => $bon->date,
            'additional_data' => [
                'numero' => $bon->numero,
                'envoyeur' => $bon->envoyeur,
                'type' => $bon->type,
                'marque' => $bon->marque
            ]
        ]);
    }
}