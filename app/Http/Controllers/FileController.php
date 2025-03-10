<?php

namespace App\Http\Controllers;

use App\Models\Changelog;
use Illuminate\Http\Request;
use App\Helpers\RemoteFs;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class FileController extends Controller
{
    public function get(Request $request)
    {
        $filepath = $request->input('filepath');
        return RemoteFs::get($filepath);
    }

    public function put(Request $request) {
        $filepath = $request->input('filepath');
        $content = $request->input('content');
        $response = RemoteFs::put($filepath, $content);
        $responsedata = json_decode($response->getContent());
        if ($responsedata->type !== 'success') {
            return $response;
        }
        $changelog = new Changelog();
        $changelog->createLog('edit', $filepath, Auth::user()->id, $responsedata->old_file_content, $content);
        return $response;
    }

    public function create(Request $request) {
        $filepath = $request->input('filepath');
        $filename = $request->input('filename');
        $filetype = $request->input('filetype');
        return RemoteFs::create($filepath, $filename, $filetype);
    }

    public function delete(Request $request) {
        $filepath = $request->input('filepath');
        $response = RemoteFs::move($filepath, 'deleted_files');
        $responsedata = json_decode($response->getContent());
        if ($responsedata->type !== 'success') {
            return $response;
        }
        $changelog = new Changelog();
        $changelog->createLog('delete', $filepath, Auth::user()->id);
        return $response;
    }

    public function rename(Request $request) {
        $filepath = $request->input('filepath');
        $newfilename = $request->input('newfilename');

        return RemoteFs::rename($filepath, $newfilename);
    }

    public function upload(Request $request) {
        $filepath = $request->input('filepath');
        $file = $request->file('file');

        return RemoteFs::upload($filepath, $file);
    }

    public function download(Request $request) {
        $filepaths = $request->input('filepaths');
        return RemoteFs::download($filepaths);
    }
}
