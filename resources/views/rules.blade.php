@extends('layout')
@push('styles')
    <link href="/assets/css/rules.css" rel="stylesheet">
@endpush
@push('scripts')
    <script src="/assets/js/users/users-functions.js"></script>
    <script src="/assets/js/users/users-remote.js"></script>
    <script src="/assets/js/users/users-events.js"></script>
@endpush
@section('title', 'Files')
@section('content')
    <div class="rules-container">
        <div class="options"><button onclick="openAddRuleModal()">Add Rule</button></div>
        <div class="rules"></div>
    </div>
@endsection
