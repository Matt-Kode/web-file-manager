const rulescontainer = document.querySelector('.rules');
async function loadRules(){
    rulescontainer.innerHTML = '';
    let rules = await fetchRules();
    if (rules.length === 0) {
        rulescontainer.insertAdjacentHTML('beforeend', `<div class="no-rules"><p>This user has no rules</p></div>`);
    }
    for (let rule of rules) {
        rulescontainer.insertAdjacentHTML('beforeend', `
        <div class="rule">
            <span>
                <div class="desc">${rule.filepath}</div>
                <button class="details-btn" onclick="openRuleInfoModal(${rule.priority}, ${rule.view}, ${rule.edit}, ${rule.create}, ${rule.rename}, ${rule.download}, ${rule.upload}, ${rule.delete})">Details</button>
            </span>
            <span class="actions">
                <button class="edit" onclick="openRuleEditModal()">Edit</button>
                <button class="delete" onclick="openDeleteRuleModal()">Delete</button>
            </span>
        </div>`);
    }
}

function openRuleInfoModal(priority, view, edit, create, rename, download, upload, del) {
    openModal(`
    <h1>Rule Info</h1>
    <div class="info">
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
        <button class="cancel-btn" onclick="closeModal()">Cancel</button>
    </div>

    `);
}

function openAddRuleModal() {
    openModal(`
            <h1>New Rule</h1>
            <input type="text" name="username" placeholder="Username">
            <input type="password" name="password" placeholder="Password">
            <div class="checkbox">
                <input id="admin" type="checkbox">
                <label for="admin">Admin</label>
            </div>
            <div class="buttons">
                <button class="submit-btn" type="submit" onclick="addUser(document.querySelector('input[name=username]').value, document.querySelector('input[name=password]').value, document.getElementById('admin').checked)">Save</button>
                <button class="cancel-btn" type="button" onclick="closeModal()">Cancel</button>
            </div>
    `);
}
