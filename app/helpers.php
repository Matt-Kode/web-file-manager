<?php
function generateApiKey($length = 32) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $apiKey = '';

    for ($i = 0; $i < $length; $i++) {
        $randomIndex = rand(0, $charactersLength - 1);
        $apiKey .= $characters[$randomIndex];
    }

    return $apiKey;
}

function signApiKey($api_key) {
    $secret_key = "jF5mSgX6Ds";
    $hashed_key = hash_hmac('sha256', $api_key, $secret_key);
    return $api_key . "." . $hashed_key;
}
