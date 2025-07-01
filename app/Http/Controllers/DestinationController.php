<?php

namespace App\Http\Controllers;

use App\Models\Destination;
use Illuminate\Http\Request;

class DestinationController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|unique:destinations,nom',
            'type' => 'required|in:interne,externe',
        ]);
        $destination = Destination::create($validated);
        return response()->json($destination);
    }

    public function index(Request $request)
    {
        $type = $request->query('type');
        $query = Destination::query();
        if ($type) $query->where('type', $type);
        return response()->json($query->pluck('nom'));
    }
}