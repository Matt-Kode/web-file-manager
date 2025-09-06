const userscontatiner = document.querySelector('.users');
let rootuser = false;
async function loadUsers() {
    userscontatiner.innerHTML = `<div class="loader" style="display: flex"><div class="spinner"></div></div>`;
    let data = await fetchUsers();
    userscontatiner.innerHTML = ``;
    rootuser = data.user_id === 1;
    for (let user of data.users) {
        userscontatiner.insertAdjacentHTML('beforeend', `
        <div class="user">
            <span>${user.username}&nbsp;${user.is_admin === 1 ? '(admin)' : ''}</span>
                ${(data.user_id !== 1 && data.user_id !== user.id && user.is_admin === 1) ? `` :`
                <span class="actions">
                    <button class="edit" onclick="openEditUserModal('${user.username}', ${user.is_admin}, ${user.id}, ${user.group_id}, this)"><span>Edit</span><span class="btn-loader"></span></button>
                    ${user.id === 1 ? `` : `<button id="delete-btn" onclick="openDeleteUserModal(${user.id})">Delete</button>`}
                </span>`}
        </div>`);
    }
}

function openAddUserModal() {
    openModal(`
        <form>
            <h1>New user</h1>
            <input type="text" name="username" placeholder="Username">
            <input type="password" name="password" placeholder="Password">
            <input type="text" name="group-name" placeholder="Group name">
            ${!rootuser ? `` : `
            <div class="checkbox">
                <input id="admin" type="checkbox">
                <label for="admin">Admin</label>
            </div>`}
            <div class="buttons">
                <button class="cancel-btn" type="button" onclick="closeModal()">Cancel</button>
                ${!rootuser ? `<button class="submit-btn" type="submit" onclick="addUser(document.querySelector('input[name=username]').value, document.querySelector('input[name=password]').value, 0, document.querySelector('input[name=group-name]').value, this)"><span>Add</span><span class="btn-loader"></span></button>` : `<button class="submit-btn" type="submit" onclick="addUser(document.querySelector('input[name=username]').value, document.querySelector('input[name=password]').value, document.getElementById('admin').checked, document.querySelector('input[name=group-name]').value, this)"><span>Add</span><span class="btn-loader"></span></button>`}
            </div>
        </form>
    `);
}

async function openEditUserModal(username, is_admin, userid, group_id, button) {
    let loader = button.querySelector('.btn-loader');
    loader.style.display = 'inline-block';
    let group_name = await fetchGroupName(group_id);
    loader.style.display = 'none';
    openModal(`
        <form>
            <h1>Edit user</h1>
            <input type="text" name="username" value="${username}" placeholder="Username">
            <input type="password" name="password" placeholder="Password">
            <input type="text" name="group-name" value="${!group_name ? `` : group_name}" placeholder="Group name">
            ${(!rootuser || userid === 1) ? `` : `
            <div class="checkbox">
                ${is_admin === 1 ? `<input id="admin" type="checkbox" checked>` : `<input id="admin" type="checkbox">`}
                <label for="admin">Admin</label>
            </div>`}
            <div class="buttons">
                <button class="cancel-btn" type="button" onclick="closeModal()">Cancel</button>
                ${!rootuser || userid === 1 ? `<button class="submit-btn" type="submit" onclick="editUser(document.querySelector('input[name=username]').value, document.querySelector('input[name=password]').value, ${is_admin}, ${userid}, null, this)"><span>Save</span><span class="btn-loader"></span></button>` : `<button class="submit-btn" type="submit" onclick="editUser(document.querySelector('input[name=username]').value, document.querySelector('input[name=password]').value, document.getElementById('admin').checked, ${userid}, document.querySelector('input[name=group-name]').value, this)"><span>Save</span><span class="btn-loader"></span></button>`}
            </div>
        </form>
    `);
}

function openDeleteUserModal(userid) {
    openModal(`
        <h1>Delete User</h1>
        <p>Are you sure you want to delete this user?</p>
        <div class="buttons">
            <button class="cancel-btn" onclick="closeModal()">Cancel</button>
            <button class="submit-btn" onclick="deleteUser(${userid}, this)"><span>Delete</span><span class="btn-loader"></span></button>
        </div>
    `)
}
