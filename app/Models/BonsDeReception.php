<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class BonsDeReception extends Model
{
    protected $table = 'bons_de_receptions'; // Explicit table name

    protected $fillable = [
        'numero',
        'date',
        'envoyeur',
        'type',
        'image_path',
        'prix_total',
        'description',
    ];

    protected $casts = [
        'date' => 'datetime',
        'peremption' => 'datetime'
    ];

    public function produits(): HasMany
    {
        return $this->hasMany(Produit::class, 'bon_id');
    }

    
}