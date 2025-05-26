import React from 'react';
import { router } from '@inertiajs/react';

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <div className="min-h-screen flex flex-col bg-green-50">
            {/* Barre de Navigation Améliorée - Style Pépinière */}
            <nav className="bg-gradient-to-r from-green-600 to-emerald-700 text-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center space-x-6">
                        {/* Logo Optimisé pour Pépinière */}
                        <a 
                            href="/" 
                            onClick={(e) => {
                                e.preventDefault();
                                router.get('/');
                            }}
                            className="flex items-center hover:opacity-90 transition-opacity"
                        >
                            <img 
                                className="h-16 w-16 mr-3 object-contain" 
                                src="/images/garden.png" 
                                alt="Logo Pépinière" 
                            />
                            <span className="text-xl font-bold">Pépinière Manager</span>
                        </a>
                        
                        {/* Liens de Navigation avec Style Pépinière */}
                        <div className="hidden md:flex space-x-1">
                            <button
                                onClick={() => router.get('/produits-depot')}
                                className="px-4 py-2 text-sm font-medium text-white hover:bg-green-500/30 rounded-md transition-colors"
                            >
                                Produits Depot
                            </button>
                            <button
                                onClick={() => router.get('/produits-transferes')}
                                className="px-4 py-2 text-sm font-medium text-white hover:bg-green-500/30 rounded-md transition-colors"
                            >
                                Produits Transférés
                            </button>
                            <button
                                onClick={() => router.get('/produits-perdus')}
                                className="px-4 py-2 text-sm font-medium text-white hover:bg-green-500/30 rounded-md transition-colors"
                            >
                                Produits Perdus
                            </button>
                            <button
                                onClick={() => router.get('/bons-de-receptions')}
                                className="px-4 py-2 text-sm font-medium text-white hover:bg-green-500/30 rounded-md transition-colors"
                            >
                                Bons Réceptions
                            </button>
                            <button
                                onClick={() => router.get('/statistics')}
                                className="px-4 py-2 text-sm font-medium text-white hover:bg-green-500/30 rounded-md transition-colors"
                            >
                                Statistiques
                            </button>
                        </div>
                    </div>
                    
                    {/* Bouton de Déconnexion */}
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors shadow-sm"
                    >
                        Déconnexion
                    </button>
                </div>
                
                {/* Menu de Navigation Mobile */}
                <div className="md:hidden px-4 py-2 border-t border-green-500">
                    <div className="flex flex-col space-y-1">
                        <button
                            onClick={() => router.get('/produits-depot')}
                            className="px-3 py-2 text-sm font-medium text-white hover:bg-green-500/30 rounded-md transition-colors"
                        >
                            Produits Depot
                        </button>
                        <button
                            onClick={() => router.get('/produits-transferes')}
                            className="px-3 py-2 text-sm font-medium text-white hover:bg-green-500/30 rounded-md transition-colors"
                        >
                            Produits Transférés
                        </button>
                        <button
                            onClick={() => router.get('/produits-perdus')}
                            className="px-3 py-2 text-sm font-medium text-white hover:bg-green-500/30 rounded-md transition-colors"
                        >
                            Produits Perdus
                        </button>
                        <button
                            onClick={() => router.get('/bons-de-receptions')}
                            className="px-3 py-2 text-sm font-medium text-white hover:bg-green-500/30 rounded-md transition-colors"
                        >
                            Bons Réceptions
                        </button>
                        <button
                            onClick={() => router.get('/statistics')}
                            className="px-3 py-2 text-sm font-medium text-white hover:bg-green-500/30 rounded-md transition-colors"
                        >
                            Statistiques
                        </button>
                    </div>
                </div>
            </nav>
            
            {/* Zone de Contenu Principal */}
            <main className="flex-grow">{children}</main>
            
            {/* Pied de Page Thématique Pépinière */}
            <footer className="bg-gradient-to-r from-green-800 to-emerald-900 text-white">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    
                    
                    <div className="border-t border-green-700 mt-8 pt-6 text-center text-sm text-green-300">
                        <p>&copy; {new Date().getFullYear()} Pépinière Manager. Tous droits réservés.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}