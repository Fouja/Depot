import { useState } from 'react';
import { router } from '@inertiajs/react';

interface ProduitTransfere {
    
    produit_id:number;
    quantite: number;
    destination: string;
    type_transfert: 'interne' | 'externe';
    nom_personnel: string | null;
    date_transfert: string;
    created_at: string;
    updated_at: string;
    type_produit: string;
    unite: string;
    marque?: string;
    dosage?: string;
    image_url?: string;
}

interface PerteModalProps {
    produit: ProduitTransfere;
    onClose: () => void;
    onConfirm: (quantite: number, motif: string) => void; // Updated parameter names for consistency
    isTransfer?: boolean;
}

export default function PerteModal({ produit, onClose, onConfirm, isTransfer = false }: PerteModalProps) {
    const [quantite, setQuantite] = useState(1); // Renamed from quantity to quantite
    const [motif, setMotif] = useState(''); // Renamed from description to motif

    const handleSubmit = () => {
        // Add logging to see what values we're working with
        console.log('PerteModal - handleSubmit called with:', {
            produit,
            quantite, // Updated field name
            motif, // Updated field name
            isTransfer
        });
        
        if (quantite > 0 && motif.trim()) {
            console.log('PerteModal - Validation passed, calling onConfirm with:', quantite, motif);
            onConfirm(quantite, motif); // Pass with consistent field names
        } else {
            console.log('PerteModal - Validation failed:', {
                quantiteValid: quantite > 0,
                motifValid: Boolean(motif.trim())
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-bold mb-4">Déclarer une perte</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Quantité à déplacer vers la corbeille
                        </label>
                        <input
                            type="number"
                            min="1"
                            max={produit.quantite}
                            value={quantite}
                            onChange={(e) => setQuantite(Math.max(1, parseInt(e.target.value)))}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Motif de la perte
                        </label>
                        <textarea
                            value={motif}
                            onChange={(e) => setMotif(e.target.value)}
                            className="w-full p-2 border rounded h-24"
                            placeholder="Comment le produit a été perdu..."
                        />
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Confirmer la perte
                    </button>
                </div>
            </div>
        </div>
    );
}