window.addEventListener('load', (event) => {
    loadFiles('/orion/plugins');
});

window.addEventListener('click', (event) => {
    if (!event.target.matches('.create-btn')) {
        let dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach(function(dropdown) {
            if (dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
            }
        });
    }
})
