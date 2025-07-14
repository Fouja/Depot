import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

interface Bon {
    id: number;
    numero: string;
    date: string;
    prix_total: number | string;
}

interface StatisticsEnvoyeurDetailProps {
    envoyeur: string;
    bons: Bon[];
}

export default function StatisticsEnvoyeurDetail({ envoyeur, bons }: StatisticsEnvoyeurDetailProps) {
    return (
        <AuthenticatedLayout>
            <Head title={`Détail fournisseur ${envoyeur}`} />
            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl font-bold mb-4">Bons de réception de {envoyeur}</h1>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Numéro</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix total (DA)</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {bons.map((bon) => (
                                        <tr key={bon.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{bon.numero}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{new Date(bon.date).toLocaleDateString('fr-FR')}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{Number(bon.prix_total).toLocaleString('fr-FR')} DA</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button
                                onClick={() => window.history.back()}
                                className="mt-6 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                            >
                                Retour
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}