<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Bon de Transfert #{{ $stat->id }}</title>
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
        <div class="logo-container">
        <img src="{{ public_path('images/garden.png') }}" style="height:80px;">
        </div>
        <div class="header-text">
            <h1>Bon de Transfert #{{ $stat->id }}</h1>
            <p>Date: {{ $stat->transaction_date }}</p>
            <p>Personnel: {{ $stat->personnel }}</p>
            <p>Destination: {{ $stat->destination }}</p>
        </div>
        <div class="clear"></div>
        <hr>
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
                <td>{{ $stat->quantity ?? '/' }}</td>
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