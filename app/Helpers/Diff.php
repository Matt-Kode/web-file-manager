<?php
namespace App\Helpers;
use Illuminate\Support\Facades\Log;

class Diff
{

    private $old_content;
    private $new_content;

    function __construct($old_content, $new_content)
    {
        $this->old_content = $old_content;
        $this->new_content = $new_content;
    }

    public function run($conflict = false)
    {
        $lcs = $this->longestCommonSubsequence();
        $old_content_lines = explode("\n", $this->old_content);
        $new_content_lines = explode("\n", $this->new_content);

        $diff = [
            'all_lines' => [],
            'added_lines' => [],
            'removed_lines' => []
        ];
        $i = 0;
        $j = 0;
        $lcs_index = 0;
        $total_line_count = 0;

        while ($i < count($old_content_lines) || $j < count($new_content_lines)) {
            if ($lcs_index < count($lcs) && $i < count($old_content_lines) && $j < count($new_content_lines) &&
                $old_content_lines[$i] === $lcs[$lcs_index] && $new_content_lines[$j] === $lcs[$lcs_index]) {
                $diff['all_lines'][] = $old_content_lines[$i];
                $i++;
                $j++;
                $lcs_index++;
            } elseif ($i < count($old_content_lines) &&
                ($j >= count($new_content_lines) || $lcs_index >= count($lcs) || $old_content_lines[$i] !== $lcs[$lcs_index])) {
                $diff['all_lines'][] = $old_content_lines[$i];
                $diff['removed_lines'][] = $total_line_count;
                $i++;
            } elseif ($j < count($new_content_lines) &&
                ($i >= count($old_content_lines) || $lcs_index >= count($lcs) || $new_content_lines[$j] !== $lcs[$lcs_index])) {
                $diff['all_lines'][] = $new_content_lines[$j];
                $diff['added_lines'][] = $total_line_count;
                $j++;
            }
            $total_line_count++;
        }

        if ($conflict) {
            return $this->formatConflictString($diff['removed_lines'], $diff['added_lines'], $diff['all_lines']);
        }

        $diff['all_lines'] = implode("\n", $diff['all_lines']);
        return $diff;
    }

//    private function formatConflictString($removed_line_nums, $new_line_nums, $total_lines) {
//        $start_removed = true;
//        $last_line_num_removed = 0;
//        for ($i = 0; $i < count($removed_line_nums); $i++) {
//            if ($start_removed) {
//                $total_lines[$removed_line_nums[$i]] = "<<<<<<<<<<\n" . $total_lines[$removed_line_nums[$i]];
//                $start_removed = false;
//            } elseif ($last_line_num_removed != $removed_line_nums[$i] - 1) {
//                $total_lines[$last_line_num_removed] = $total_lines[$last_line_num_removed] . "\n>>>>>>>>>> CURRENT";
//                $start_removed = true;
//            }
//            if ($i + 1 == count($removed_line_nums) && !$start_removed) {
//                $total_lines[$last_line_num_removed] = $total_lines[$last_line_num_removed] . "\n>>>>>>>>>> CURRENT";
//            }
//            $last_line_num_removed = $removed_line_nums[$i];
//        }
//
//        $start_new = true;
//        $last_line_num_new = 0;
//        for ($i = 0; $i < count($new_line_nums); $i++) {
//            if ($start_new) {
//                $total_lines[$new_line_nums[$i]] = "<<<<<<<<<<\n" . $total_lines[$new_line_nums[$i]];
//                $start_new = false;
//            } elseif ($last_line_num_new != $new_line_nums[$i] - 1) {
//                $total_lines[$last_line_num_new] = $total_lines[$last_line_num_new] . "\n>>>>>>>>>> NEW";
//                $start_new = true;
//            }
//            if ($i + 1 == count($new_line_nums) && !$start_new) {
//                $total_lines[$last_line_num_new] = $total_lines[$last_line_num_new] . "\n>>>>>>>>>> NEW";
//            }
//            $last_line_num_new = $new_line_nums[$i];
//        }
//
//        return implode("\n", $total_lines);
//    }

    private function formatConflictString($removed_line_nums, $new_line_nums, $total_lines) {
        $conflict_open = false;

        for ($i = 0; $i < count($removed_line_nums); $i++) {
            $current = $removed_line_nums[$i];
            $prev = $i > 0 ? $removed_line_nums[$i - 1] : null;

            if (!$conflict_open || $prev === null || $current !== $prev + 1) {
                $total_lines[$current] = "<<<<<<<<<<\n" . ($total_lines[$current] ?? '');
                $conflict_open = true;
            }

            $next = $i + 1 < count($removed_line_nums) ? $removed_line_nums[$i + 1] : null;
            if ($next === null || $next !== $current + 1) {
                $total_lines[$current] .= "\n>>>>>>>>>> CURRENT";
                $conflict_open = false;
            }
        }

        $conflict_open = false;
        for ($i = 0; $i < count($new_line_nums); $i++) {
            $current = $new_line_nums[$i];
            $prev = $i > 0 ? $new_line_nums[$i - 1] : null;

            if (!$conflict_open || $prev === null || $current !== $prev + 1) {
                $total_lines[$current] = "<<<<<<<<<<\n" . ($total_lines[$current] ?? '');
                $conflict_open = true;
            }

            $next = $i + 1 < count($new_line_nums) ? $new_line_nums[$i + 1] : null;
            if ($next === null || $next !== $current + 1) {
                $total_lines[$current] .= "\n>>>>>>>>>> NEW";
                $conflict_open = false;
            }
        }

        return implode("\n", $total_lines);
    }

    private function longestCommonSubsequence()
    {
        $old_content_lines = explode("\n", $this->old_content);
        $new_content_lines = explode("\n", $this->new_content);
        $len1 = count($old_content_lines);
        $len2 = count($new_content_lines);

        $dp = array_fill(0, $len1 + 1, array_fill(0, $len2 + 1, 0));

        for ($i = 1; $i <= $len1; $i++) {
            for ($j = 1; $j <= $len2; $j++) {
                if ($old_content_lines[$i - 1] === $new_content_lines[$j - 1]) {
                    $dp[$i][$j] = $dp[$i - 1][$j - 1] + 1;
                } else {
                    $dp[$i][$j] = max($dp[$i - 1][$j], $dp[$i][$j - 1]);
                }
            }
        }

        $lcs = [];
        $i = $len1;
        $j = $len2;

        while ($i > 0 && $j > 0) {
            if ($old_content_lines[$i - 1] === $new_content_lines[$j - 1]) {
                $lcs[] = $old_content_lines[$i - 1];
                $i--;
                $j--;
            } elseif ($dp[$i - 1][$j] >= $dp[$i][$j - 1]) {
                $i--;
            } else {
                $j--;
            }
        }
        return array_reverse($lcs);
    }
}
