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

async function addUser(usernameparam, passwordparam, is_adminparam, group_nameparam, button) {
    button.querySelector('.btn-loader').style.display = 'inline-block';
    let response = await fetch('/users/create', {
        method: 'POST',
        headers: {
            "Content-Type" : 'application/json',
            "X-CSRF-TOKEN" : document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({username: usernameparam, password: passwordparam, is_admin: is_adminparam, group_name: group_nameparam})
    });
    button.querySelector('.btn-loader').style.display = 'none';
    if (handleStatus(await response.json())) {
        closeModal();
        await loadUsers();
    }
}

async function editUser(usernameparam, passwordparam, is_adminparam, useridparam, group_nameparam, button) {
    button.querySelector('.btn-loader').style.display = 'inline-block';
    let response = await fetch('/users/update', {
        method: 'POST',
        headers: {
            "Content-Type" : 'application/json',
            "X-CSRF-TOKEN" : document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({username: usernameparam, password: passwordparam, is_admin: is_adminparam, userid: useridparam, group_name: group_nameparam})
    });
    button.querySelector('.btn-loader').style.display = 'none';
    if (handleStatus(await response.json())) {
        closeModal();
        await loadUsers();
    }
}

async function fetchGroupName(group_idparam){
    let response = await fetch('/groups', {
        method: 'POST',
        headers: {
            "Content-Type" : 'application/json',
            "X-CSRF-TOKEN" : document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({group_id: group_idparam})
    });
    let data = await response.json();
    return data.group_name;
}

async function deleteUser(userid, button) {
    button.querySelector('.btn-loader').style.display = 'inline-block';
    let response = await fetch('/users/delete', {
        method: 'POST',
        headers: {
            "Content-Type" : 'application/json',
            "X-CSRF-TOKEN" : document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({user_id: userid})
    });
    button.querySelector('.btn-loader').style.display = 'none';
    if (handleStatus(await response.json())) {
        closeModal();
        await loadUsers();
    }
}
