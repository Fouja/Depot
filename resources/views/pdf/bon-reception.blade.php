<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Bon de Réception {{ $bon->numero }}</title>
    <style>
        body { 
            font-family: helvetica; 
        }
        .header { 
            border-bottom: 2px solid #000; 
            margin-bottom: 20px; 
        }
        .table { 
            width: 100%; 
            border-collapse: collapse; 
        }
        .table th, .table td { 
            border: 1px solid #ddd; 
            padding: 8px; 
        }
        .logo-container {
            float: left;
            margin-right: 20px;
        }
        .header-text {
            margin-left: 100px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo-container">
            <img src="{{ public_path('images/garden.png') }}" style="height:80px;">
        </div>
        <div class="header-text">
            <h1>Bon de Réception #{{ $bon->numero }}</h1>
            <p>Date: {{ $bon->date }}</p>
            <p>Fournisseur: {{ $bon->envoyeur }}</p>
        </div>
        <div style="clear: both;"></div>
        <hr style="border: 1px solid #000;">
    </div>

    <h3>Produits</h3>
    <table class="table">
        <thead>
            <tr>
                <th>Nom</th>
                <th>Quantité</th>
                <th>Type</th>
                <th>Marque</th>
                <th>Dosage</th>
                <th>Péremption</th>
                <th>Prix unitaire</th>
                <th>Prix total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($bon->produits as $produit)
            <tr>
                <td>{{ $produit->nom ?? '/' }}</td>
                <td>{{ $produit->quantite ?? '/' }}</td>
                <td>{{ $produit->type ?? '/' }}</td>
                <td>{{ $produit->marque ?? '/' }}</td>
                <td>{{ $produit->dosage ?? '/' }}</td>
                <td>{{ $produit->peremption ?? '/' }}</td>
                <td>
                    {{ $produit->prix_unitaire !== null ? number_format($produit->prix_unitaire, 2, ',', ' ') . ' DA' : '/' }}
                </td>
                <td>
                    {{ $produit->prix_total !== null ? number_format($produit->prix_total, 2, ',', ' ') . ' DA' : '/' }}
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div style="margin-top: 20px; text-align: right; font-weight: bold;">
        Prix total du bon : {{ number_format($bon->prix_total, 2, ',', ' ') }} DA
    </div>
</body>
</html>