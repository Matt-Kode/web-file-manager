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
        Schema::create('rules', function (Blueprint $table) {
            $table->integer('user_id');
            $table->string('filepath');
            $table->integer('view');
            $table->integer('create');
            $table->integer('rename');
            $table->integer('edit');
            $table->integer('delete');
            $table->integer('download');
            $table->integer('upload');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
