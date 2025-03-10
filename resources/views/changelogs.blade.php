@extends('layout')
@push('styles')
    <link href="/assets/css/changelogs.css" rel="stylesheet">
@endpush
@push('scripts')
    <script src="/assets/js/changelogs/changelogs-functions.js"></script>
    <script src="/assets/js/changelogs/changelogs-remote.js"></script>
    <script src="/assets/js/changelogs/changelogs-events.js"></script>
@endpush
@section('title', 'Changelog')
@section('content')
<div class="changelogs-container"></div>
@endsection
