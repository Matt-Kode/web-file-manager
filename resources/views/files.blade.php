@extends('layout')
@push('styles')
    <link href="/assets/css/files.css" rel="stylesheet">
    <link href="/assets/css/editor.css" rel="stylesheet">
@endpush
@push('scripts')
    <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/ace.js" type="text/javascript"></script>
    <script src="/assets/js/files/files-functions.js"></script>
    <script src="/assets/js/files/files-remote.js"></script>
    <script src="/assets/js/files/files-events.js"></script>
@endpush
@section('title', 'Files')
@section('content')
    <input type="file" class="file-input" multiple style="display: none;">
    <input type="file" class="folder-input" webkitdirectory multiple style="display: none;">
    <div class="checked-options"><button onclick="initDownload('', this)"><span>Download</span><span class="btn-loader"></span></button><button onclick="openDeleteModal()"><span>Delete</span></button></div>
    <div class="uploads-container"><h1>Uploading</h1><p></p><div class="progress-bar-container"><div class="progress-bar"></div></div></div>
    <div class="context-menu" data-filepath="">
        <button class="reg-btn" onclick="openRenameModal(this.parentElement.getAttribute('data-filepath'), this.parentElement.getAttribute('data-filepath').split('/').splice(-1)[0])">Rename</button>
        <button class="reg-btn" onclick="initDownload(this.parentElement.getAttribute('data-filepath'))">Download</button>
        <button class="delete-btn" onclick="openDeleteModal(this.parentElement.getAttribute('data-filepath'))">Delete</button>
    </div>
    <div class="editor-container">
        <div class="editor-options"></div>
        <div id="editor"></div>
    </div>
    <div class="files-container">
        <div class="options">
            <div class="file-path"></div>
            <div class="actions"></div>
        </div>
        <div class="loader"><span class="spinner"></span></div>
        <table class="file-table">
            <tbody class="table-body">
            </tbody>
        </table>
    </div>
@endsection
