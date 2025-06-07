<?php

use App\Models\Group;
use App\Models\Rule;
use Illuminate\Support\Facades\Auth;

function signTokenWithId($id) {
    $token = config('api.api_key') . '.' . $id;
    $hashed_key = hash_hmac('sha256', $token, config('api.secret_key'));
    return $token . "." . $hashed_key;
}

function getLastFolder(String $currentpath) : String {
    $currentpatharray = explode('/', $currentpath);
    $counter = 1;
    $newfilepath = '';
    while ($counter < count($currentpatharray) - 1) {
        $newfilepath .= '/' . $currentpatharray[$counter];
        $counter++;
    }
    return $newfilepath;
}
function getPermissionForPath(String $filepath, String $action) : int
{
    $usergroup = Auth::user()->group_id;
    if ($usergroup == null) {
        return 0;
    }
    $rules = Rule::where('group_id', $usergroup)->orderBy('priority', 'desc')->get();

    if ($rules->isEmpty()) {
        return 0;
    }

    foreach ($rules as $rule) {
        if (str_starts_with($filepath, $rule->filepath)) {
            switch ($action) {
                case $action === 'view':
                    return $rule->view;
                case $action === 'edit':
                    return $rule->edit;
                case $action === 'delete':
                    return $rule->delete;
                case $action === 'create':
                    return $rule->create;
                case $action === 'upload':
                    return $rule->upload;
                case $action === 'download':
                    return $rule->download;
                case $action === 'rename':
                    return $rule->rename;
            }
        }
    }
    return 0;
}
