@extends('layout')
@push('styles')
    <link href="/assets/css/changelogs.css" rel="stylesheet">
    <link href="/assets/css/editor.css" rel="stylesheet">
@endpush
@push('scripts')
    <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/ace.js" type="text/javascript"></script>
    <script src="/assets/js/changelogs/changelogs-functions.js"></script>
    <script src="/assets/js/changelogs/changelogs-remote.js"></script>
    <script src="/assets/js/changelogs/changelogs-events.js"></script>
@endpush
@section('title', 'Changelog')
@section('content')
<div class="editor-container">
    <div class="editor-options"></div>
    <div id="editor"></div>
</div>
<div class="changelogs-container">
    <div class="loader"><span class="spinner"></span></div>
    <div class="changelogs"></div>
</div>
@endsection
