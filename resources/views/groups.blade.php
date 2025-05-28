@extends('layout')
@push('styles')
    <link href="/assets/css/groups.css" rel="stylesheet">
@endpush
@push('scripts')
    <script src="/assets/js/rules/groups-functions.js"></script>
    <script src="/assets/js/rules/groups-remote.js"></script>
    <script src="/assets/js/rules/groups-events.js"></script>
@endpush
@section('title', 'Rules')
@section('content')
    <div class="groups-container">
        <div class="options"><button onclick="openAddGroupModal()">Add Group</button></div>
        <div class="loader"><span class="spinner"></span></div>
        <div class="groups"></div>
    </div>
@endsection
