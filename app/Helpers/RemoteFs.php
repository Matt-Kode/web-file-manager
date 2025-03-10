<?php

namespace App\Helpers;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Support\Facades\Auth;

Class RemoteFs {

    const REMOTE_URL = "http://site2.localhost";

    public static function put(String $filepath, $content) {
        return self::httpRequstAction('/put.php',
            ['content-type' => 'application/json'],
            ['filepath' => $filepath, 'content' => $content]);
    }
    public static function download(array $filepaths) {
        return self::httpRequstAction('/download.php',
            ['content-type' => 'application/json'],
            ['filepaths' => $filepaths]);
    }

    public static function rename(String $filepath, String $newfilename) {
        return self::httpRequstAction('/rename.php',
            ['content-type' => 'application/json'],
            ['filepath' => $filepath, 'newfilename' => $newfilename]);
    }

    public static function delete(String $filepath) {
        return self::httpRequstAction('/delete.php',
            ['content-type' => 'application/json'],
            ['filepath' => $filepath]);
    }

    public static function move(String $filepath, String $destination) {
        return self::httpRequstAction('/move.php',
            ['content-type' => 'application/json'],
            ['filepath' => $filepath, 'destination' => $destination]);
    }

    public static function get(String  $filepath) {
        return self::httpRequstAction('/get.php',
            ['content-type' => 'application/json'],
            ['filepath' => $filepath]);
    }

    public static function create(String $filepath, String $filename, String $filetype) {
        return self::httpRequstAction('/create.php',
            ['content-type' => 'application/json'],
            ['filepath' => $filepath, 'filename' => $filename, 'filetype' => $filetype]);
    }
    public static function upload(String $filepath, $file) {
        return self::httpRequestUpload('/upload.php',
            [],
            [['name' => 'file', 'contents' => fopen($file->getPathname(), 'r'), 'filename' => $file->getClientOriginalName()], ['name' => 'filepath', 'contents' => $filepath]]);
    }
    private static function httpRequstAction(String $route, array $headers, array $params) {
        $headers += ['Authorization' => 'Bearer ' . signTokenWithPermission(Auth::user()->is_admin)];
        $client = new Client([
            'base_uri' => self::REMOTE_URL
        ]);
        try {
            $response = $client->request('POST', $route,  [
                'headers' => $headers,
                'json' => $params,
            ]);
            if ($response->getStatusCode() == 200) {
                if ($response->hasHeader('File-Name')) {
                    header('File-Name: ' . $response->getHeader('File-Name')[0]);
                }
                return response($response->getBody())->header('Content-Type', $response->getHeader('Content-Type')[0]);
            }
        } catch (ClientException) {
            return response()->json(['type' => 'error', 'content' => 'Failed request to remote url']);
        }
        return response()->json(['type' => 'error', 'content' => 'Failed to interact with remote file system']);
    }

    private static function httpRequestUpload(String $route, array $headers, array $params) {
        $headers += ['Authorization' => 'Bearer ' . signTokenWithPermission(Auth::user()->is_admin)];
        $client = new Client([
            'base_uri' => self::REMOTE_URL
        ]);
        try {
            $response = $client->request('POST', $route,  [
                'headers' => $headers,
                'multipart' => $params,
            ]);
            if ($response->getStatusCode() == 200) {
                return $response->getBody();
            }
        } catch (ClientException) {
            return response()->json(['type' => 'error', 'content' => 'Failed request to remote url']);
        }
        return response()->json(['type' => 'error', 'content' => 'Failed to interact with remote file system']);
    }
}
