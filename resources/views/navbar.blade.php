<nav class="navbar">
    <div class="menu-icon" onclick="toggleMenu()">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
    </div>
    <div class="links">
        <li><a href="{{ route('files') }}" class="{{ Request::is('files') ? 'active' : '' }}">Files</a></li>
        <li><a href="#" class="{{ Request::is('changelog.blade.php') ? 'active' : '' }}">Changelog</a></li>
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
