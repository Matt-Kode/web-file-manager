<nav class="navbar">
    <div class="menu-icon" onclick="toggleMenu()">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
    </div>
    <div class="links">
        <li><a href="{{ route('files') }}" class="{{ Request::is('files') ? 'active' : '' }}">Files</a></li>
        <li><a href="{{ route('changelogs') }}" class="{{ Request::is('changelogs') ? 'active' : '' }}">Changelogs</a></li>
        @if (Auth::user()->is_admin === 1)
            <li><a href="{{ route('users') }}" class="{{ Request::is('users') ? 'active' : '' }}">Users</a></li>
            <li><a href="{{ route('groups') }}" class="{{ Request::is('groups') ? 'active' : '' }}">Groups</a></li>

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
