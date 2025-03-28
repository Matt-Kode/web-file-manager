<?php
namespace App\Helpers;
class Diff
{

    private $old_content;
    private $new_content;

    function __construct($old_content, $new_content)
    {
        $this->old_content = $old_content;
        $this->new_content = $new_content;
    }

    public function run()
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
        $diff['all_lines'] = implode("\n", $diff['all_lines']);
        return $diff;
    }

    public function patch()
    {

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
