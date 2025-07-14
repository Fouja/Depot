import React from 'react';
import { router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function BonsDeCommandes({ bons = [] }: { bons: Array<{
    id: number;
    numero: string;
    date: string;
    envoyeur: string;
    produits: Array<{
        nom: string;
        quantite: number;
        unite: string;
        type: string;
        marque?: string;
        description?: string;
    }>;
}> }) {
    return (
        <AuthenticatedLayout>
            <div className="p-6 max-w-7xl mx-auto">
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-8 rounded-3xl mb-8">
                    <h1 className="text-4xl font-bold text-blue-800 mb-4">📝 Bons de Commande</h1>
                    <div className="flex gap-4">
                        <input 
                            type="text" 
                            placeholder="Rechercher un bon..." 
                            className="flex-1 p-3 rounded-lg border border-blue-200"
                        />
                        <Link 
                            href="/bons-de-commandes/create"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                        >
                            + Nouveau bon de commande
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bons?.map((bon) => (
                        <div key={bon.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-semibold text-blue-800">
                                        Bon #{bon.numero.startsWith('BC-') ? bon.numero : `BC-${bon.numero}`}
                                    </h3>
                                </div>
                                
                                <div className="space-y-2 text-gray-600">
                                    <div className="flex items-center">
                                        <span className="mr-2">📅 Date:</span>
                                        {new Date(bon.date).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center">
                                        <span className="mr-2">📤 Fournisseur:</span>
                                        {bon.envoyeur}
                                    </div>
                                    <div className="border-t pt-2 mt-2">
                                        <h4 className="font-medium mb-1">Produits:</h4>
                                        {bon.produits.map((p, index) => (
                                            <div key={index} className="text-sm flex flex-col mb-2">
                                                <div className="flex justify-between">
                                                    <span>{p.nom} ({p.type})</span>
                                                    <span>{p.quantite} {p.unite}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    onClick={() => window.open(`/bons-de-commandes/${bon.id}/pdf`, '_blank')}
                                    className="mt-4 w-full bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
                                >
                                    Télécharger PDF
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
