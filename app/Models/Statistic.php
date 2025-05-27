<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Statistic extends Model
{
    use HasFactory;

    protected $fillable = [
        'transaction_type',
        'product_name',
        'quantity',
        'unite',
        'destination',
        'personnel',
        'type_transfert',
        'reference_id',
        'reference_type',
        'transaction_date',
        'additional_data'
    ];

    protected $casts = [
        'transaction_date' => 'datetime',
        'additional_data' => 'array'
    ];

    // Scope for filtering by transaction type
    public function scopeOfType($query, $type)
    {
        return $query->where('transaction_type', $type);
    }

    // Scope for filtering by date range
    public function scopeBetweenDates($query, $startDate, $endDate)
    {
        return $query->whereBetween('transaction_date', [$startDate, $endDate]);
    }

    // Get the referenced model
    public function referenceable()
    {
        return $this->morphTo('reference');
    }
}
