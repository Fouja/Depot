import { PageProps } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface ProduitPerdu {
    id: number;
    produit: {
        name: string;
        quantity: number;
        unite: string;
    };
    quantity: number;
    description: string;
    date_perte: string;
}

interface ProduitsPerdusProps extends PageProps {
    produitsPerdus: ProduitPerdu[];
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
}

export default function ProduitsPerdus({
    auth,
    produitsPerdus,
}: ProduitsPerdusProps) {
    return (
        <AuthenticatedLayout
            user={auth.user}
        >
            <div className="p-6 bg-white rounded-lg shadow">
                <h1 className="text-2xl font-bold mb-4">Produits Perdus</h1>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">Produit</th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">Quantité Perdue</th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">Date de Perte</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {produitsPerdus.map((produit) => (
                                <tr key={produit.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{produit.produit.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{produit.quantity} {produit.produit.unite}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{produit.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {new Date(produit.date_perte).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}