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
            <input type="text" id="username" name="username" placeholder="Username">
        </div>

        <div class="input-group">
            <input type="password" id="password" name="password" placeholder="Password">
        </div>

        <button type="submit" class="submit-btn"><span>Login</span><span class="btn-loader"></span></button>
    </form>
</div>
<script>
    function disableButtons(bool) {
        let buttons = document.querySelectorAll('button');
        if (!bool) {
            for (let btn of buttons) {
                btn.disabled = false;
            }
        } else {
            for (let btn of buttons) {
                btn.disabled = true;
            }
        }
    }
</script>
<script src="/assets/js/login.js"></script>
</body>
</html>
