<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChangelogController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\GroupsController;
use App\Http\Controllers\RulesController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\AuthAdmin;
use App\Http\Middleware\AuthAdminRemote;
use App\Http\Middleware\AuthUser;
use App\Http\Middleware\AuthUserRemote;
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

Route::group(['prefix' => '/changelogs'], function () {
    Route::get('/', function () {return view('changelogs');})->middleware(AuthUser::class)->name('changelogs');
    Route::post('/', [ChangelogController::class, 'get'])->middleware(AuthUserRemote::class)->name('changelogs.get');
    Route::post('/{id}', [ChangelogController::class, 'getChangelogDiff'])->middleware(AuthUserRemote::class)->name('changelogs.get.diff');
    Route::post('/{id}/accept', [ChangelogController::class, 'acceptEdit'])->middleware(AuthUserRemote::class)->middleware(AuthAdminRemote::class)->name('changelogs.revertedit');
    Route::post('/{id}/reject', [ChangelogController::class, 'rejectEdit'])->middleware(AuthUserRemote::class)->middleware(AuthAdminRemote::class)->name('changelogs.revertdeletion');
    Route::post('/conflict/save', [ChangelogController::class, 'saveConflict'])->middleware(AuthUserRemote::class)->middleware(AuthAdminRemote::class)->name('changelogs.saveconflict');

});

Route::group(['prefix' => '/users'], function () {
    Route::get('/', function () {return view('users');})->middleware(AuthUser::class)->middleware(AuthAdmin::class)->name('users');
    Route::post('/', [UserController::class, 'get'])->middleware(AuthUserRemote::class)->middleware(AuthAdminRemote::class)->name('users.get');
    Route::post('/create', [UserController::class, 'create'])->middleware(AuthUserRemote::class)->middleware(AuthAdminRemote::class)->name('users.create');
    Route::post('/update', [UserController::class, 'update'])->middleware(AuthUserRemote::class)->middleware(AuthAdminRemote::class)->name('users.update');
    Route::post('/delete', [UserController::class, 'delete'])->middleware(AuthUserRemote::class)->middleware(AuthAdminRemote::class)->name('users.delete');
});

Route::group(['prefix' => '/groups'], function () {
    Route::get('/', function () {return view('groups');})->middleware(AuthUser::class)->middleware(AuthAdmin::class)->name('groups');
    Route::post('/', [GroupsController::class, 'get'])->middleware(AuthUserRemote::class)->middleware(AuthAdminRemote::class)->name('groups.get');
    Route::post('/update', [GroupsController::class, 'update'])->middleware(AuthUserRemote::class)->middleware(AuthAdminRemote::class)->name('groups.update');
    Route::post('/create', [GroupsController::class, 'create'])->middleware(AuthUserRemote::class)->middleware(AuthAdminRemote::class)->name('groups.create');
    Route::post('/delete', [GroupsController::class, 'delete'])->middleware(AuthUserRemote::class)->middleware(AuthAdminRemote::class)->name('groups.delete');
    Route::post('/rules', [RulesController::class, 'get'])->middleware(AuthUserRemote::class)->middleware(AuthAdminRemote::class)->name('groups.rules.get');
    Route::post('/rules/create', [RulesController::class, 'create'])->middleware(AuthUserRemote::class)->middleware(AuthAdminRemote::class)->name('groups.rules.create');
    Route::post('/rules/update', [RulesController::class, 'update'])->middleware(AuthUserRemote::class)->middleware(AuthAdminRemote::class)->name('groups.rules.update');
    Route::post('/rules/delete', [RulesController::class, 'delete'])->middleware(AuthUserRemote::class)->middleware(AuthAdminRemote::class)->name('groups.rules.delete');

});

Route::group(['prefix' => '/remote', 'middleware' => [AuthUserRemote::class, VerifyCsrf::class]], function() {
   Route::post('/get', [FileController::class, 'get'])->name('file.get');
   Route::post('/upload', [FileController::class, 'upload'])->name('file.upload');
    Route::post('/download', [FileController::class, 'download'])->name('file.download');
   Route::post('/delete', [FileController::class, 'delete'])->name('file.delete');
   Route::post('/put', [FileController::class, 'put'])->name('file.put');
   Route::post('/rename', [FileController::class, 'rename'])->name('file.rename');
    Route::post('/create', [FileController::class, 'create'])->name('file.create');
    Route::post('/move', [FileController::class, 'move'])->name('file.move');
});
