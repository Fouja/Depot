<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProduitPerdu extends Model
{
    use HasFactory;

    // Add table name declaration
    protected $table = 'produits_perdus';

    protected $fillable = [
        'produit_id',
        'quantity',
        'description',
        'date_perte',
        'user_id',
        'prix_unitaire',
        'prix_total',
    ];

    public function produit()
    {
        return $this->belongsTo(Produit::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }
}