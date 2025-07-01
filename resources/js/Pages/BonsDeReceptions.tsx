import React from 'react';
import { router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';

export default function BonsDeReceptions({ bons = [] }: { bons: Array<{
    prix_total: any;
    id: number;
    numero: string;
    date: string;
    envoyeur: string;
    type: string;
    unite: string;
    quantite: number;
    peremption?: string;
    marque?: string;
    description?: string;
    image_path?: string;
    produits: Array<{
        nom: string;
        quantite: number;
        unite: string;
        type: string;
        prix_unitaire: number; // Ajoute cette ligne
        prix_total?: number;   // Optionnel, si tu veux l'utiliser aussi
    }>;
}> }) {
    return (
        <AuthenticatedLayout>
            <div className="p-6 max-w-7xl mx-auto">
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-8 rounded-3xl mb-8">
                    <h1 className="text-4xl font-bold text-blue-800 mb-4">📦 Gestion des Réceptions</h1>
                    <div className="flex gap-4">
                        <input 
                            type="text" 
                            placeholder="Rechercher un bon..." 
                            className="flex-1 p-3 rounded-lg border border-blue-200"
                        />
                        <Link 
                            href="/bons-de-receptions/create"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                        >
                            + Nouveau bon
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bons?.map((bon) => (  // Add optional chaining
                        <div key={bon.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-semibold text-blue-800">
                                        Bon #{bon.numero.startsWith('BR-') ? bon.numero : `BR-${bon.numero}`}
                                    </h3>
                                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm capitalize">
                                        {bon.type}
                                    </span>
                                </div>
                                
                                <div className="space-y-2 text-gray-600">
                                    <div className="flex items-center">
                                        <span className="mr-2">📅 Date:</span>
                                        {new Date(bon.date).toLocaleDateString()}
                                    </div>
                                    {bon.image_path && (
                                        <div className="flex items-center">
                                            <span className="mr-2">🖼️ Image:</span>
                                            <img src={bon.image_path} alt="Bon" className="h-20 w-20 object-cover" />
                                        </div>
                                    )}
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
                                                <div className="flex justify-between text-xs text-gray-500">
                                                    <span>Prix unitaire: {p.prix_unitaire} DA</span>
                                                    <span>Prix total: {(p.prix_unitaire * p.quantite).toFixed(2)} DA</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-2 text-right font-bold text-blue-700">
                                        Prix total du bon : {Number(bon.prix_total).toFixed(2)} DA
                                    </div>
                                </div>
                                {bon.description && (
                                    <div className="text-sm italic text-gray-500">
                                        {bon.description}
                                    </div>
                                )}
                                
                                <button
                                    onClick={() => window.open(`/generate-pdf/${bon.id}`, '_blank')}
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