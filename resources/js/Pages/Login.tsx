import { router } from '@inertiajs/react';
import React from 'react';
import { Head } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login', {
            onSuccess: () => {
                router.visit('/'); // Force Inertia page reload
            },
            onError: (errors) => {
                console.log('Login errors:', errors);
            }
        });
    };

    return (
        <>
            <Head title="Login">
                <meta name="csrf-token" content={(window as any).csrfToken} />
            </Head>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-50 to-emerald-100">
                <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-xl border border-green-100">
                    <div className="flex flex-col items-center">
                        <img 
                            className="h-32 w-32 mb-4 object-contain" 
                            src="/images/garden.png" 
                            alt="Pépinière Logo" 
                        />
                        <h2 className="mt-2 text-center text-3xl font-extrabold text-green-800">
                            Connexion
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Accédez à votre espace Pépinière Manager
                        </p>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="email" className="sr-only">Adresse email</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                    placeholder="Adresse email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">Mot de passe</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                    placeholder="Mot de passe"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                />
                            </div>
                        </div>
    
                        <div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 shadow-md"
                            >
                                {processing ? 'Connexion en cours...' : 'Se connecter'}
                            </button>
                        </div>
                        
                        {errors.email && (
                            <div className="text-red-500 text-sm mt-2 text-center">
                                Identifiants incorrects
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </>
    );
}
