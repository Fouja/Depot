import React from "react";
import { router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

interface ProductForm {
    nom: string;
    quantite: string;
    type: string;
    peremption: string;
    marque: string;
    dosage: string;
    description: string;
    unite: string;
    prix_unitaire: string;
}

export default function EditBonDeReception({ bon, envoyeurs = [], produits = [] }: any) {
    const [products, setProducts] = React.useState<ProductForm[]>(
        bon.produits.map((p: any) => ({
            nom: p.nom || "",
            quantite: p.quantite?.toString() || "",
            type: p.type || "outillages",
            peremption: p.peremption || "",
            marque: p.marque || "",
            dosage: p.dosage || "",
            description: p.description || "",
            unite: p.unite || "pièce",
            prix_unitaire: p.prix_unitaire?.toString() || "",
        }))
    );

    const [formData, setFormData] = React.useState({
        numero: bon.numero,
        date: bon.date?.substring(0, 10) || "",
        envoyeur: bon.envoyeur || "",
        image: null as File | null,
    });

    const [showSuccess, setShowSuccess] = React.useState(false);

    const handleProductChange = (index: number, field: keyof ProductForm, value: string) => {
        const updated = [...products];
        updated[index][field] = value;
        setProducts(updated);
    };

    const addProduct = () => {
        setProducts([
            ...products,
            {
                nom: "",
                quantite: "",
                type: "outillages",
                peremption: "",
                marque: "",
                dosage: "",
                description: "",
                unite: "pièce",
                prix_unitaire: "",
            },
        ]);
    };

    const totalBon = products.reduce(
        (sum, prod) =>
            sum +
            (parseFloat(prod.quantite.replace(",", ".")) || 0) *
                (parseFloat(prod.prix_unitaire.replace(",", ".")) || 0),
        0
    );

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const bonData = {
            ...formData,
            produits: products.map((prod) => ({
                nom: prod.nom,
                quantite: parseFloat(prod.quantite.replace(",", ".")) || 0,
                type: prod.type,
                peremption: prod.peremption,
                marque: prod.marque,
                dosage: prod.dosage,
                description: prod.description,
                unite: prod.unite,
                prix_unitaire: Number(prod.prix_unitaire.replace(",", ".")) || 0,
            })),
            prix_total: totalBon,
            _method: "PUT",
        };

        router.post(`/bons-de-receptions/${bon.id}`, bonData, {
            onSuccess: () => {
                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);
                    window.location.href = '/bons-de-receptions'; // Redirige vers la liste après succès
                }, 1500);
            },
            onError: (errors) => {
                console.log("Submission errors:", errors);
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <div className="p-6 max-w-4xl mx-auto">
                <h1 className="text-3xl font-extrabold mb-8 text-blue-800 text-center drop-shadow">
                    Modifier le bon de réception
                </h1>
                {showSuccess && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-center font-semibold shadow">
                        Bon de réception modifié avec succès!
                    </div>
                )}
                <form
                    onSubmit={handleSave}
                    className="space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-blue-100"
                >
                    {products.map((product, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-2 gap-6 bg-blue-50 rounded-xl p-4 mb-4 shadow-sm border border-blue-200"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nom du produit
                                </label>
                                <input
                                    type="text"
                                    value={product.nom}
                                    onChange={(e) => handleProductChange(index, "nom", e.target.value)}
                                    placeholder="Nom du produit"
                                    className="mt-1 block w-full border-gray-300 rounded-md focus:ring-blue-400 focus:border-blue-400"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Quantité
                                </label>
                                <input
                                    type="text"
                                    value={product.quantite}
                                    onChange={(e) =>
                                        handleProductChange(index, "quantite", e.target.value.replace(",", "."))
                                    }
                                    placeholder="Quantité"
                                    className="mt-1 block w-full border-gray-300 rounded-md focus:ring-blue-400 focus:border-blue-400"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Unité</label>
                                <select
                                    value={product.unite}
                                    onChange={(e) => handleProductChange(index, "unite", e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md focus:ring-blue-400 focus:border-blue-400"
                                >
                                    <option value="pièce">Pièce</option>
                                    <option value="kg">Kilogramme</option>
                                    <option value="litre">Litre</option>
                                    <option value="mètre">Mètre</option>
                                    <option value="ml">Millilitre</option>
                                    <option value="mg">Milligramme</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <select
                                    value={product.type}
                                    onChange={(e) => handleProductChange(index, "type", e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md focus:ring-blue-400 focus:border-blue-400"
                                >
                                    <option value="outillages">Outillages</option>
                                    <option value="consommables">Consommables</option>
                                    <option value="phytosanitaire">Phytosanitaire</option>
                                    <option value="autres">Autres</option>
                                </select>
                            </div>
                            {/* Ajoute ici d'autres champs stylés si besoin */}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addProduct}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow transition"
                    >
                        Ajouter un produit
                    </button>
                    <div className="flex gap-4 justify-end mt-8">
                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow transition"
                        >
                            Enregistrer les modifications
                        </button>
                        <button
                            type="button"
                            className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded shadow transition"
                            onClick={() => window.history.back()}
                        >
                            Annuler
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}