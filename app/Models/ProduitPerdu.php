<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProduitPerdu extends Model
{
    use HasFactory;

    protected $fillable = [
        'produit_id',
        'quantity',
        'description',
        'date_perte',
        'user_id'
    ];

    public function produit()
    {
        return $this->belongsTo(Produit::class);
    }
}