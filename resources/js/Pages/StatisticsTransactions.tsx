import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';

interface StatisticData {
    prix_total: number;
    prix_unitaire: number;
    id: number;
    transaction_type: string;
    product_name: string;
    quantity: number;
    unite: string;
    destination?: string;
    personnel?: string;
    transaction_date: string;
    additional_data?: any;
}

interface StatisticsProps {
    statistics: {
        data: StatisticData[];
        links: any;
        meta: any;
    };
    summaryData: any;
    filters: {
        transaction_type?: string;
        start_date?: string;
        end_date?: string;
        product_name?: string;
        period?: string; // New filter for period (day/month/year)
    };
}

export default function StatisticsTransactions({ statistics, summaryData, filters }: StatisticsProps) {
    const [localFilters, setLocalFilters] = useState(filters);

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        router.get('/statistics/transactions', newFilters, { preserveState: true });
    };

    const getTransactionTypeLabel = (type: string) => {
        const labels: { [key: string]: string } = {
            'product_added': 'Produit Ajouté',
            'transfer': 'Transfert',
            'recuperation': 'Récupération',
            'bon_reception': 'Bon de Réception'
        };
        return labels[type] || type;
    };

    const getTransactionTypeColor = (type: string) => {
        const colors: { [key: string]: string } = {
            'product_added': 'bg-green-100 text-green-800',
            'transfer': 'bg-blue-100 text-blue-800',
            'recuperation': 'bg-yellow-100 text-yellow-800',
            'bon_reception': 'bg-purple-100 text-purple-800'
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AuthenticatedLayout>
            <Head title="Historique des Transactions" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold">Historique des Transactions</h1>
                                <button 
                                    onClick={() => router.get('/statistics')} 
                                    className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                                >
                                    Retour
                                </button>
                            </div>
                            
                            {/* Enhanced Filters */}
                            <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Type de Transaction
                                    </label>
                                    <select
                                        value={localFilters.transaction_type || ''}
                                        onChange={(e) => handleFilterChange('transaction_type', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    >
                                        <option value="">Tous les types</option>
                                        <option value="product_added">Produit Ajouté</option>
                                        <option value="transfer">Transfert</option>
                                        <option value="recuperation">Récupération</option>
                                        <option value="bon_reception">Bon de Réception</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Période
                                    </label>
                                    <select
                                        value={localFilters.period || 'custom'}
                                        onChange={(e) => handleFilterChange('period', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    >
                                        <option value="today">Aujourd'hui</option>
                                        <option value="yesterday">Hier</option>
                                        <option value="this_week">Cette semaine</option>
                                        <option value="this_month">Ce mois</option>
                                        <option value="this_year">Cette année</option>
                                        <option value="custom">Personnalisé</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date de début
                                    </label>
                                    <input
                                        type="date"
                                        value={localFilters.start_date || ''}
                                        onChange={(e) => handleFilterChange('start_date', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                        disabled={localFilters.period !== 'custom'}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date de fin
                                    </label>
                                    <input
                                        type="date"
                                        value={localFilters.end_date || ''}
                                        onChange={(e) => handleFilterChange('end_date', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                        disabled={localFilters.period !== 'custom'}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nom du Produit
                                    </label>
                                    <input
                                        type="text"
                                        value={localFilters.product_name || ''}
                                        onChange={(e) => handleFilterChange('product_name', e.target.value)}
                                        placeholder="Rechercher un produit..."
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    />
                                </div>
                            </div>

                            {/* Summary Cards */}
                            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                                {summaryData.transactionCounts.map((item: any) => (
                                    <div key={item.transaction_type} className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-lg font-semibold">{getTransactionTypeLabel(item.transaction_type)}</h3>
                                        <p className="text-2xl font-bold text-blue-600">{item.count}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Statistics Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Type
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Produit
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Quantité
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Prix unitaire
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Prix total
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Destination/Personnel
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                PDF
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {statistics.data.map((stat) => (
                                            <tr key={stat.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(stat.transaction_date).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap`}>
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTransactionTypeColor(stat.transaction_type)}`}>
                                                        {getTransactionTypeLabel(stat.transaction_type)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {stat.product_name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {stat.quantity} {stat.unite}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {stat.prix_unitaire ? Number(stat.prix_unitaire).toFixed(2) + ' DA' : '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {stat.prix_total ? Number(stat.prix_total).toFixed(2) + ' DA' : '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {stat.destination || stat.personnel || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <button
                                                        className="bg-blue-500 text-white px-2 py-1 rounded"
                                                        onClick={() => window.open(`/statistics/pdf/${stat.id}`, '_blank')}
                                                    >
                                                        Télécharger PDF
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="mt-6">
                                {/* Add pagination component here if needed */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}