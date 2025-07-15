<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Bon de Récupération #{{ $stat->id }}</title>
    <style>
        body { font-family: helvetica; }
        .header { border-bottom: 2px solid #000; margin-bottom: 20px; }
        .table { width: 100%; border-collapse: collapse; }
        .table th, .table td { border: 1px solid #ddd; padding: 8px; }
        .logo-container { float: left; margin-right: 20px; }
        .header-text { margin-left: 100px; }
        .clear { clear: both; }
        hr { border: 1px solid #000; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo-container" style="float:left; margin-right:20px;">
        <img src="{{ public_path('images/garden.png') }}" style="height:80px;">
        </div>
        <div class="header-text" style="margin-left:100px;">
            <h1>Bon de Récupération #{{ $stat->id }}</h1>
            <p>Date: {{ $stat->transaction_date }}</p>
            <p>Personnel: {{ $stat->personnel }}</p>
            <p>Destination: {{ $stat->destination }}</p>
        </div>
        <div style="clear: both;"></div>
        <hr style="border: 1px solid #000;">
    </div>
    <table class="table">
        <thead>
            <tr>
                <th>Produit</th>
                <th>Quantité</th>
                <th>Prix unitaire</th>
                <th>Prix total</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{{ $stat->product_name ?? '/' }}</td>
                <td>
                    {{ $stat->quantity !== null ? $stat->quantity . ' ' . strtoupper($stat->unite ?? '') : '/' }}
                </td>
                <td>
                    {{ $stat->prix_unitaire !== null ? number_format($stat->prix_unitaire, 2, ',', ' ') . ' DA' : '/' }}
                </td>
                <td>
                    {{ $stat->prix_total !== null ? number_format($stat->prix_total, 2, ',', ' ') . ' DA' : '/' }}
                </td>
            </tr>
        </tbody>
    </table>
</body>
</html>