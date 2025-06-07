<?php

namespace App\Helpers;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Support\Facades\Auth;

Class RemoteFs {

    const REMOTE_URL = "http://site2.localhost";

    public static function put(String $filepath, $content) {
        return self::httpRequestAction('edit', '/put.php',
            ['content-type' => 'application/json'],
            ['filepath' => $filepath, 'content' => $content]);
    }
    public static function download(array $filepaths) {
        return self::httpRequestAction('download', '/download.php',
            ['content-type' => 'application/json'],
            ['filepaths' => $filepaths]);
    }

    public static function rename(String $filepath, String $newfilename) {
        return self::httpRequestAction('rename', '/rename.php',
            ['content-type' => 'application/json'],
            ['filepath' => $filepath, 'newfilename' => $newfilename]);
    }

    public static function permanentDelete(String $filepath) {
        return self::httpRequestAction('permanent_delete', '/delete.php',
            ['content-type' => 'application/json'],
            ['filepath' => $filepath]);
    }

    public static function delete(String $filepath) {
        return self::httpRequestAction('delete', '/move.php',
            ['content-type' => 'application/json'],
            ['filepath' => $filepath, 'destination' => 'deleted_files']);
    }

    public static function move(String $filepath, String $destination) {
        return self::httpRequestAction('move', '/move.php',
            ['content-type' => 'application/json'],
            ['filepath' => $filepath, 'destination' => $destination]);
    }

    public static function get(String  $filepath) {
        return self::httpRequestAction('view', '/get.php',
            ['content-type' => 'application/json'],
            ['filepath' => $filepath]);
    }

    public static function create(String $filepath, String $filename, String $filetype) {
        return self::httpRequestAction('create', '/create.php',
            ['content-type' => 'application/json'],
            ['filepath' => $filepath, 'filename' => $filename, 'filetype' => $filetype]);
    }
    public static function upload(String $filepath, $file) {
        return self::httpRequestAction('upload', '/upload.php',
            [],
            [['name' => 'file', 'contents' => fopen($file->getPathname(), 'r'), 'filename' => $file->getClientOriginalName()], ['name' => 'filepath', 'contents' => $filepath]]);
    }

    private static function httpRequestAction(String $permname, String $route, array $headers, array $params) {
        $headers += ['Authorization' => 'Bearer ' . signTokenWithId(Auth::user()->id)];
        $client = new Client([
            'base_uri' => self::REMOTE_URL
        ]);
        try {
            $response = $client->request('POST', $route,  [
                'headers' => $headers,
                ($permname === 'upload' ? 'multipart' : 'json') => $params,
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
}
