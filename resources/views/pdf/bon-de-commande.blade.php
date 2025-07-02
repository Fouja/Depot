<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Bon de Commande {{ $bon->numero }}</title>
    <style>
        body { font-family: helvetica; }
        .header { border-bottom: 2px solid #000; margin-bottom: 20px; }
        .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .table th, .table td { border: 1px solid #000; padding: 8px; text-align: left; }
        .logo-container { float: left; width: 100px; }
        .header-text { float: right; text-align: right; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo-container">
        </div>
        <div class="header-text">
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
                <th>Unité</th>
                <th>Type</th>
                <th>Marque</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
            @foreach($bon->produits as $produit)
                <tr>
                    <td>{{ $produit->nom }}</td>
                    <td>{{ $produit->quantite }}</td>
                    <td>{{ $produit->unite }}</td>
                    <td>{{ $produit->type }}</td>
                    <td>{{ $produit->marque }}</td>
                    <td>{{ $produit->description }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
