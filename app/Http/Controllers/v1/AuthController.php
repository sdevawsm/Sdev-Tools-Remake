<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    //
    public function login()
    {
        return view('v1.login');
    }

    public function register()
    {
        return view('v1.register');
    }

    public function authenticate(Request $request)
    {
        // lógica de autenticação
    }

    public function logout()
    {
        // lógica de logout
    }



}
