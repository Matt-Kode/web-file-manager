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
<script>
    const modalbg = document.querySelector(".modal-bg");
    const modal = document.querySelector(".modal");
    const body = document.querySelector("body");
    let notificationcount = 0;

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
        let notificationid = notificationcount;
        notificationcount++;
        if (type === 'error') {
            document.querySelector(".notifications").insertAdjacentHTML('beforeend', `<div class="notification-box" style="background-color: #ff5046" id="notification_${notificationid}"><p><img src="/assets/icons/error.svg">&nbsp;&nbsp;${notification}</p></div>`);
            setTimeout(function () {
                document.getElementById("notification_" + notificationid).remove()
            }, 10000);
        }
        if (type === 'success') {
            document.querySelector(".notifications").insertAdjacentHTML('beforeend', `<div class="notification-box" style="background-color: #5bc25b" id="notification_${notificationid}"><p><img src="/assets/icons/success.svg">&nbsp;&nbsp;${notification}</p></div>`);
            setTimeout(function () {
                document.getElementById("notification_" + notificationid).remove()
            }, 10000);
        }

    }
    function toggleContextMenu(posx, posy, filepath) {
        let contextmenu = document.querySelector(".context-menu");
        if (filepath) {
            contextmenu.setAttribute("data-filepath", filepath);
        }
        contextmenu.classList.toggle('show');
        contextmenu.style.top = posy + 'px';
        contextmenu.style.left = posx + 'px';
    }

    function closeContextMenu() {
        document.querySelectorAll('.context-menu').forEach(function(menu) {
            if (menu.classList.contains('show')) {
                menu.classList.remove('show');
            }
        })
    }

    function handleStatus(data, errorsonly = false) {
        if (data.type === 'error') {
            displayNotification(data.content, 'error');
            return false;
        }
        if (!errorsonly) {
            if (data.type === 'success') {
                displayNotification(data.content, 'success');
                return true;
            }
        }
        return true;
    }
</script>
@stack('scripts')
</html>
