<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProduitTransfere extends Model
{
    use HasFactory;

    protected $table = 'produits_transferes';
    
    protected $fillable = [
        'produit_id',
        'quantite',
        'destination',
        'type_transfert',
        'nom_personnel',
        'date_transfert',
        // Additional fields from Produit model
        'unite',
        'type_produit',
        'marque',
        'dosage',
        'image_url'
    ];

    protected $casts = [
        'date_transfert' => 'datetime',
    ];

    public function produit()
    {
        return $this->belongsTo(Produit::class, 'produit_id');
    }
}