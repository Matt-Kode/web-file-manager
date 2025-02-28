<?php

namespace App\Http\Controllers;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use http\Env\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class FileController extends Controller
{
    const API_URL = 'http://site2.localhost';

    public function get(Request $request) {
        $filepath = $request->input('filepath');
        if (!$this->apiCall('/api/get.php', ['content-type' => 'application/json'], ['filepath' => $filepath])) {
            return response()->json(['type'=>'error', 'content' => 'Failed to retrieve files']);
        }
        return;
    }

    public function put(Request $request) {
        $filepath = $request->input('filepath');
        $content = $request->input('content');

        if (!$this->apiCall('/api/put.php', ['content-type' => 'application/json'], ['filepath' => $filepath, 'content' => $content])) {
            return response()->json(['type'=>'error', 'content' => 'Failed to save file']);
        }
        return;
    }

    public function create(Request $request) {
        $filepath = $request->input('filepath');
        $filename = $request->input('filename');
        $filetype = $request->input('filetype');

        if (!$this->apiCall('/api/create.php', ['content-type' => 'application/json'], ['filepath' => $filepath, 'filename' => $filename, 'filetype' => $filetype])) {
            return response()->json(['type'=>'error', 'content' => 'Failed to create file/folder']);
        }
        return;
    }

    public function delete(Request $request) {
        $filepath = $request->input('filepath');

        if (!$this->apiCall('/api/delete.php', ['content-type' => 'application/json'], ['filepath' => $filepath])) {
            return response()->json(['type'=>'error', 'content' => 'Failed to delete file']);
        }
        return;
    }

    public function rename(Request $request) {
        $filepath = $request->input('filepath');
        $newfilename = $request->input('newfilename');

        if (!$this->apiCall('/api/rename.php', ['content-type' => 'application/json'], ['filepath' => $filepath, 'newfilename' => $newfilename])) {
            return response()->json(['type'=>'error', 'content' => 'Failed to rename file']);
        }
        return;
    }

    public function upload(Request $request) {
        $filepath = $request->input('filepath');
        $file = $request->file('file');
        if (!$this->apiUpload('/api/upload.php', [], [['name' => 'file', 'contents' => fopen($file->getPathname(), 'r'), 'filename' => $file->getClientOriginalName()], ['name' => 'filepath', 'contents' => $filepath]])) {
            return response()->json(['type'=>'error', 'content' => 'Failed to upload file']);
        }
        return;
    }

    public function download(Request $request) {
        $filepaths = $request->input('filepaths');
        if (!$this->apiCall('/api/download.php', ['content-type' => 'application/json'], ['filepaths' => $filepaths])) {
            return response()->json(['type'=>'error', 'content' => 'Failed to download file']);
        }
    }

    private function apiCall($route, $headers, $params) {
        $headers += ['Authorization' => 'Bearer ' . signTokenWithPermission(Auth::user()->permission)];
        $client = new Client([
            'base_uri' => self::API_URL
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
                header('Content-Type: ' . $response->getHeader('Content-Type')[0]);
                 echo $response->getBody();
                 return true;
            }
        } catch (ClientException $e) {
            return false;
        }
        return false;
    }

    private function apiUpload($route, $headers, $params) {
        $headers += ['Authorization' => 'Bearer ' . signTokenWithPermission(Auth::user()->permission)];
        $client = new Client([
            'base_uri' => self::API_URL
        ]);
        try {
            $response = $client->request('POST', $route,  [
                'headers' => $headers,
                'multipart' => $params,
            ]);
            if ($response->getStatusCode() == 200) {
                echo $response->getBody();
                return true;
            }
        } catch (ClientException $e) {
            return false;
        }
        return false;
    }
}
