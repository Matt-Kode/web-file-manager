<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('changelogs', function (Blueprint $table) {
            $table->id()->unique();
            $table->string('action');
            $table->string('filepath');
            $table->integer('done_by');
            $table->string('done_at');
            $table->integer('approved');
            $table->integer('reviewed_by')->nullable();
            $table->longText('new_content')->nullable();
            $table->longText('old_content')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('changelogs');
    }
};
