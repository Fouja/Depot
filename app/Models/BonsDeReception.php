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
        'unite',
        'quantite',

        'peremption',
        'marque',
        'image_path',
        'description'
    ];

    protected $casts = [
        'date' => 'datetime',
        'peremption' => 'datetime'
    ];

    public function produits(): HasMany
    {
        return $this->hasMany(Produit::class, 'bon_id');
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->numero = 'BR-' . now()->timestamp . '-' . Str::random(4);
        });
    }
}