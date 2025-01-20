@extends('layout')
@push('styles')
    <link href="/assets/css/files.css" rel="stylesheet">
@endpush
@push('scripts')
    <script src="/assets/js/files.js"></script>
    <script src="/assets/js/files-events.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/ace.js" type="text/javascript"></script>
@endpush
@section('title', 'Files')
@section('content')
    <div class="files-container">
        <div class="options">
            <div class="file-path"></div>
            <div class="actions"></div>
        </div>
        <table class="file-table">
            <tbody class="table-body">
            </tbody>
        </table>
        <div class="editor-container">
        </div>
    </div>
@endsection
