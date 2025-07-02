<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProduitBonDeCommande extends Model
{
    protected $table = 'produits_bon_de_commandes';

    protected $fillable = [
        'bon_id',
        'nom',
        'quantite',
        'unite',
        'type',
        'marque',
        'description',
    ];

    public function bon(): BelongsTo
    {
        return $this->belongsTo(BonDeCommande::class, 'bon_id');
    }
}
