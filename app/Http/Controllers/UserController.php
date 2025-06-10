<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function get() {
        $currentuser = Auth::user();
        if ($currentuser->id == 1) {
            return response()->json(['user_id' => $currentuser->id, 'users' => User::all()]);

        } else {
            return response()->json(['user_id' => $currentuser->id, 'users' => User::where('id', '!=', 1)->get()]);
        }
    }

    public function create(Request $request) {
        $name = $request->input('username');
        $password = $request->input('password');
        $is_admin = $request->input('is_admin');
        $group_name = $request->input('group_name');

        if ($is_admin == 1) {
            if (Auth::user()->id != 1) {
                return response()->json(['type' => 'error', 'content' => 'You cannot make admin users']);
            }
        }

        if ($name === 'deleted-user') {
            return response()->json(['type' => 'error', 'content' => 'Invalid username']);
        }

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

        if ($group_name !== null) {
            $group = Group::where('name', $group_name)->first();
            if ($group != null) {
                $user->group_id = $group->id;
            }
        }

        if ($user->save()) {
            return response()->json(['type' => 'success', 'content' => 'User created successfully']);
        }
        return response()->json(['type' => 'error', 'content' => 'Something went wrong']);
    }

    public function update(Request $request) {
        $id = $request->input('userid');
        $name = $request->input('username');
        $password = $request->input('password');
        $is_admin = $request->input('is_admin');
        $group_name = $request->input('group_name');

        $user = User::find($id);
        if (!$user) {
            return response()->json(['type' => 'error', 'content' => 'User not found']);
        }
        $currentuser = Auth::user();
        if (($currentuser->id != $id) && ($user->is_admin == 1) && ($currentuser->id != 1)) {
            return response()->json(['type' => 'error', 'content' => 'You cannot edit this user']);
        }
        if ($is_admin == 1 && $currentuser->id != 1 && $user->is_admin != 1) {
           return response()->json(['type' => 'error', 'content' => 'You cannot make admin users']);
        }

        if ($name === 'deleted-user') {
            return response()->json(['type' => 'error', 'content' => 'Invalid username']);
        }

        $userwithsamename = User::where('username', $name)->first();
        if ($userwithsamename) {
            if ($userwithsamename->id !== $id) {
                return response()->json(['type' => 'error', 'content' => 'Username already exists']);
            }
        }

        if ($name === null) {
            return response()->json(['type' => 'error', 'content' => 'Username is required']);
        }
        if ($password !== null) {
            $user->password = bcrypt($password);
        }

        if ($group_name !== null) {
            $group = Group::where('name', $group_name)->first();
            if ($group != null) {
                $user->group_id = $group->id;
            } else {
                return response()->json(['type' => 'error', 'content' => 'Group not found']);
            }
        } else {
            $user->group_id = null;
        }
        $user->username = $name;
        $user->is_admin = $is_admin ? 1 : 0;

        if ($user->save()) {
            return response()->json(['type' => 'success', 'content' => 'User updated successfully']);
        }
        return response()->json(['type' => 'error', 'content' => 'Something went wrong']);
    }

    public function delete(Request $request)
    {
        $userid = $request->input('user_id');

        if ($userid == 1) {
            return response()->json(['type' => 'error', 'content' => 'You cannot delete this user']);
        }
        $user = User::find($userid);
        if ($user == null) {
            return response()->json(['type' => 'error', 'content' => 'Cannot find this user']);
        }
        if ($user->is_admin == 1 && Auth::user()->id != 1) {
            return response()->json(['type' => 'error', 'content' => 'You cannot delete this user']);
        }
        if ($user->delete()) {
            return response()->json(['type' => 'success', 'content' => 'User deleted successfully']);
        }
        return response()->json(['type' => 'error', 'content' => 'Something went wrong']);
    }



}
