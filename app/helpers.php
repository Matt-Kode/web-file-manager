<?php
function signTokenWithPermission($permission) {
    $token = config('api.api_key') . '.' . $permission;
    $hashed_key = hash_hmac('sha256', $token, config('api.secret_key'));
    return $token . "." . $hashed_key;
}
