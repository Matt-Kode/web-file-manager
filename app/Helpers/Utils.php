<?php

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
function getPermForPathFromRule(String $filepath, String $action) : int  {
    $userrules = Rule::where('user_id', Auth::user()->id)->orderBy('priority', 'DESC')->get();
    if ($userrules->isEmpty()) {
        return 0;
    }
    foreach ($userrules as $rule) {
        if (str_starts_with($filepath, $rule->filepath)) {
            return $rule->getAttribute($action) ?? 0;
        }
    }
    return 0;
}
