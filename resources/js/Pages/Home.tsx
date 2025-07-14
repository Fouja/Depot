import React from 'react';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';

export default function Home() {
    return (
        <AuthenticatedLayout>
            <div className="py-8 bg-green-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* En-tête simple */}
                    <div className="relative rounded-xl overflow-hidden mb-8 shadow-md">
                        <div className="flex justify-center bg-white">
                            <img 
                                src="/images/bonsai.jpg" 
                                alt="Pépinière" 
                                className="h-auto w-full max-h-96"
                            />
                        </div>
                        <div className="bg-gradient-to-r from-green-600/80 to-green-700/80 p-6">
                            <h1 className="text-2xl font-bold mb-2 text-white">Dépôt Pépinière</h1>
                            <p className="text-green-100 max-w-2xl">
                                Gestion des stocks et transferts de produits
                            </p>
                        </div>
                    </div>
                    
                    {/* Menu principal simplifié */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                            <div className="h-40 flex items-center justify-center">
                                <img 
                                    src="/images/stockroom.png" 
                                    alt="Inventaire" 
                                    className="max-w-full max-h-full object-contain p-2"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-medium mb-2 text-green-700">Produits en Dépôt</h3>
                                <button
                                    onClick={() => router.get('/produits-depot')}
                                    className="w-full p-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                                >
                                    Accéder
                                </button>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                            <div className="h-40 flex items-center justify-center">
                                <img 
                                    src="/images/transfert.png" 
                                    alt="Transferts" 
                                    className="max-w-full max-h-full object-contain p-2"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-medium mb-2 text-blue-700">Produits Transférés</h3>
                                <button
                                    onClick={() => router.get('/produits-transferes')}
                                    className="w-full p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                                >
                                    Accéder
                                </button>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                            <div className="h-40 flex items-center justify-center">
                                <img 
                                    src="/images/trash.png" 
                                    alt="Pertes" 
                                    className="max-w-full max-h-full object-contain p-2"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-medium mb-2 text-red-700">Produits Perdus</h3>
                                <button
                                    onClick={() => router.get('/produits-perdus')}
                                    className="w-full p-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                                >
                                    Accéder
                                </button>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                            <div className="h-40 flex items-center justify-center">
                                <img 
                                    src="/images/receipt.png" 
                                    alt="Réceptions" 
                                    className="max-w-full max-h-full object-contain p-2"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-medium mb-2 text-yellow-700">Bons de Réception</h3>
                                <button
                                    onClick={() => router.get('/bons-de-receptions')}
                                    className="w-full p-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors"
                                >
                                    Accéder
                                </button>
                            </div>
                        </div>
                        {/* Bon de Commande */}
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                            <div className="h-40 flex items-center justify-center">
                                <img 
                                    src="/images/receipt.png" 
                                    alt="Bon de Commande" 
                                    className="max-w-full max-h-full object-contain p-2"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-medium mb-2 text-yellow-700">Bons de Commande</h3>
                                <button
                                    onClick={() => router.get('/bons-de-commandes')}
                                    className="w-full p-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors"
                                >
                                    Accéder
                                </button>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                            <div className="h-40 flex items-center justify-center">
                                <img 
                                    src="/images/analytics.png" 
                                    alt="Statistiques" 
                                    className="max-w-full max-h-full object-contain p-2"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-medium mb-2 text-purple-700">Statistiques</h3>
                                <button
                                    onClick={() => router.get('/statistics')}
                                    className="w-full p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
                                >
                                    Accéder
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}