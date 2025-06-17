import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

interface GraphsProps {
    depotData: {
        labels: string[];
        quantities: number[];
    };
    transferData: {
        labels: string[];
        quantities: number[];
    };
    timeSeriesData: {
        labels: string[];
        datasets: {
            label: string;
            data: number[];
        }[];
    };
    filters: {
        start_date?: string;
        end_date?: string;
        graph_type?: string;
    };
}

export default function StatisticsGraphs({ depotData, transferData, timeSeriesData, filters }: GraphsProps) {
    const [localFilters, setLocalFilters] = useState(filters);
    const [activeTab, setActiveTab] = useState('depot');

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        router.get('/statistics/graphs', newFilters, { preserveState: true });
    };

    // Chart data for depot products
    const depotChartData = {
        labels: depotData.labels,
        datasets: [
            {
                label: 'Quantité en stock',
                data: depotData.quantities,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    // Chart data for transferred products
    const transferChartData = {
        labels: transferData.labels,
        datasets: [
            {
                label: 'Quantité transférée',
                data: transferData.quantities,
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
            },
        ],
    };

    // Chart data for time series
    const timeSeriesChartData = {
        labels: timeSeriesData.labels,
        datasets: timeSeriesData.datasets.map((dataset, index) => ({
            label: dataset.label,
            data: dataset.data,
            backgroundColor: [
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
                'rgba(255, 99, 132, 0.6)',
            ][index % 4],
            borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)',
            ][index % 4],
            borderWidth: 1,
        })),
    };

    return (
        <AuthenticatedLayout>
            <Head title="Graphiques Statistiques" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold">Graphiques Statistiques</h1>
                                <button 
                                    onClick={() => router.get('/statistics')} 
                                    className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                                >
                                    Retour
                                </button>
                            </div>
                            
                            {/* Filters */}
                            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date de début
                                    </label>
                                    <input
                                        type="date"
                                        value={localFilters.start_date || ''}
                                        onChange={(e) => handleFilterChange('start_date', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date de fin
                                    </label>
                                    <input
                                        type="date"
                                        value={localFilters.end_date || ''}
                                        onChange={(e) => handleFilterChange('end_date', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Type de graphique
                                    </label>
                                    <select
                                        value={localFilters.graph_type || 'bar'}
                                        onChange={(e) => handleFilterChange('graph_type', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    >
                                        <option value="bar">Barres</option>
                                        <option value="line">Lignes</option>
                                        <option value="pie">Camembert</option>
                                    </select>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="mb-6 border-b border-gray-200">
                                <nav className="-mb-px flex space-x-8">
                                    <button
                                        onClick={() => setActiveTab('depot')}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                            activeTab === 'depot' 
                                                ? 'border-blue-500 text-blue-600' 
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        Dépôt
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('transfer')}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                            activeTab === 'transfer' 
                                                ? 'border-blue-500 text-blue-600' 
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        Transferts
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('timeSeries')}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                            activeTab === 'timeSeries' 
                                                ? 'border-blue-500 text-blue-600' 
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        Séries temporelles
                                    </button>
                                </nav>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
);
}