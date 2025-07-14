import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';

export default function StatisticsHome() {
    const navigateTo = (path: string) => {
        router.get(path);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Statistiques" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl font-bold mb-6">Statistiques de la Pépinière</h1>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                                {/* Card 1: Historique des Transactions */}
                                <div 
                                    onClick={() => navigateTo('/statistics/transactions')}
                                    className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-blue-200"
                                >
                                    <div className="text-blue-600 text-4xl mb-4">📊</div>
                                    <h3 className="text-xl font-semibold text-blue-800 mb-2">Historique des Transactions</h3>
                                    <p className="text-blue-600">Consultez l'historique complet des transactions avec filtres par date, type et produit.</p>
                                </div>
                                
                                {/* Card 2: Statistiques par Envoyeur */}
                                <div 
                                    onClick={() => navigateTo('/statistics/envoyeurs')}
                                    className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-green-200"
                                >
                                    <div className="text-green-600 text-4xl mb-4">👥</div>
                                    <h3 className="text-xl font-semibold text-green-800 mb-2">Statistiques par Fournisseur</h3>
                                    <p className="text-green-600">Analysez les données par envoyeur pour identifier les sources principales.</p>
                                </div>
                                
                                {/* Card 3: Graphiques */}
                                <div 
                                    onClick={() => navigateTo('/statistics/graphs')}
                                    className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-purple-200"
                                >
                                    <div className="text-purple-600 text-4xl mb-4">📈</div>
                                    <h3 className="text-xl font-semibold text-purple-800 mb-2">Graphiques</h3>
                                    <p className="text-purple-600">Visualisez les données de produits en dépôt et transférés sous forme de graphiques.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}