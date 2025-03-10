<?php

namespace App\Http\Controllers;

use App\Helpers\RemoteFs;
use App\Models\Changelog;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ChangelogController extends Controller
{
    public function get() {
        $changlelogs = Changelog::with('user')->orderBy('done_at', 'desc')->get();
        $data = ['is_admin' => Auth::user()->is_admin];
        foreach ($changlelogs as $cl) {
            $done_at = Carbon::parse($cl->done_at)->format('M d, Y H:i');
            $data['changelogs'][] = ['id' => $cl->id,
                'action' => $cl->action,
                'filepath' => $cl->filepath,
                'done_by' => $cl->user->username,
                'done_at' => $done_at];
        }
        return response()->json($data);
    }

    public function revertEdit(Request $request) {
        if (Auth::user()->is_admin !== 1) {
            return response()->json(['type' => 'error', 'content' => 'No permission']);
        }
        $details = Changelog::find($request->post('id'));
        if ($details->action !== 'edit') {
            return response()->json(['type' => 'error', 'content' => 'Unable to do operation']);
        }
        $response = RemoteFs::put($details->filepath, $details->old_content);
        $responsedata = json_decode($response->getContent());
        if ($responsedata->type !== 'success') {
            return $response;
        }
        Changelog::destroy($request->post('id'));
        return $response;
    }

    public function revertDelete(Request $request) {
        if (Auth::user()->is_admin !== 1) {
            return response()->json(['type' => 'error', 'content' => 'No permission']);
        }
        $details = Changelog::find($request->post('id'));

        if ($details->action !== 'delete') {
            return response()->json(['type' => 'error', 'content' => 'Unable to do operation']);
        }
        $response = RemoteFs::move('deleted_files/' . basename($details->filepath), getLastFolder($details->filepath));
        $responsedata = json_decode($response->getContent());
        if ($responsedata->type !== 'success') {
            return $response;
        }
        Changelog::destroy($request->post('id'));
        return $response;
    }
}
