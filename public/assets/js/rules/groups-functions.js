const groupscontainer = document.querySelector('.groups');
const groupsloader = document.querySelector('.loader');
async function loadGroups(){
    groupscontainer.innerHTML = '';
    groupsloader.style.display = 'flex';
    let groups = await fetchGroups();
    groupsloader.style.display = 'none';
    if (groups.length === 0) {
        groupscontainer.insertAdjacentHTML('beforeend', `<div class="no-groups"><p>No groups found</p></div>`);
    }
    for (let group of groups) {
        groupscontainer.insertAdjacentHTML('beforeend', `
        <div class="group-container">
            <div class="group">
                <span class="name-expand">
                    <button id="expand-btn" onclick="toggleRules(this, ${group.id})"><img src="/assets/icons/down-arrow.svg"></button>
                    <span class="name">${group.name}</span>
                </span>
                ${!group.discord_role_id ? `` : `<span class="discord_role_id">${group.discord_role_id}</span>`}
                <span class="actions">
                    <button onclick="openEditGroupModal(${group.id}, '${group.name}', '${!group.discord_role_id ? `` : `${group.discord_role_id}`}')">Edit</button>
                    <button onclick="openAddRuleModal(this.parentElement.parentElement.parentElement, ${group.id})">Add Rule</button>
                    <button id="delete-btn" onclick="openDeleteGroupModal(${group.id})">Delete</button>
                </span>
            </div>
            <div class="rules">
            </div>
        </div>`);
    }
}
function openRuleInfoModal(filepath, priority, view, edit, create, rename, download, upload, del) {
    openModal(`
    <h1>Rule Info</h1>
    <div class="info">
        <p>Filepath: ${filepath}</p>
        <p>Priority: ${priority}</p>
        <p>View: ${view ? `<span style="color:#5bc25b">True</span>`: `<span style="color:#ff5046">False</span>`}</p>
        <p>Edit: ${edit ? `<span style="color:#5bc25b">True</span>`: `<span style="color:#ff5046">False</span>`}</p>
        <p>Create: ${create ? `<span style="color:#5bc25b">True</span>`: `<span style="color:#ff5046">False</span>`}</p>
        <p>Rename: ${rename ? `<span style="color:#5bc25b">True</span>`: `<span style="color:#ff5046">False</span>`}</p>
        <p>Download: ${download ? `<span style="color:#5bc25b">True</span>`: `<span style="color:#ff5046">False</span>`}</p>
        <p>Upload: ${upload ? `<span style="color:#5bc25b">True</span>`: `<span style="color:#ff5046">False</span>`}</p>
        <p>Delete: ${del ? `<span style="color:#5bc25b">True</span>`: `<span style="color:#ff5046">False</span>`}</p>
    </div>
    <div class="buttons">
        <button class="cancel-btn" onclick="closeModal()">Close</button>
    </div>
    `);
}

function openAddGroupModal() {
    openModal(`
        <form>
            <h1>New Group</h1>
            <input type="text" name="name" placeholder="Group name">
            <input type="text" name="discord_role_id" placeholder="Role id (optional)">
            <div class="buttons">
                <button class="cancel-btn" type="button" onclick="closeModal()">Cancel</button>
                <button class="submit-btn" type="submit" onclick="addGroup(document.querySelector('input[name=name]').value, document.querySelector('input[name=discord_role_id]').value,this)"><span>Add</span><span class="btn-loader"></span></button>
            </div>
        </form>
    `);
}

function openAddRuleModal(groupelement, groupid) {
    openModal(`
        <form>
            <h1>New Rule</h1>
            <input type="text" name="filepath" placeholder="Filepath">
            <input type="text" name="priority" placeholder="Priority">
            <div class="checkbox">
                <input id="view" type="checkbox" checked>
                <label for="view">View</label>
            </div>
            <div class="checkbox">
                <input id="edit" type="checkbox" checked>
                <label for="edit">Edit</label>
            </div>
            <div class="checkbox">
                <input id="create" type="checkbox" checked>
                <label for="create">Create</label>
            </div>
            <div class="checkbox">
                <input id="rename" type="checkbox" checked>
                <label for="rename">Rename</label>
            </div>
            <div class="checkbox">
                <input id="download" type="checkbox" checked>
                <label for="download">Download</label>
            </div>
            <div class="checkbox">
                <input id="upload" type="checkbox" checked>
                <label for="upload">Upload</label>
            </div>
            <div class="checkbox">
                <input id="delete" type="checkbox" checked>
                <label for="delete">Delete</label>
            </div>
            <div class="buttons">
                <button class="cancel-btn" type="button" onclick="closeModal()">Cancel</button>
                <button class="submit-btn" type="submit">Add<span class="btn-loader"></span></button>
            </div>
        </form>
    `);

    document.querySelector('.submit-btn').onclick = (e) => {
        addRule(groupelement,
        groupid,
        document.querySelector('input[name=filepath]').value,
            document.querySelector('input[name=priority]').value,
            Number(document.getElementById('view').checked),
            Number(document.getElementById('edit').checked),
            Number(document.getElementById('create').checked),
            Number(document.getElementById('rename').checked),
            Number(document.getElementById('download').checked),
            Number(document.getElementById('upload').checked),
            Number(document.getElementById('delete').checked),
            e.target);
    }
}

function openEditGroupModal(id, name, discord_role_id) {
    openModal(`
        <form>
            <h1>Edit Group</h1>
            <input type="text" name="name" placeholder="Group name" value="${name}">
            <input type="text" name="discord_role_id" placeholder="Discord Role id (optional)" value="${discord_role_id}">
            <div class="buttons">
                <button class="cancel-btn" type="button" onclick="closeModal()">Cancel</button>
                <button class="submit-btn" type="submit" onclick="editGroup(${id}, document.querySelector('input[name=name]').value, document.querySelector('input[name=discord_role_id]').value, this)"><span>Save</span><span class="btn-loader"></span></button>
            </div>
        </form>
    `);
}

async function loadRules(groupelement, groupid) {
    let rulescontainer = groupelement.querySelector('.rules');
    rulescontainer.innerHTML = `<div class="loader" style="display: flex"><div class="spinner"></div></div>`;
    let rules = await fetchRules(groupid);
    rulescontainer.innerHTML = ``;
    if (rules.length === 0) {
        rulescontainer.innerHTML = `<div class="no-rules">No rules found</div>`
    }
    for (let rule of rules) {
        rulescontainer.insertAdjacentHTML('beforeend',  `
        <div class="rule">
            <span class="info"  onclick="openRuleInfoModal('${rule.filepath}', ${rule.priority}, ${rule.view}, ${rule.edit}, ${rule.create}, ${rule.rename}, ${rule.download}, ${rule.upload}, ${rule.delete})">
                <span class="priority">${rule.priority}</span>
                <span class="file-path">${rule.filepath}</span>
            </span>
            <span class="actions">
                <button onclick="openRuleEditModal(${rule.id}, this.parentElement.parentElement.parentElement.parentElement, ${rule.group_id}, '${rule.filepath}', ${rule.priority}, ${rule.view}, ${rule.edit}, ${rule.create}, ${rule.rename}, ${rule.download}, ${rule.upload}, ${rule.delete})">Edit</button>
                <button id="delete-btn" onclick="openDeleteRuleModal(${rule.id}, this.parentElement.parentElement.parentElement.parentElement, ${rule.group_id})">Delete</button>
            </span>
        </div>`);
    }
}
async function toggleRules(button, groupid) {
    let groupelement = button.parentElement.parentElement.parentElement;
    groupelement.classList.toggle('expand');
    if (groupelement.matches('.expand')) {
        await loadRules(groupelement, groupid);
    }
}

function openRuleEditModal(ruleid, groupelement, groupid, filepath, priority, view, edit, create, rename, download, upload, del) {
    openModal(`
        <form>
            <h1>Edit Rule</h1>
            <input type="text" name="filepath" value="${filepath}" placeholder="Filepath">
            <input type="text" name="priority" value="${priority}" placeholder="Priority">
            <div class="checkbox">
                <input id="view" type="checkbox" ${view === 1 ? `checked` : ``}>
                <label for="view">View</label>
            </div>
            <div class="checkbox">
                <input id="edit" type="checkbox" ${edit === 1 ? `checked` : ``}>
                <label for="edit">Edit</label>
            </div>
            <div class="checkbox">
                <input id="create" type="checkbox" ${create === 1 ? `checked` : ``}>
                <label for="create">Create</label>
            </div>
            <div class="checkbox">
                <input id="rename" type="checkbox" ${rename === 1 ? `checked` : ``}>
                <label for="rename">Rename</label>
            </div>
            <div class="checkbox">
                <input id="download" type="checkbox" ${download === 1 ? `checked` : ``}>
                <label for="download">Download</label>
            </div>
            <div class="checkbox">
                <input id="upload" type="checkbox" ${upload === 1 ? `checked` : ``}>
                <label for="upload">Upload</label>
            </div>
            <div class="checkbox">
                <input id="delete" type="checkbox" ${del === 1 ? `checked` : ``}>
                <label for="delete">Delete</label>
            </div>
            <div class="buttons">
                <button class="cancel-btn" type="button" onclick="closeModal()">Cancel</button>
                <button class="submit-btn" type="submit">Save<span class="btn-loader"></span></button>
            </div>
        </form>
    `);

    document.querySelector('.submit-btn').onclick = (e) => {
        editRule(ruleid, groupelement, groupid,
            document.querySelector('input[name=filepath]').value,
            document.querySelector('input[name=priority]').value,
            Number(document.getElementById('view').checked),
            Number(document.getElementById('edit').checked),
            Number(document.getElementById('create').checked),
            Number(document.getElementById('rename').checked),
            Number(document.getElementById('download').checked),
            Number(document.getElementById('upload').checked),
            Number(document.getElementById('delete').checked),
            e.target);
    }
}


function openDeleteGroupModal(groupid) {
    openModal(`
        <h1>Delete Group</h1>
        <p>Are you sure you want to delete this group?</p>
        <div class="buttons">
            <button class="cancel-btn" onclick="closeModal()">Cancel</button>
            <button class="submit-btn" onclick="deleteGroup(${groupid}, this)"><span>Delete</span><span class="btn-loader"></span></button>
        </div>
    `)
}

function openDeleteRuleModal(ruleid, groupelement, groupid) {
    openModal(`
        <h1>Delete Rule</h1>
        <p>Are you sure you want to delete this rule?</p>
        <div class="buttons">
            <button class="cancel-btn" onclick="closeModal()">Cancel</button>
            <button class="submit-btn">Delete<span class="btn-loader"></span></button>
        </div>
    `)

    document.querySelector('.submit-btn').onclick = (e) => {
        deleteRule(ruleid, groupelement, groupid, e.target);
    }
}
