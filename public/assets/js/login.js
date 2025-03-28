const btnloader = document.querySelector('.btn-loader');
let error_count = 0;

window.addEventListener('submit', (e) => {
    e.preventDefault();
    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;
    attemptLogin(username, password);
})


async function attemptLogin(name, pass) {

    btnloader.style.display = 'inline-block';
    let response = await fetch('/authenticate', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({username: name, password: pass})
    });

    let data = await response.json();

    if (response.status === 200) {
        btnloader.style = '';
        window.location.href = "/files";
        return;
    }

    if (response.status === 400) {
        btnloader.style = '';
        displayError(data.error, error_count);
    }

}

function displayError(error, error_number) {
    error_count++;
    document.querySelector(".errors").insertAdjacentHTML('beforeend', `<div class="error-box" style="border-color: #ff5046" id="${error_number}"><p><img src="/assets/icons/error.svg">&nbsp;&nbsp;${error}</p></div>`);
    setTimeout(function () {
        document.getElementById(error_number).remove()
    }, 10000);
}
