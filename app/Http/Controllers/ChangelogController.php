<?php

namespace App\Http\Controllers;

use App\Helpers\Diff;
use App\Helpers\RemoteFs;
use App\Models\Changelog;
use App\Models\User;
use Carbon\Carbon;
use http\Env\Response;
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
                'approved' => $cl->approved,
                'done_by' => $cl->user !== null ? $cl->user->username : 'deleted-user',
                'done_at' => $done_at];
        }
        return response()->json($data);
    }

    public function getChangelogDiff($changelogid) {
        $changelog = Changelog::find($changelogid);
        if (!$changelog || $changelog->action !== 'edit') {
            return response()->json(['type' => 'error', 'content' => 'Cannot find this changelog']);
        }

        $diff = (new Diff($changelog->old_content, $changelog->new_content))->run();
        return response()->json(['type' => 'success', 'diff' => $diff, 'is_admin' => Auth::user()->is_admin, 'approved' => $changelog->approved, 'reviewed_by' => ($changelog->approved === 1 || $changelog->approved === 0) ? User::find($changelog->reviewed_by)->username : null]);
    }
    public function acceptEdit(Request $request, $clid) {
        $changelog = Changelog::find($clid);
        if (!$changelog) {
            return response()->json(['type' => 'error', 'content' => 'Cannot find this changelog']);
        }
        if ($changelog->approved === 1 || $changelog->approved === 0) {
            return response()->json(['type' => 'reviewed', 'content' => 'Changelog has already been reviewed']);
        }

        $response = RemoteFs::get($changelog->filepath);
        $responsedata = json_decode($response->getContent());
        if ($responsedata->type == 'error') {
            return response()->json(['type' => 'error', 'content' => $responsedata->content]);
        }
        if ($responsedata->content != $changelog->old_content) {
            $diff = (new Diff($responsedata->content, $changelog->new_content))->run(true);
            return response()->json(['type' => 'conflict', 'content' => $diff]);
        }
        $response = RemoteFs::put($changelog->filepath, $changelog->new_content);
        $responsedata = json_decode($response->getContent());
        if ($responsedata->type !== 'success') {
            return $response;
        }
        $changelog->approved = 1;
        //$changelog->done_at = Carbon::now();
        $changelog->reviewed_by = Auth::user()->id;
        $changelog->save();
        return $response;
    }

    public function rejectEdit(Request $request, $clid) {
        $changelog = Changelog::find($clid);
        if (!$changelog) {
            return response()->json(['type' => 'error', 'content' => 'Cannot find this changelog']);
        }
        if ($changelog->approved === 1 || $changelog->approved === 0) {
            return response()->json(['type' => 'error', 'content' => 'Changelog has already been reviewed']);
        }
        $changelog->approved = 0;
        //$changelog->done_at = Carbon::now();
        $changelog->reviewed_by = Auth::user()->id;
        $changelog->save();
        return response()->json(['type' => 'success', 'content' => 'Changelog rejected']);
    }

    public function saveConflict(Request $request) {
        $clid = $request->input('changelog_id');
        $content = $request->input('content');

        $changelog = Changelog::find($clid);
        if (!$changelog) {
            return response()->json(['type' => 'error', 'content' => 'Cannot find this changelog']);
        }

        $response = RemoteFs::put($changelog->filepath, $content);
        $responsedata = json_decode($response->getContent());
        if ($responsedata->type === 'success') {
            $changelog->approved = 1;
            $changelog->reviewed_by = Auth::user()->id;
            $changelog->save();
            return response()->json(['type' => 'success', 'content' => 'Changelog approved']);
        }
        return $response;
    }
}
