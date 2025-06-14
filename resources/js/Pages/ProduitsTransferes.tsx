import React, { useState, useMemo, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router } from '@inertiajs/react';

interface Transfert {
    id: number;
    produit_id: string;
    quantite: number;
    destination: string;
    type_transfert: 'interne' | 'externe';
    nom_personnel: string | null;
    date_transfert: string;
    created_at: string;
    updated_at: string;
    // Additional fields from ProduitsDepot
    type_produit: string;
    unite: string;
    marque?: string;
    dosage?: string;
    image_url?: string;
}

export default function ProduitsTransferes() {
    // Change this line to access the correct prop name
    const props = usePage().props;
    console.log('Props received:', props); // Debug log
    
    // Try both possible prop names
    const transferts = props.transferts || props.produitsTransferes || [];
    
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [sortField, setSortField] = useState('date_transfert');
    const [sortDirection, setSortDirection] = useState('desc');
    const [isLoading, setIsLoading] = useState(true);
    
    // Simulate loading effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);
    const handleReturnToDepot = (transfertId: number) => {
        if (confirm('Êtes-vous sûr de vouloir récupérer ce produit au dépôt?')) {
            router.post('/produits/recuperer', { transfert_id: transfertId });
            // No need for onSuccess callback as the controller will handle the redirect
        }
    };
    // Filter transfers based on search term and type
    const filteredTransferts = useMemo(() => {
        if (!Array.isArray(transferts)) return [];
        
        return transferts.filter((transfert) => {
            const matchesSearch = 
                transfert.produit_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transfert.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (transfert.nom_personnel && transfert.nom_personnel.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (transfert.type_produit && transfert.type_produit.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (transfert.marque && transfert.marque.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (transfert.dosage && transfert.dosage.toLowerCase().includes(searchTerm.toLowerCase()));
                
            const matchesType = 
                filterType === 'all' || 
                transfert.type_transfert === filterType;
                
            return matchesSearch && matchesType;
        });
    }, [transferts, searchTerm, filterType]);
    
    // Sort transfers
    const sortedTransferts = useMemo(() => {
        if (!filteredTransferts.length) return [];
        
        return [...filteredTransferts].sort((a, b) => {
            if (sortField === 'quantite') {
                return sortDirection === 'asc' 
                    ? a.quantite - b.quantite 
                    : b.quantite - a.quantite;
            }
            
            if (sortField === 'date_transfert') {
                return sortDirection === 'asc'
                    ? new Date(a.date_transfert).getTime() - new Date(b.date_transfert).getTime()
                    : new Date(b.date_transfert).getTime() - new Date(a.date_transfert).getTime();
            }
            
            const valueA = a[sortField as keyof Transfert]?.toString().toLowerCase() || '';
            const valueB = b[sortField as keyof Transfert]?.toString().toLowerCase() || '';
            
            if (sortDirection === 'asc') {
                return valueA.localeCompare(valueB);
            } else {
                return valueB.localeCompare(valueA);
            }
        });
    }, [filteredTransferts, sortField, sortDirection]);
    
    // Calculate total quantity from all transfers (not just filtered)
    const totalQuantity = useMemo(() => {
        if (!Array.isArray(transferts)) return 0;
        return transferts.reduce((sum, transfert) => sum + transfert.quantite, 0);
    }, [transferts]);
    
    // Handle sort
    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };
    
    // Get sort icon
    const getSortIcon = (field: string) => {
        if (sortField !== field) return '↕️';
        return sortDirection === 'asc' ? '↑' : '↓';
    };
    
    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };
    
    // Get row background based on product type
    const getRowBackground = (type: string) => {
        if (!type) return 'hover:bg-gray-50';
        
        switch(type.toLowerCase()) {
            case 'médicament':
                return 'bg-blue-50 hover:bg-blue-100';
            case 'matériel':
                return 'bg-green-50 hover:bg-green-100';
            case 'consommable':
                return 'bg-yellow-50 hover:bg-yellow-100';
            default:
                return 'hover:bg-gray-50';
        }
    };
    
    return (
        <AuthenticatedLayout>
            <div className="p-6 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-blue-800 mb-4 md:mb-0">
                        <span className="inline-block mr-2">🔄</span> 
                        Produits Transférés
                    </h1>
                    
                    {/* Search filter */}
                    <div className="w-full md:w-1/3">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                                </svg>
                            </div>
                            <input
                                type="text"
                                className="bg-white border border-blue-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 transition-all duration-300"
                                placeholder="Rechercher par produit, type, marque..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                
                {/* Stats cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-100 mr-4">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Nombre de transferts</p>
                                <p className="text-xl font-bold text-gray-800">{filteredTransferts.length}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-100 mr-4">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Quantité totale transférée</p>
                                <p className="text-xl font-bold text-gray-800">{totalQuantity}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-500">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-purple-100 mr-4">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Types de transferts</p>
                                <p className="text-xl font-bold text-gray-800">
                                    {new Set(filteredTransferts.map(t => t.type_transfert)).size}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Filter buttons */}
                <div className="flex space-x-2 mb-6">
                    <button
                        className={`px-4 py-2 rounded-lg ${filterType === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                        onClick={() => setFilterType('all')}
                    >
                        Tous
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg ${filterType === 'interne' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                        onClick={() => setFilterType('interne')}
                    >
                        Transferts Internes
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg ${filterType === 'externe' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                        onClick={() => setFilterType('externe')}
                    >
                        Transferts Externes
                    </button>
                </div>
                
                {/* Transfers table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-all duration-300">
                    {isLoading ? (
                        <div className="flex justify-center items-center p-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-blue-50">
                                    <tr>
                                        <th 
                                            scope="col" 
                                            className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider cursor-pointer hover:bg-blue-100 transition-colors duration-200"
                                            onClick={() => handleSort('date_transfert')}
                                        >
                                            Date {getSortIcon('date_transfert')}
                                        </th>
                                        <th 
                                            scope="col" 
                                            className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider cursor-pointer hover:bg-blue-100 transition-colors duration-200"
                                            onClick={() => handleSort('produit_id')}
                                        >
                                            Produit {getSortIcon('produit_id')}
                                        </th>
                                        <th 
                                            scope="col" 
                                            className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider cursor-pointer hover:bg-blue-100 transition-colors duration-200"
                                            onClick={() => handleSort('type_produit')}
                                        >
                                            Type Produit {getSortIcon('type_produit')}
                                        </th>
                                        <th 
                                            scope="col" 
                                            className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider cursor-pointer hover:bg-blue-100 transition-colors duration-200"
                                            onClick={() => handleSort('quantite')}
                                        >
                                            Quantité {getSortIcon('quantite')}
                                        </th>
                                        <th 
                                            scope="col" 
                                            className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider cursor-pointer hover:bg-blue-100 transition-colors duration-200"
                                            onClick={() => handleSort('unite')}
                                        >
                                            Unité {getSortIcon('unite')}
                                        </th>
                                        <th 
                                            scope="col" 
                                            className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider cursor-pointer hover:bg-blue-100 transition-colors duration-200"
                                            onClick={() => handleSort('marque')}
                                        >
                                            Marque {getSortIcon('marque')}
                                        </th>
                                        <th 
                                            scope="col" 
                                            className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider cursor-pointer hover:bg-blue-100 transition-colors duration-200"
                                            onClick={() => handleSort('dosage')}
                                        >
                                            Dosage {getSortIcon('dosage')}
                                        </th>
                                        <th 
                                            scope="col" 
                                            className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider cursor-pointer hover:bg-blue-100 transition-colors duration-200"
                                            onClick={() => handleSort('type_transfert')}
                                        >
                                            Type Transfert {getSortIcon('type_transfert')}
                                        </th>
                                        <th 
                                            scope="col" 
                                            className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider cursor-pointer hover:bg-blue-100 transition-colors duration-200"
                                            onClick={() => handleSort('destination')}
                                        >
                                            Destination {getSortIcon('destination')}
                                        </th>
                                        <th 
                                            scope="col" 
                                            className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider cursor-pointer hover:bg-blue-100 transition-colors duration-200"
                                            onClick={() => handleSort('nom_personnel')}
                                        >
                                            Personnel {getSortIcon('nom_personnel')}
                                        </th>
                                        <th 
                                            scope="col" 
                                            className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider"
                                        >
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {sortedTransferts.length > 0 ? (
                                        sortedTransferts.map((transfert: Transfert) => (
                                            <tr key={transfert.id} className={`${getRowBackground(transfert.type_produit)} transition-colors duration-200`}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(transfert.date_transfert)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                                    {transfert.produit_id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap capitalize text-gray-700">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                        {transfert.type_produit || '-'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-2 w-20 bg-gray-200 rounded-full mr-2">
                                                            <div 
                                                                className="h-2 bg-blue-500 rounded-full" 
                                                                style={{ width: `${Math.min(100, (transfert.quantite / (totalQuantity * 0.2)) * 100)}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="font-bold text-gray-900">{transfert.quantite}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                                    {transfert.unite || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                                    {transfert.marque || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                                    {transfert.dosage || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        transfert.type_transfert === 'interne' 
                                                            ? 'bg-blue-100 text-blue-800' 
                                                            : 'bg-purple-100 text-purple-800'
                                                    }`}>
                                                        {transfert.type_transfert === 'interne' ? 'Interne' : 'Externe'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                                    {transfert.destination}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                                    {transfert.nom_personnel || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => handleReturnToDepot(transfert.id)}
                                                        className="text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-md transition-colors duration-200"
                                                    >
                                                        Récupérer au Dépôt
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={12} className="px-6 py-8 text-center text-gray-500">
                                                Aucun transfert trouvé
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
