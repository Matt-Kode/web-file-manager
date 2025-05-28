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
        if (!Auth::user()->is_admin && !getPermissionForPath($filepath, 'view')) {
            return response()->json(['type' => 'no_permission']);
        }
        return RemoteFs::get($filepath);
    }

    public function put(Request $request) {
        $filepath = $request->input('filepath');
        $content = $request->input('content');
        if (!Auth::user()->is_admin && !getPermissionForPath($filepath, 'edit')) {
            return response()->json(['type' => 'error', 'content' => 'Permission denied']);
        }
        if (Auth::user()->is_admin) {
            $changelog = new Changelog();
            $response = RemoteFs::put($filepath, $content);
            $responsedata = json_decode($response->getContent());
            if ($responsedata->type !== 'success') {
                return $response;
            }
            $changelog->createLog('edit', $filepath, Auth::user()->id, $responsedata->old_file_content, $content, 1, Auth::user()->id);
            return $response;
        }
        $response = RemoteFs::get($filepath);
        $responsedata = json_decode($response->getContent());
        if ($responsedata->type === 'error') {
            return $response;
        }
        $changelog = new Changelog();
        $changelog->createLog('edit', $filepath, Auth::user()->id, $responsedata->content, $content, 2);
        return response()->json(['type' => 'success', 'content' => 'Submitted file edit for review']);
    }

    public function create(Request $request) {
        $filepath = $request->input('filepath');
        $filename = $request->input('filename');
        $filetype = $request->input('filetype');
        if (!Auth::user()->is_admin && !getPermissionForPath($filepath, 'create')) {
            return response()->json(['type' => 'error', 'content' => 'Permission denied']);
        }
        return RemoteFs::create($filepath, $filename, $filetype);
    }

    public function delete(Request $request) {
        $filepath = $request->input('filepath');
        if (!Auth::user()->is_admin && !getPermissionForPath($filepath, 'delete')) {
            return response()->json(['type' => 'error', 'content' => 'Permission denied']);
        }
        return RemoteFs::delete($filepath);
    }

    public function rename(Request $request) {
        $filepath = $request->input('filepath');
        $newfilename = $request->input('newfilename');
        if (!Auth::user()->is_admin && !getPermissionForPath($filepath, 'rename')) {
            return response()->json(['type' => 'error', 'content' => 'Permission denied']);
        }
        return RemoteFs::rename($filepath, $newfilename);
    }

    public function upload(Request $request) {
        $filepath = $request->input('filepath');
        $file = $request->file('file');
        if (!Auth::user()->is_admin && !getPermissionForPath($filepath, 'upload')) {
            return response()->json(['type' => 'error', 'content' => 'Permission denied']);
        }
        return RemoteFs::upload($filepath, $file);
    }

    public function download(Request $request) {
        $filepaths = $request->input('filepaths');
        foreach ($filepaths as $filepath) {
            if (!Auth::user()->is_admin && !getPermissionForPath($filepath, 'download')) {
                return response()->json(['type' => 'error', 'content' => 'Permission denied']);
            }
        }
        return RemoteFs::download($filepaths);
    }
}
