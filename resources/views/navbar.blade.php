<nav class="navbar">
    <div class="menu-icon" onclick="toggleMenu()">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
    </div>
    <div class="links">
        <li><a href="{{ route('files') }}" class="{{ Request::is('files') ? 'active' : '' }}">Files</a></li>
        <li><a href="{{ route('changelogs') }}" class="{{ in_array(Route::currentRouteName(), ['changelogs', 'changelogs.view']) ? 'active' : '' }}">Changelogs</a></li>
        @if (Auth::user()->is_admin === 1)
            <li><a href="{{ route('users') }}" class="{{ in_array(Route::currentRouteName(), ['users', 'users.rules']) ? 'active' : '' }}">Users</a></li>
        @endif
    </div>
    <ul class="logout">
        <li><a href="{{ route('logout') }}">Logout</a></li>
    </ul>
</nav>

<script>
    function toggleMenu() {
        const navLinks = document.querySelector('.links');
        navLinks.classList.toggle('active');
    }
</script>
