<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function authenticate(Request $request) {

        if (Auth::attempt($request->only('username', 'password'))) {
            return http_response_code(200);
        }

        return response()->json(['error' => 'Credentials do not match our records'], 400);
    }

    public function logout() {
        Auth::logout();
        return redirect()->route('login');
    }
}
