@extends('layout')
@push('styles')
    <link href="/assets/css/users.css" rel="stylesheet">
@endpush
@push('scripts')
    <script src="/assets/js/users/users-functions.js"></script>
    <script src="/assets/js/users/users-remote.js"></script>
    <script src="/assets/js/users/users-events.js"></script>
@endpush
@section('title', 'Users')
@section('content')
    <div class="users-container">
    <div class="options"><button onclick="openAddUserModal()">Add User</button></div>
    <div class="users"></div>
</div>
@endsection
