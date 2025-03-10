<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function get() {
        return response()->json(User::all());
    }

    public function add(Request $request) {
        $name = $request->input('username');
        $password = $request->input('password');
        $is_admin = $request->input('is_admin');

        if (User::where('username', $name)->exists()) {
            return response()->json(['type' => 'error', 'content' => 'Username already exists']);
        }
        $user = new User();
        if ($name === null) {
            return response()->json(['type' => 'error', 'content' => 'Username is required']);
        }
        if ($password === null) {
            return response()->json(['type' => 'error', 'content' => 'Password is required']);
        }
        $user->username = $name;
        $user->password = bcrypt($password);
        $user->is_admin = $is_admin ? 1 : 0;
        $user->save();

        return response()->json(['type' => 'success', 'content' => 'User created']);
    }

    public function update(Request $request) {
        $id = $request->input('userid');
        $name = $request->input('username');
        $password = $request->input('password');
        $is_admin = $request->input('is_admin');

        $user = User::find($id);
        if (!$user) {
            return response()->json(['type' => 'error', 'content' => 'User not found']);
        }
        $userwithsamename = User::where('username', $name)->first();
        if ($userwithsamename) {
            if ($userwithsamename->id !== $id) {
                return response()->json(['type' => 'error', 'content' => 'Username already exists']);
            }
        }

        if (Auth::user()->is_admin !== 1 || $user->is_admin === 1) {
            return response()->json(['type' => 'error', 'content' => 'You don\'t have permission to edit this user']);
        }

        if ($name === null) {
            return response()->json(['type' => 'error', 'content' => 'Username is required']);
        }
        if ($password === null) {
            $user->password = bcrypt($password);
        }
        $user->username = $name;
        $user->is_admin = $is_admin ? 1 : 0;
        $user->save();

        return response()->json(['type' => 'success', 'content' => 'User updated']);
    }
}
