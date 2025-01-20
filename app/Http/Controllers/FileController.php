<?php

namespace App\Http\Controllers;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FileController extends Controller
{
    const API_URL = 'http://site2.localhost';

    public function get(Request $request) {
        $filepath = $request->input('filepath');
        $client = new Client([
            'base_uri' => self::API_URL
        ]);
        try {
            $response = $client->request('POST', '/api/get.php',  [
                'headers' => [
                    'Authorization' => 'Bearer ' . signApiKey(Auth::user()->api_key . '.' . Auth::user()->permission),
                    'Content-Type' => 'application/json'
                ],
                'json' => [
                    'filepath' => $filepath,
                ]
            ]);
            if ($response->getStatusCode() == 200) {
                echo $response->getBody();
                return;
            }
        } catch (ClientException $e) {
            echo json_encode(['type'=>'error', 'content' => 'Failed client api call']);
            return;
        }
        echo json_encode(['type'=>'error', 'content' => 'Failed to retrieve files']);
    }

    public function put(Request $request) {
        $filepath = $request->input('filepath');
        $content = $request->input('content');
        $client = new Client([
            'base_uri' => self::API_URL
        ]);
        try {
            $response = $client->request('POST', '/api/put.php',  [
                'headers' => [
                    'Authorization' => 'Bearer ' . signApiKey(Auth::user()->api_key . '.' . Auth::user()->permission),
                    'Content-Type' => 'application/json'
                ],
                'json' => [
                    'filepath' => $filepath,
                    'content' => $content,
                ]
            ]);
            if ($response->getStatusCode() == 200) {
                echo $response->getBody();
                return;
            }
        } catch (ClientException $e) {
            echo json_encode(['type'=>'error', 'content' => 'Failed client api call']);
            return;
        }
        echo json_encode(['type'=>'error', 'content' => 'Failed to save file']);
    }

    public function create(Request $request) {
        $filepath = $request->input('filepath');
        $filename = $request->input('filename');
        $filetype = $request->input('filetype');

        $client = new Client([
            'base_uri' => self::API_URL
        ]);
        try {
            $response = $client->request('POST', '/api/put.php',  [
                'headers' => [
                    'Authorization' => 'Bearer ' . signApiKey(Auth::user()->api_key . '.' . Auth::user()->permission),
                    'Content-Type' => 'application/json'
                ],
                'json' => [
                    'filepath' => $filepath,
                    'filename' => $filename,
                    'filetype' => $filetype
                ]
            ]);
            if ($response->getStatusCode() == 200) {
                echo $response->getBody();
                return;
            }
        } catch (ClientException $e) {
            echo json_encode(['type'=>'error', 'content' => 'Failed client api call']);
            return;
        }
        echo json_encode(['type'=>'error', 'content' => 'Failed create action']);
    }
}
