<?php

namespace App\Http\Controllers;


use App\Models\Rule;
use Illuminate\Http\Request;

class RulesController extends Controller
{
    public function get(Request $request) {
        $groupid = $request->input('group_id');
        return response()->json(Rule::where('group_id', $groupid)->orderBy('priority', 'desc')->get());
    }

    public function create(Request $request) {
        $filepath = $request->input('filepath');
        $groupid = $request->input('group_id');
        $priority = (int) $request->input('priority');
        $permissions = $request->input('permissions');

        if ($filepath === null) {
            return response()->json(['type' => 'error', 'content' => 'Filepath is required']);
        }

        if ($priority === null) {
            $priority = 0;
        }

        if ($groupid === null) {
            return response()->json(['type' => 'error', 'content' => 'Couldn\'t find group id']);
        }

        $rule = new Rule;
        $rule->group_id = $groupid;
        $rule->filepath = $filepath;
        $rule->priority = $priority;
        $rule->view = $permissions['view'];
        $rule->edit = $permissions['edit'];
        $rule->create = $permissions['create'];
        $rule->rename = $permissions['rename'];
        $rule->download = $permissions['download'];
        $rule->upload = $permissions['upload'];
        $rule->delete = $permissions['delete'];

        if ($rule->save()) {
            return response()->json(['type' => 'success', 'content' => 'Rule created successfully']);
        }

        return response()->json(['type' => 'error', 'content' => 'Something went wrong']);
    }

    public function edit(Request $request) {

    }
}
