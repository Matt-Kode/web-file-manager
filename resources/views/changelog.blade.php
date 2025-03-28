@extends('layout')
@push('styles')
    <link href="/assets/css/changelog.css" rel="stylesheet">
@endpush
@push('scripts')
    <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/ace.js" type="text/javascript"></script>
    <script src="/assets/js/changelog.js"></script>
@endpush
@section('title', 'Changelog')
@section('content')
    <div class="options">
    </div>
    <div class="container">
        <div id="editor"></div>
    </div>
@endsection
