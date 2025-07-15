import React from 'react';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface ProductForm {
    nom: string;
    quantite: string;
    type: string;
    peremption: string;
    marque: string;
    dosage: string;
    description: string;
    unite: string;
    prix_unitaire: string; // Ajouté
}

const CreateBonDeReception = ({ envoyeurs = [], produits = [], numero = '' }: { envoyeurs?: string[], produits?: string[], numero?: string }) => {
    const [products, setProducts] = React.useState<ProductForm[]>([{
        nom: '',
        quantite: '',
        type: 'outillages',
        peremption: '',
        marque: '',
        dosage: '',
        description: '',
        unite: 'pièce',
        prix_unitaire: '', // Ajouté
    }]);

    const [formData, setFormData] = React.useState({
        numero: numero, // <-- utilise la prop backend
        date: new Date().toISOString().split('T')[0],
        envoyeur: '',
        image: null as File | null
    });

    const [showSuccess, setShowSuccess] = React.useState(false);

    const addProduct = () => {
        setProducts([...products, {
            nom: '',
            quantite: '',
            type: 'outillages',
            peremption: '',
            marque: '',
            dosage: '',
            description: '',
            unite: 'pièce',
            prix_unitaire: '', // Ajouté
        }]);
    };

    const handleProductChange = (index: number, field: keyof ProductForm, value: string) => {
        const newProducts = [...products];
        newProducts[index][field] = value;
        setProducts(newProducts);
    };

    const totalBon = products.reduce((sum, prod) => {
        const qte = parseFloat(prod.quantite) || 0;
        const prix = parseFloat(prod.prix_unitaire) || 0;
        return sum + (qte * prix);
    }, 0);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const bonData = {
            ...formData,
            produits: products.map(prod => ({
                nom: prod.nom,
                quantite: Number(prod.quantite),
                type: prod.type,
                peremption: prod.peremption,
                marque: prod.marque,
                dosage: prod.dosage,
                description: prod.description,
                unite: prod.unite,
                prix_unitaire: parseFloat(prod.prix_unitaire) || 0 // Ajouté
            })),
            prix_total: totalBon // Ajouté
        };
        
        router.post('/bons-de-receptions', bonData, {
            onSuccess: (page) => {
                // Récupère l'id du bon créé depuis la réponse Inertia
                const bonId = page.props?.id;
                if (bonId) {
                    window.open(`/generate-pdf/${bonId}`, '_blank');
                }
            },
            onError: (errors) => {
                console.log('Submission errors:', errors);
            }
        });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        setFormData({
            numero: numero, // <-- toujours la prop backend
            date: new Date().toISOString().split('T')[0],
            envoyeur: '',
            image: null
        });
        setProducts([{
            nom: '',
            quantite: '',
            type: 'outillages',
            peremption: '',
            marque: '',
            dosage: '',
            description: '',
            unite: 'pièce',
            prix_unitaire: '', // Réinitialisé
        }]);
    };

    return (
        <AuthenticatedLayout>
            <div className="p-8 max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-white rounded-3xl shadow-2xl border border-blue-100">
                <h1 className="text-3xl font-extrabold mb-8 text-blue-800 text-center drop-shadow">Nouveau bon de réception</h1>
                
                {showSuccess && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-center font-semibold shadow">
                        Bon de réception créé avec succès!
                    </div>
                )}

                <form onSubmit={handleSave} className="space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Numéro du bon</label>
                            <input
                                type="text"
                                value={formData.numero}
                                readOnly
                                className="mt-1 block w-full border-gray-300 rounded-md bg-gray-100"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date</label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={e => setFormData({...formData, date: e.target.value})}
                                className="mt-1 block w-full border-gray-300 rounded-md"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Fournisseur</label>
                            <input
                                list="envoyeur-list"
                                type="text"
                                value={formData.envoyeur}
                                onChange={e => setFormData({...formData, envoyeur: e.target.value})}
                                className="mt-1 block w-full border-gray-300 rounded-md"
                                required
                            />
                            <datalist id="envoyeur-list">
                                {envoyeurs.map((nom) => (
                                    <option key={nom} value={nom} />
                                ))}
                            </datalist>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Image du bon</label>
                            <input
                                type="file"
                                onChange={e => setFormData({
                                    ...formData,
                                    image: e.target.files?.[0] || null
                                })}
                                className="mt-1 block w-full border-gray-300 rounded-md"
                                accept="image/*"
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-blue-700">Produits</h2>
                        
                        {products.map((product, index) => {
                            const prixTotalProduit = (parseFloat(product.quantite) || 0) * (parseFloat(product.prix_unitaire) || 0);
                            return (
                                <div key={index} className="grid grid-cols-2 gap-6 bg-blue-50 rounded-xl p-4 mb-4 shadow-sm border border-blue-200">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Nom</label>
                                        <input
                                            list="produit-list"
                                            type="text"
                                            value={product.nom}
                                            onChange={(e) => handleProductChange(index, 'nom', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md"
                                            required
                                        />
                                        <datalist id="produit-list">
                                            {produits.map((nom) => (
                                                <option key={nom} value={nom} />
                                            ))}
                                        </datalist>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Quantité</label>
                                        <input
                                            type="text"
                                            value={product.quantite}
                                            onChange={e => {
                                                const value = e.target.value.replace(',', '.');
                                                handleProductChange(index, 'quantite', value);
                                            }}
                                            className="mt-1 block w-full border-gray-300 rounded-md"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Type</label>
                                        <select
                                            value={product.type}
                                            onChange={e => handleProductChange(index, 'type', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md"
                                        >
                                            <option value="outillages">Outillages</option>
                                            <option value="consommables">Consommables</option>
                                            <option value="phytosanitaire">Phytosanitaire</option>
                                            <option value="autres">Autres</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Unité</label>
                                        <select
                                            value={product.unite}
                                            onChange={e => handleProductChange(index, 'unite', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md"
                                        >
                                            <option value="pièce">Pièce</option>
                                            <option value="kg">Kilogramme</option>
                                            <option value="litre">Litre</option>
                                            <option value="mètre">Mètre</option>
                                            <option value="ml">Millilitre</option>
                                            <option value="mg">Gramme</option>
                                        </select>
                                        
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Date péremption</label>
                                        <input
                                            type="date"
                                            value={product.peremption}
                                            onChange={e => handleProductChange(index, 'peremption', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Marque</label>
                                        <input
                                            type="text"
                                            value={product.marque}
                                            onChange={e => handleProductChange(index, 'marque', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Dosage</label>
                                        <input
                                            type="text"
                                            value={product.dosage}
                                            onChange={e => {
                                                const value = e.target.value.replace(',', '.');
                                                handleProductChange(index, 'dosage', value);
                                            }}
                                            className="mt-1 block w-full border-gray-300 rounded-md"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Prix unitaire</label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={product.prix_unitaire}
                                            onChange={e => handleProductChange(index, 'prix_unitaire', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Prix total</label>
                                        <input
                                            type="text"
                                            value={prixTotalProduit.toFixed(2)}
                                            readOnly
                                            className="mt-1 block w-full border-gray-300 rounded-md bg-gray-100"
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Description</label>
                                        <textarea
                                            value={product.description}
                                            onChange={e => handleProductChange(index, 'description', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md"
                                            rows={2}
                                        />
                                    </div>
                                </div>
                            );
                        })}

                        <button
                            type="button"
                            onClick={addProduct}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow transition"
                        >
                            + Ajouter un produit
                        </button>
                    </div>

                    <div className="text-right text-xl font-bold mt-8 text-blue-900">
                        Prix total du bon : {totalBon.toFixed(2)} DA
                    </div>

                    <div className="flex justify-between mt-8">
                        <button
                            type="button"
                            className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-3 rounded shadow transition"
                            onClick={() => router.visit('/')}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded shadow transition"
                        >
                            Enregistrer le bon de réception
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default CreateBonDeReception;
