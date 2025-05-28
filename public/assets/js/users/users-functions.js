const userscontatiner = document.querySelector('.users');
let rootuser = false;
async function loadUsers() {
    userscontatiner.innerHTML = '';
    let data = await fetchUsers();
    rootuser = data.user_id === 1;
    for (let user of data.users) {
        userscontatiner.insertAdjacentHTML('beforeend', `
        <div class="user">
            <span>${user.username}&nbsp;${user.is_admin === 1 ? '(admin)' : ''}</span>
                ${(data.user_id !== 1 && data.user_id !== user.id && user.is_admin === 1) ? `` :`
                <span class="actions">
                    <button class="edit" onclick="openEditUserModal('${user.username}', ${user.is_admin}, ${user.id})">Edit</button>
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
            ${!rootuser ? `` : `
            <div class="checkbox">
                <input id="admin" type="checkbox">
                <label for="admin">Admin</label>
            </div>`}
            <div class="buttons">
                <button class="cancel-btn" type="button" onclick="closeModal()">Cancel</button>
                ${!rootuser ? `<button class="submit-btn" type="submit" onclick="addUser(document.querySelector('input[name=username]').value, document.querySelector('input[name=password]').value, 0)">Save</button>` : `<button class="submit-btn" type="submit" onclick="addUser(document.querySelector('input[name=username]').value, document.querySelector('input[name=password]').value, document.getElementById('admin').checked)">Save</button>`}
            </div>
    `);
}

function openEditUserModal(username, is_admin, userid) {
    openModal(`
            <h1>Edit user</h1>
            <input type="text" name="username" value="${username}" placeholder="Username">
            <input type="password" name="password" placeholder="Password">
            ${(!rootuser || userid === 1) ? `` : `
            <div class="checkbox">
                ${is_admin === 1 ? `<input id="admin" type="checkbox" checked>` : `<input id="admin" type="checkbox">`}
                <label for="admin">Admin</label>
            </div>`}
            <div class="buttons">
                <button class="cancel-btn" type="button" onclick="closeModal()">Cancel</button>
                ${!rootuser ? `<button class="submit-btn" type="submit" onclick="editUser(document.querySelector('input[name=username]').value, document.querySelector('input[name=password]').value, ${is_admin}, ${userid})">Save</button>` : `<button class="submit-btn" type="submit" onclick="editUser(document.querySelector('input[name=username]').value, document.querySelector('input[name=password]').value, document.getElementById('admin').checked, ${userid})">Save</button>`}
            </div>
    `);
}
