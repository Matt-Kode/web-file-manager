@extends('layout')
@push('styles')
    <link href="/assets/css/rules.css" rel="stylesheet">
@endpush
@push('scripts')
    <script src="/assets/js/rules/rules-functions.js"></script>
    <script src="/assets/js/rules/rules-remote.js"></script>
    <script src="/assets/js/rules/rules-events.js"></script>
@endpush
@section('title', 'Rules')
@section('content')
    <div class="rules-container">
        <div class="options"><button onclick="openAddRuleModal()">Add Rule</button></div>
        <div class="rules"></div>
    </div>
@endsection
