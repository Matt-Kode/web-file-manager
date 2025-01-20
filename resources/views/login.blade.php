<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link href="/assets/css/login.css" rel="stylesheet">
    <title>Login</title>
</head>
<body>
<div class="errors"></div>
<div class="login-container">
    <form class="login-form">
        <h1>Login</h1>
        <div class="input-group">
            <label for="username">USERNAME</label>
            <input type="text" id="username" name="username">
        </div>

        <div class="input-group">
            <label for="password">PASSWORD</label>
            <input type="password" id="password" name="password">
        </div>

        <button type="submit" class="submit-btn">Login</button>
    </form>
</div>
<script src="/assets/js/login.js"></script>
</body>
</html>
