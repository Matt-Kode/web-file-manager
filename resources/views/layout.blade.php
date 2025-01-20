<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link href="/assets/css/layout.css" rel="stylesheet">
    <link href="/assets/css/navbar.css" rel="stylesheet">
    @stack('styles')
    <title>@yield('title')</title>
</head>
<body>
<div class="notifications"></div>
<div class="modal-bg">
    <div class="modal"></div>
</div>
@include('navbar')
@yield('content')
</body>
@stack('scripts')
<script>
    const modalbg = document.querySelector(".modal-bg");
    const modal = document.querySelector(".modal");
    const body = document.querySelector("body");
    let notification_count = 0;

    function openModal(content) {
        modal.innerHTML = content;
        body.style.overflow = 'hidden'
        modalbg.style.display = 'flex'

    }
    function closeModal() {
        modalbg.style.display = 'none';
        body.style.overflow = 'scroll';
        modal.innerHTML = '';
    }

    function displayNotification(notification, type) {
        let notification_number = notification_count;
        notification_count++;
        if (type === 'error') {
            document.querySelector(".notifications").insertAdjacentHTML('beforeend', `<div class="notification-box" style="background-color: #ff5046" id="${notification_number}"><p><img src="/assets/icons/error.svg">&nbsp;&nbsp;${notification}</p></div>`);
            setTimeout(function () {
                document.getElementById(notification_number).remove()
            }, 10000);
        }
        if (type === 'success') {
            document.querySelector(".notifications").insertAdjacentHTML('beforeend', `<div class="notification-box" style="background-color: #5bc25b" id="${notification_number}"><p><img src="/assets/icons/success.svg">&nbsp;&nbsp;${notification}</p></div>`);
            setTimeout(function () {
                document.getElementById(notification_number).remove()
            }, 10000);
        }
    }
</script>
</html>
