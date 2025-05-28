<?php

namespace App\Http\Controllers;

use App\Models\Group;
use Illuminate\Http\Request;

class GroupsController extends Controller
{
    public function get(Request $request) {
        return response()->json(Group::all());
    }

    public function create(Request $request) {
        $name = $request->input('name');
        $discordroleid = $request->input('discord_role_id');

        if (Group::where('name', $name)->exists()) {
            return response()->json(['type' => 'error', 'content' => 'Group name already exists']);
        }

        $group = new Group;
        $group->name = $name;
        if ($discordroleid !== null) {
            $group->discord_role_id = $discordroleid;
        }
        if ($group->save()) {
            return response()->json(['type' => 'success', 'content' => 'Group successfully created']);
        }
        return response()->json(['type' => 'error', 'content' => 'Something went wrong']);
    }

    public function edit(Request $request) {
        $id = $request->input('id');
        $name = $request->input('name');
        $discordroleid = $request->input('discord_role_id');

        if (!($group = Group::find($id))) {
            return response()->json(['type' => 'error', 'content' => 'Group does not exist']);
        }

        if (Group::where('name', $name)->where('id', '!=', $id)->exists()) {
            return response()->json(['type' => 'error', 'content' => 'Group name already exists']);
        }
        $group->name = $name;
        $group->discord_role_id = $discordroleid;

        if ($group->save()) {
            return response()->json(['type' => 'success', 'content' => 'Group successfully updated']);
        }
        return response()->json(['type' => 'error', 'content' => 'Something went wrong']);

    }
}
