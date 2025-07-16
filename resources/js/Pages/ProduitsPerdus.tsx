import React, { useState, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage } from '@inertiajs/react';

interface ProduitPerdu {
  id: number;
  produit_id: string;
  quantite: number;
  motif: string;
  created_at: string;
  user?: {
    name: string;
  };
  produit_nom: string;
  prix_unitaire?: number | null;
  prix_total?: number | null;
}

const ProduitsPerdus = ({ produitsPerdus = [] }: { produitsPerdus: ProduitPerdu[] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');

  const filteredPerdus = useMemo(() => {
    return produitsPerdus.filter(p =>
      p.produit_nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.motif.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [produitsPerdus, searchTerm]);

  const sortedPerdus = useMemo(() => {
    return [...filteredPerdus].sort((a, b) => {
      if (sortField === 'quantite') {
        return sortDirection === 'asc' ? a.quantite - b.quantite : b.quantite - a.quantite;
      }
      return sortDirection === 'asc'
        ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [filteredPerdus, sortField, sortDirection]);

  const totalPrixPerdu = useMemo(() => {
    return sortedPerdus.reduce((sum, p) => sum + (Number(p.prix_total) || 0), 0);
  }, [sortedPerdus]);

  const getSortIcon = (field: string) => {
    return sortField === field ? (sortDirection === 'asc' ? '↑' : '↓') : '↕';
  };

  const handleSort = (field: string) => {
    setSortField(field);
    setSortDirection(prev => (field === sortField ? (prev === 'asc' ? 'desc' : 'asc') : 'desc'));
  };

  return (
    <AuthenticatedLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-red-800">
            <span className="mr-2">🗑️</span>
            Produits Perdus
          </h1>
          <div className="w-1/3">
            <input
              type="text"
              className="w-full p-2 border rounded-lg"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-gray-600">Total Perdu</div>
            <div className="text-2xl font-bold">
              {produitsPerdus.reduce((sum, p) => sum + p.quantite, 0).toFixed(3)}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-gray-600">Nombre d'Articles</div>
            <div className="text-2xl font-bold">{produitsPerdus.length}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-red-50">
              <tr>
                <th
                  className="px-6 py-3 cursor-pointer"
                  onClick={() => handleSort('created_at')}
                >
                  Date {getSortIcon('created_at')}
                </th>
                <th
                  className="px-6 py-3 cursor-pointer"
                  onClick={() => handleSort('produit_nom')}
                >
                  Produit {getSortIcon('produit_nom')}
                </th>
                <th
                  className="px-6 py-3 cursor-pointer"
                  onClick={() => handleSort('quantite')}
                >
                  Quantité {getSortIcon('quantite')}
                </th>
                <th className="px-6 py-3">Motif</th>
                <th className="px-6 py-3">Prix unitaire</th>
                <th className="px-6 py-3">Prix total</th>
                <th className="px-6 py-3">Responsable</th>
              </tr>
            </thead>
            <tbody>
              {sortedPerdus.map((perdu) => (
                <tr key={perdu.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {new Date(perdu.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 font-medium">{perdu.produit_nom}</td>
                  <td className="px-6 py-4">{Number(perdu.quantite).toFixed(3)}</td>
                  <td className="px-6 py-4">{perdu.motif}</td>
                  <td className="px-6 py-4">
                    {perdu.prix_unitaire !== null && perdu.prix_unitaire !== undefined && !isNaN(Number(perdu.prix_unitaire))
                      ? Number(perdu.prix_unitaire).toFixed(2) + ' DA'
                      : '-'}
                  </td>
                  <td className="px-6 py-4">
                    {perdu.prix_total !== null && perdu.prix_total !== undefined && !isNaN(Number(perdu.prix_total))
                      ? Number(perdu.prix_total).toFixed(2) + ' DA'
                      : '-'}
                  </td>
                  <td className="px-6 py-4">{perdu.user?.name || 'Inconnu'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-red-100 p-4 rounded-lg font-bold text-right mt-2">
          Total prix produits perdus : {totalPrixPerdu.toFixed(2)} DA
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default ProduitsPerdus;