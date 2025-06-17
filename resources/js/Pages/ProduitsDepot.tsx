import React, { useState, useMemo, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PerteModal from '@/Components/PerteModal';
interface Produit {
    id: number;
    nom: string;
    quantite: number;
    unite: string;
    type: string;
    marque?: string;
    dosage?: string;
    image_url?: string;
    prix_unitaire?: number; // Ajouté
    prix_total?: number;    // Ajouté
}

export default function ProduitsDepot() {
    const { produits } = usePage().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('nom');
    const [sortDirection, setSortDirection] = useState('asc');
    const [isLoading, setIsLoading] = useState(true);
    
    // Transfer modal states
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [selectedProduit, setSelectedProduit] = useState<Produit | null>(null);
    const [transferQuantity, setTransferQuantity] = useState(1);
    const [transferDestination, setTransferDestination] = useState('');
    const [transferType, setTransferType] = useState('interne');
    const [customName, setCustomName] = useState('');
    const [isPerteModalOpen, setIsPerteModalOpen] = useState(false);
    const [selectedProduitPerte, setSelectedProduitPerte] = useState<Produit | null>(null);
    // Simulate loading effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);
    
    // Filter products based on search term
    const filteredProduits = useMemo(() => {
        if (!Array.isArray(produits)) return [];
        
        return produits.filter((produit) => 
            produit.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            produit.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (produit.marque && produit.marque.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (produit.dosage && produit.dosage.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [produits, searchTerm]);
    
    // Sort products
    const sortedProduits = useMemo(() => {
        if (!filteredProduits.length) return [];
        
        return [...filteredProduits].sort((a, b) => {
            if (sortField === 'quantite') {
                return sortDirection === 'asc' 
                    ? a.quantite - b.quantite 
                    : b.quantite - a.quantite;
            }
            
            const valueA = a[sortField as keyof Produit]?.toString().toLowerCase() || '';
            const valueB = b[sortField as keyof Produit]?.toString().toLowerCase() || '';
            
            if (sortDirection === 'asc') {
                return valueA.localeCompare(valueB);
            } else {
                return valueB.localeCompare(valueA);
            }
        });
    }, [filteredProduits, sortField, sortDirection]);
    
    // Calculate total quantity from all products (not just filtered)
    const totalQuantity = useMemo(() => {
        if (!Array.isArray(produits)) return 0;
        return produits.reduce((sum, produit) => sum + produit.quantite, 0);
    }, [produits]);
    
    // Calculate total value of all products (not just filtered)
    const totalValeurProduits = useMemo(() => {
        if (!Array.isArray(produits)) return 0;
        return produits.reduce((sum, produit) => sum + (produit.prix_total || 0), 0);
    }, [produits]);
    
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
    
    // Get row background based on product type
    const getRowBackground = (type: string) => {
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

    // Open transfer modal
    const openTransferModal = (produit: Produit) => {
        setSelectedProduit(produit);
        setTransferQuantity(1);
        setTransferDestination('');
        setTransferType('interne');
        setCustomName('');
        setIsTransferModalOpen(true);
    };
    
    // Handle transfer submission
    const handleTransfer = () => {
        if (!selectedProduit) return;
        
        // Validate transfer quantity
        if (transferQuantity <= 0 || transferQuantity > selectedProduit.quantite) {
            alert('Quantité invalide');
            return;
        }
        
        // Validate destination
        if (!transferDestination) {
            alert('Veuillez sélectionner une destination');
            return;
        }
        
        // Prepare data for transfer
        const transferData = {
            produit_id: selectedProduit.nom, // Using name as identifier
            quantite: transferQuantity,
            destination: transferDestination,
            type_transfert: transferType,
            nom_personnel: transferDestination === 'Maison Personnels' ? customName : null
        };
        
        // Send transfer data to server
        router.post('/produits/transferer', transferData, {
            onSuccess: () => {
                setIsTransferModalOpen(false);
                // Optionally refresh the page to update quantities
                // router.reload();
            }
        });
    };
    
    return (
        <AuthenticatedLayout>
            <div className="p-6 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-green-800 mb-4 md:mb-0">
                        <span className="inline-block mr-2">🌱</span> 
                        Produits en Pépinière
                    </h1>
                    
                    {/* Search filter */}
                    <div className="w-full md:w-1/3">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                                </svg>
                            </div>
                            <input
                                type="text"
                                className="bg-white border border-green-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full pl-10 p-2.5 transition-all duration-300"
                                placeholder="Rechercher par nom, type, marque..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                
                {/* Stats cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-100 mr-4">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Nombre de produits</p>
                                <p className="text-xl font-bold text-gray-800">{filteredProduits.length}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-100 mr-4">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Quantité totale</p>
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
                                <p className="text-sm text-gray-500 font-medium">Types de produits</p>
                                <p className="text-xl font-bold text-gray-800">
                                    {new Set(filteredProduits.map(p => p.type)).size}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-yellow-100 mr-4">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z"></path></svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Valeur totale des produits présents</p>
                                <p className="text-xl font-bold text-gray-800">{totalValeurProduits.toFixed(2)} DA</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Products table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-all duration-300">
                    {isLoading ? (
                        <div className="flex justify-center items-center p-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-green-50">
                                    <tr>
                                        <th 
                                            scope="col" 
                                            className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider cursor-pointer hover:bg-green-100 transition-colors duration-200"
                                            onClick={() => handleSort('nom')}
                                        >
                                            Nom {getSortIcon('nom')}
                                        </th>
                                        <th 
                                            scope="col" 
                                            className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider cursor-pointer hover:bg-green-100 transition-colors duration-200"
                                            onClick={() => handleSort('type')}
                                        >
                                            Type {getSortIcon('type')}
                                        </th>
                                        <th 
                                            scope="col" 
                                            className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider cursor-pointer hover:bg-green-100 transition-colors duration-200"
                                            onClick={() => handleSort('quantite')}
                                        >
                                            Quantité Totale {getSortIcon('quantite')}
                                        </th>
                                        <th 
                                            scope="col" 
                                            className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider cursor-pointer hover:bg-green-100 transition-colors duration-200"
                                            onClick={() => handleSort('marque')}
                                        >
                                            Marque {getSortIcon('marque')}
                                        </th>
                                        <th 
                                            scope="col" 
                                            className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider cursor-pointer hover:bg-green-100 transition-colors duration-200"
                                            onClick={() => handleSort('dosage')}
                                        >
                                            Dosage {getSortIcon('dosage')}
                                        </th>
                                        <th 
                                            scope="col" 
                                            className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider cursor-pointer hover:bg-green-100 transition-colors duration-200"
                                            onClick={() => handleSort('unite')}
                                        >
                                            Unité {getSortIcon('unite')}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                                            Prix unitaire
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                                            Prix total
                                        </th>
                                        <th 
                                            scope="col" 
                                            className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider"
                                        >
                                            Image
                                        </th>
                                        <th 
                                            scope="col" 
                                            className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider"
                                        >
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {sortedProduits.map((produit: Produit, index) => (
                                        <tr key={index} className={`${getRowBackground(produit.type)} transition-colors duration-200`}>
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{produit.nom}</td>
                                            <td className="px-6 py-4 whitespace-nowrap capitalize text-gray-700">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    {produit.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-2 w-20 bg-gray-200 rounded-full mr-2">
                                                        <div 
                                                            className="h-2 bg-green-500 rounded-full" 
                                                            style={{ width: `${Math.min(100, (produit.quantite / (totalQuantity * 0.2)) * 100)}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="font-bold text-gray-900">{produit.quantite}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-700">{produit.marque || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-700">{produit.dosage || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-700">{produit.unite}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                                {produit.prix_unitaire !== undefined ? produit.prix_unitaire.toFixed(2) + ' DA' : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                                {produit.prix_total !== undefined ? produit.prix_total.toFixed(2) + ' DA' : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                                {produit.image_url ? (
                                                    <img 
                                                        src={produit.image_url} 
                                                        alt={produit.nom}
                                                        className="h-10 w-10 rounded-full object-cover border border-gray-200"
                                                    />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                        <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                        </svg>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => openTransferModal(produit)}
                                                    className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-3 py-1 rounded-full transition-colors duration-200 mr-2"
                                                >
                                                    Transférer
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedProduitPerte(produit);
                                                        setIsPerteModalOpen(true);
                                                    }}
                                                    className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-full transition-colors duration-200"
                                                >
                                                    🗑️ Perte
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    
                                    {/* Total row */}
                                    <tr className="bg-green-100 font-bold">
                                        <td className="px-6 py-4 whitespace-nowrap text-green-800">TOTAL</td>
                                        <td className="px-6 py-4 whitespace-nowrap"></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-green-800">{totalQuantity}</td>
                                        <td className="px-6 py-4 whitespace-nowrap"></td>
                                        <td className="px-6 py-4 whitespace-nowrap"></td>
                                        <td className="px-6 py-4 whitespace-nowrap"></td>
                                        <td className="px-6 py-4 whitespace-nowrap"></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-green-800">{totalValeurProduits.toFixed(2)} DA</td>
                                        <td className="px-6 py-4 whitespace-nowrap"></td>
                                        <td className="px-6 py-4 whitespace-nowrap"></td>
                                    </tr>
                                </tbody>
                            </table>
                            
                            {/* Perte Modal - Moved outside of tbody */}
                            {isPerteModalOpen && selectedProduitPerte && (
                                <PerteModal
                                    produit={{
                                        produit_id: selectedProduitPerte?.id || 0,
                                        quantite: selectedProduitPerte?.quantite || 0,
                                        unite: selectedProduitPerte?.unite || '',
                                        marque: selectedProduitPerte?.marque,
                                        dosage: selectedProduitPerte?.dosage,
                                        destination: '',
                                        nom_personnel: '',
                                        image_url: selectedProduitPerte?.image_url,
                                        // Champs manquants ajoutés :
                                        type_transfert: 'interne',
                                        date_transfert: '',
                                        created_at: '',
                                        updated_at: '',
                                        type_produit: selectedProduitPerte?.type || '',
                                    }}
                                    onClose={() => setIsPerteModalOpen(false)}
                                    onConfirm={(quantity: number, description: string) => {
                                        if (!selectedProduitPerte) {
                                            console.error('ProduitsDepot - selectedProduitPerte is null');
                                            return;
                                        }
                                        
                                        console.log('ProduitsDepot - onConfirm called with:', {
                                            produit_id: selectedProduitPerte.id,
                                            quantite: quantity,
                                            description: description
                                        });
                                        
                                        if (quantity <= 0 || quantity > selectedProduitPerte.quantite) {
                                            alert('Quantité invalide');
                                            return;
                                        }
                                        
                                        console.log('ProduitsDepot - Sending POST request to /produits/perdre');
                                        router.post('/produits/perdre', {
                                            produit_id: String(selectedProduitPerte.id), // Convert to string explicitly
                                            quantite: quantity,
                                            description: description
                                        }, {
                                            onSuccess: () => {
                                                console.log('ProduitsDepot - POST request successful');
                                                setIsPerteModalOpen(false);
                                            },
                                            onError: (errors) => {
                                                console.error('ProduitsDepot - POST request failed:', errors);
                                            }
                                        });
                                    }}
                                />
                            )}
                        </div>
                    )}
                </div>
                
                {/* Transfer Modal */}
                {isTransferModalOpen && selectedProduit && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h2 className="text-xl font-bold mb-4">Transférer {selectedProduit.nom}</h2>
                            
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Quantité disponible: {selectedProduit.quantite} {selectedProduit.unite}
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max={selectedProduit.quantite}
                                    value={transferQuantity}
                                    onChange={(e) => setTransferQuantity(parseInt(e.target.value) || 0)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            
                            <div className="mb-4">
                                <div className="flex space-x-4 mb-2">
                                    <button
                                        className={`px-4 py-2 rounded ${transferType === 'interne' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                                        onClick={() => setTransferType('interne')}
                                    >
                                        Transfert Interne
                                    </button>
                                    <button
                                        className={`px-4 py-2 rounded ${transferType === 'externe' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                                        onClick={() => setTransferType('externe')}
                                    >
                                        Transfert Externe
                                    </button>
                                </div>
                                
                                {transferType === 'interne' && (
                                    <select
                                        value={transferDestination}
                                        onChange={(e) => setTransferDestination(e.target.value)}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    >
                                        <option value="">Sélectionner une destination</option>
                                        <option value="Pépiniaire agrumes">Pépiniaire agrumes</option>
                                        <option value="Les Vergets">Les Vergets</option>
                                        <option value="Service techniques">Service techniques</option>
                                        <option value="Showroom">Showroom</option>
                                        <option value="Service Sécurité">Service Sécurité</option>
                                        <option value="Parc familliale">Parc familliale</option>
                                        <option value="Autre">Autre</option>
                                    </select>
                                )}
                                
                                {transferType === 'externe' && (
                                    <div>
                                        <select
                                            value={transferDestination}
                                            onChange={(e) => setTransferDestination(e.target.value)}
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                                        >
                                            <option value="">Sélectionner une destination</option>
                                            <option value="Hamre el 3ine">Hamre el 3ine</option>
                                            <option value="Zeralda">Zeralda</option>
                                            <option value="ACI">ACI</option>
                                            <option value="Maison Personnels">Maison Personnels</option>
                                            <option value="Autre">Autre</option>
                                        </select>
                                        
                                        {transferDestination === 'Maison Personnels' && (
                                            <input
                                                type="text"
                                                placeholder="Nom du personnel"
                                                value={customName}
                                                onChange={(e) => setCustomName(e.target.value)}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => setIsTransferModalOpen(false)}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleTransfer}
                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Transférer
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Empty state */}
                {!isLoading && sortedProduits.length === 0 && (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun produit trouvé</h3>
                        <p className="mt-1 text-sm text-gray-500">Essayez de modifier votre recherche ou d'ajouter de nouveaux produits.</p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}