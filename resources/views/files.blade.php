@extends('layout')
@push('styles')
    <link href="/assets/css/files.css" rel="stylesheet">
@endpush
@push('scripts')
    <script src="/assets/js/files/files-functions.js"></script>
    <script src="/assets/js/files/files-remote.js"></script>
    <script src="/assets/js/files/files-events.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/ace.js" type="text/javascript"></script>
@endpush
@section('title', 'Files')
@section('content')
    <input type="file" class="file-input" multiple style="display: none;">
    <input type="file" class="folder-input" webkitdirectory multiple style="display: none;">
    <div class="checked-options"><button onclick="initDownload()">Download</button><button onclick="openDeleteModal()">Delete</button></div>
    <div class="uploads-container"><h1>Uploading</h1><p></p><div class="progress-bar-container"><div class="progress-bar"></div></div></div>
    <div class="context-menu" data-filepath="">
        <button onclick="openRenameModal(this.parentElement.getAttribute('data-filepath'))">Rename</button>
        <button onclick="openDeleteModal(this.parentElement.getAttribute('data-filepath'))">Delete</button>
        <button onclick="initDownload(this.parentElement.getAttribute('data-filepath'))">Download</button>
    </div>
    <div class="editor-container"></div>
    <div class="editor-options"></div>
    <div class="files-container">
        <div class="options">
            <div class="file-path"></div>
            <div class="actions"></div>
        </div>
        <table class="file-table">
            <tbody class="table-body">
            </tbody>
        </table>
    </div>
@endsection
