<?php

namespace App\Http\Controllers;


use App\Models\User;

class RulesController extends Controller
{
    public function index($userid) {
        if (User::find($userid)) {
            return view('rules');
        }
        abort(404);
    }

    public function get($userid) {

    }
}
