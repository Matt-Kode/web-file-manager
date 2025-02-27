<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\FileController;
use App\Http\Middleware\AuthUser;
use App\Http\Middleware\AuthUserApi;
use App\Http\Middleware\VerifyCsrf;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/login', function () {
    if (Auth::check()) {
        return redirect()->route('files');
    }
    return view('login');
})->name('login');

Route::get('/logout', [AuthController::class, 'logout'])->name('logout');

Route::get('/', function () {return redirect()->route('files');});

Route::post('/authenticate', [AuthController::class, 'authenticate'])->name('authenticate');

Route::get('/files', function () {return view('files');})->middleware(AuthUser::class)->name('files');

Route::group(['prefix' => '/api', 'middleware' => [AuthUserApi::class, VerifyCsrf::class]], function() {
   Route::post('/get', [FileController::class, 'get'])->name('file.get');
   Route::post('/upload', [FileController::class, 'upload'])->name('file.upload');
    Route::post('/download', [FileController::class, 'download'])->name('file.download');
   Route::post('/delete', [FileController::class, 'delete'])->name('file.delete');
   Route::post('/put', [FileController::class, 'put'])->name('file.put');
   Route::post('/rename', [FileController::class, 'rename'])->name('file.rename');
    Route::post('/create', [FileController::class, 'create'])->name('file.create');
});
