<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BonDeCommande extends Model
{
    protected $table = 'bon_de_commandes';

    protected $fillable = [
        'numero',
        'date',
        'envoyeur',
    ];

    protected $casts = [
        'date' => 'datetime',
    ];

    public function produits(): HasMany
    {
        return $this->hasMany(ProduitBonDeCommande::class, 'bon_id');
    }
}
