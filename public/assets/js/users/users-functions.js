const userscontatiner = document.querySelector('.users');
async function loadUsers() {
    userscontatiner.innerHTML = '';
    let users = await fetchUsers();
    for (let user of users) {
        userscontatiner.insertAdjacentHTML('beforeend', `
        <div class="user">
            <span>${user.username}&nbsp;${user.is_admin === 1 ? '(admin)' : ''}</span>
                ${user.is_admin === 1 ? `` : `
                <span class="actions">
                    <button class="edit" onclick="openEditUserModal('${user.username}', ${user.is_admin}, ${user.id})">Edit</button>
                    <button class="rules" onclick="window.location.href = '/users/${user.id}/rules'" >Rules</button>
                    <button class="delete">Delete</button>
                </span>`}
        </div>`);
    }
}

function openAddUserModal() {
    openModal(`
            <h1>New user</h1>
            <input type="text" name="username" placeholder="Username">
            <input type="password" name="password" placeholder="Password">
            <div class="checkbox">
                <label for="admin">Admin</label>
                <input id="admin" type="checkbox">
            </div>
            <div class="buttons">
                <button class="submit-btn" type="submit" onclick="addUser(document.querySelector('input[name=username]').value, document.querySelector('input[name=password]').value, document.getElementById('admin').checked)">Save</button>
                <button class="cancel-btn" type="button" onclick="closeModal()">Cancel</button>
            </div>
    `);
}

function openEditUserModal(username, is_admin, userid) {
    openModal(`
            <h1>Edit user</h1>
            <input type="text" name="username" value="${username}" placeholder="Username">
            <input type="password" name="password" placeholder="Password">
            <div class="checkbox">
                <label for="admin">Admin</label>
                ${is_admin === 1 ? `<input id="admin" type="checkbox" checked>` : `<input id="admin" type="checkbox">`}
            </div>
            <div class="buttons">
                <button class="submit-btn" type="submit" onclick="editUser(document.querySelector('input[name=username]').value, document.querySelector('input[name=password]').value, document.getElementById('admin').checked, ${userid})">Save</button>
                <button class="cancel-btn" type="button" onclick="closeModal()">Cancel</button>
            </div>
    `);
}
