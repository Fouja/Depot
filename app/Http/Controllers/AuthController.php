<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function loginView()
    {
        return Inertia::render('Login');
    }

    public function homeView()
    {
        return Inertia::render('Home');
    }

    public function login(Request $request)
{
    $user = \App\Models\User::where('email', $request->email)->first();


    if ($user && \Illuminate\Support\Facades\Hash::check($request->password, $user->password)) {
        Auth::login($user);
        return redirect()->intended(route('home')); // Use intended redirect
    }
    
    return back()->withErrors([
        'email' => 'Invalid credentials',
    ]);
}

    public function logout()
    {
        Auth::logout();
        return redirect()->route('login');
    }
}