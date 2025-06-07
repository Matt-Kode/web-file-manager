<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\Rule;
use Illuminate\Http\Request;

class GroupsController extends Controller
{
    public function get(Request $request) {
        $group_id = $request->input('group_id');
        if ($group_id !== null) {
            $group = Group::find($group_id);
            if ($group !== null) {
                return response()->json(['group_name' => $group->name]);
            } else {
                return response()->json(['group_name' => '']);
            }
        }
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

    public function update(Request $request) {
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

    public function delete(Request $request) {
        $groupid = $request->input('group_id');

        Group::destroy($groupid);
        Rule::where('group_id', $groupid)->delete();

        return response()->json(['type' => 'success', 'content' => 'Group successfully deleted']);
    }
}
