<?php

namespace App\Http\Controllers;


use App\Models\Rule;
use App\Models\User;
use http\Env\Response;

class RulesController extends Controller
{

    public function index($userid) {
        if (User::find($userid)) {
            return view('rules');
        }
        abort(404);
    }
    public function get($userid) {
        return response()->json(Rule::where('user_id', $userid)->get());
    }

    public function create(Request $request, $userid) {
        $filepath = $request->input('filepath');
        $priority = $request->input('priority');
        $permissions = $request->input('permissions');

        $rule = new Rule;
        $rule->user_id = $userid;
        $rule->filepath = $filepath;
        $rule->priority = $priority;
        $rule->view = $permissions['view'];
        $rule->edit = $permissions['edit'];
        $rule->create = $permissions['create'];
        $rule->rename = $permissions['rename'];
        $rule->download = $permissions['download'];
        $rule->upload = $permissions['upload'];
        $rule->delete = $permissions['delete'];
        $rule->save();
    }

    public function edit(Request $request) {

    }
}
