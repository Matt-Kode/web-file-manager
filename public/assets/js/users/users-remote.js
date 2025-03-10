async function fetchUsers() {
    let response = await fetch('/users', {
        method: 'POST',
        headers: {
            "Content-Type" : 'application/json',
            "X-CSRF-TOKEN" : document.querySelector('meta[name="csrf-token"]').content
        }
    });
    return await response.json();
}

async function addUser(usernameparam, passwordparam, is_adminparam) {
    let response = await fetch('/users/add', {
        method: 'POST',
        headers: {
            "Content-Type" : 'application/json',
            "X-CSRF-TOKEN" : document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({username: usernameparam, password: passwordparam, is_admin: is_adminparam})
    });
    if (handleStatus(await response.json())) {
        closeModal();
        await loadUsers();
    }
}

async function editUser(usernameparam, passwordparam, is_adminparam, useridparam) {
    let response = await fetch('/users/update', {
        method: 'POST',
        headers: {
            "Content-Type" : 'application/json',
            "X-CSRF-TOKEN" : document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({username: usernameparam, password: passwordparam, is_admin: is_adminparam, userid: useridparam})
    });
    if (handleStatus(await response.json())) {
        closeModal();
        await loadUsers();
    }
}
