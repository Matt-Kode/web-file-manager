<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Changelog extends Model
{
    public $timestamps = false;
    public function createLog(String $action, String $filepath, String $done_by, String $old_content = '', String $new_content = '', int $approved, String $reviewer = '') {
        $this->action = $action;
        $this->filepath = $filepath;
        $this->done_by = $done_by;
        if ($action === 'edit') {
            $this->old_content = $old_content;
            $this->new_content = $new_content;
        }
        $this->approved = $approved;
        if ($reviewer !== '') {
            $this->reviewed_by = $reviewer;
        }
        $this->save();
    }

    public function user() {
        return $this->belongsTo(User::class, 'done_by');
    }

    public function reviewer() {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
