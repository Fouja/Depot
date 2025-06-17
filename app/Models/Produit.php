<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Produit extends Model
{
    protected $fillable = [
        'bon_id',
        'nom',
        'quantite',
        'unite',  // Add this line
        'type',
        'peremption',
        'marque',
        'description',
        'dosage',
        'image_url',
        'prix_unitaire',
        'prix_total',
    ];

    public function bon(): BelongsTo
    {
        return $this->belongsTo(BonsDeReception::class, 'bon_id');
    }
}