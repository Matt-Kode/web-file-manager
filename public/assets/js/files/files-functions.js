const table = document.querySelector('.table-body');
const filescontainer = document.querySelector('.files-container');
const filepathcontainer = document.querySelector('.file-path');
const actionscontainer = document.querySelector('.actions');
const optionscontainer = document.querySelector('.options');

const editor = ace.edit("editor");
editor.setTheme("ace/theme/twilight");

const editorcontainer = document.querySelector(".editor-container");
const fileinput = document.querySelector(".file-input");
const folderinput = document.querySelector(".folder-input");
const uploadcontainer = document.querySelector(".uploads-container");
const checkedoptions = document.querySelector(".checked-options");
const editoroptions = document.querySelector(".editor-options");
const fileloader = document.querySelector(".loader");


function setFilePath(filepath) {
    window.location.hash = filepath;
}
async function loadFiles() {
    closeEditor();
    let filepath = window.location.hash.slice(1).replaceAll('%20', ' ');
    table.innerHTML = '';
    checkedoptions.style.display = "none";
    fileloader.style.display = 'flex';
    let data = await fetchFiles(filepath);
    fileloader.style.display = 'none';
    if (data.type === 'dir' && data.content.length === 0) {
        loadActions(filepath);
        table.insertAdjacentHTML('beforeend', `<div class="empty-dir"><p>This directory is empty</p></div>`)
        filePathLoader(filepath);
        return;
    }

    if (data.type === 'dir') {
        loadActions(filepath);
        let content = data.content;
        for (let i = 0; i<content.length; i++) {
            if (content[i].type === 'dir') {
                table.insertAdjacentHTML('beforeend', `
                <tr data-filepath="${(filepath === '/' ? '' : filepath) + '/' + content[i].name}">
                    <td class="checkbox"><input type="checkbox" onchange="checkOptions(this)"></td>
                    <td class="name" onclick="setFilePath(this.parentElement.getAttribute('data-filepath'))"><img src="/assets/icons/directory.svg">&nbsp;&nbsp;<p>${content[i].name}</p></td>
                    <td class="size"></td>
                    <td class="menu"><button class="context-menu-btn"><img src="/assets/icons/menu.svg"></button></td>
                </tr>`);

            }
            if (content[i].type === 'file') {
                table.insertAdjacentHTML('beforeend', `
                <tr data-filepath="${(filepath === '/' ? '' : filepath) + '/' + content[i].name}">
                    <td class="checkbox"><input type="checkbox" onchange="checkOptions(this)"></td>
                    <td class="name" onclick="setFilePath(this.parentElement.getAttribute('data-filepath'))"><img src="/assets/icons/file.svg">&nbsp;&nbsp;<p>${content[i].name}</p></td>
                    <td class="size">${content[i].size}</td>
                    <td class="menu"><button class="context-menu-btn"><img src="/assets/icons/menu.svg"></button></td>
                </tr>`);
            }
            if (content[i].type === 'not_viewable') {
                table.insertAdjacentHTML('beforeend', `
                <tr data-filepath="${(filepath === '/' ? '' : filepath) + '/' + content[i].name}">
                    <td class="checkbox"><input type="checkbox" onchange="checkOptions(this)"></td>
                    <td class="name"><img src="/assets/icons/file.svg">&nbsp;&nbsp;<p>${content[i].name}</p></td>
                    <td class="size">${content[i].size}</td>
                    <td class="menu"><button class="context-menu-btn"><img src="/assets/icons/menu.svg"></button></td>
                </tr>`);
            }
        }
        filePathLoader(filepath);
        return;
    }
    if (data.type === 'file') {
        loadEditor(filepath, fileExtension(filepath.split('/').splice(-1)[0]), data.content);
        return;
    }
    if (data.type === 'not_viewable') {
        setFilePath(lastFolder(filepath));
        displayNotification('Cannot view that file', 'error')
        return;
    }
    if (data.type === 'no_permission') {
        loadActions(filepath);
        table.insertAdjacentHTML('beforeend', `<div class="empty-dir"><p>No permission to view</p></div>`)
        filePathLoader(filepath);
        return;
    }
    if (data.type === 'error') {
        displayNotification(data.content, 'error');
    }
}

function loadEditor(filepath, filetype, content) {
    editor.session.setMode("ace/mode/" + filetype);
    editor.setValue(content);
    editoroptions.innerHTML = `
    <button class="back-btn" onclick="closeEditor(); setFilePath(lastFolder('${filepath}', false))">
        <span>Exit</span>
    </button>
    <span id="filename">${filepath.split('/').slice(-1)[0]}</span>
    <button class="save-btn" data-filepath="${filepath}" onclick="saveFile(this ,this.getAttribute('data-filepath'))">
        <span>Save</span>
        <span class="btn-loader"></span>
    </button>`
    editorcontainer.style.display = 'block';
    document.body.style.overflow = 'hidden';

}

function closeEditor() {
    editorcontainer.style.display = 'none';
    document.body.style.overflow = 'scroll'
}

function filePathLoader(filepath) {
    filepathcontainer.innerHTML = '';
    let files = filepath.split('/').filter(Boolean);

    if (files.length === 0) {
        filepathcontainer.insertAdjacentHTML('beforeend', `<button data-filepath="/" onclick="setFilePath(this.getAttribute('data-filepath'))">root</button>`);
        return;
    }
    filepathcontainer.insertAdjacentHTML('beforeend', `<button data-filepath="/" onclick="setFilePath(this.getAttribute('data-filepath'))">root</button><span>&nbsp;/&nbsp;</span>`);
    for (let i = 0; i<files.length; i++) {
        let currentfilepath = '';
        for (let j = 0; j<=i; j++) {
            currentfilepath += '/' + files[j];
        }
        if (currentfilepath) {
            if (i+1 === files.length) {
                filepathcontainer.insertAdjacentHTML('beforeend', `<button data-filepath="${currentfilepath}" onclick="setFilePath(this.getAttribute('data-filepath'))">${files[i]}</button>`);
            } else {
                filepathcontainer.insertAdjacentHTML('beforeend', `<button data-filepath="${currentfilepath}" onclick="setFilePath(this.getAttribute('data-filepath'))">${files[i]}</button><span>&nbsp;/&nbsp;</span>`);
            }
        }
    }
}

function displayUpload(currentstatus, filesuploaded, filestotal) {
    if (currentstatus === "complete") {
        uploadcontainer.style = '';
        return;
    }
    if (currentstatus === "in_progress") {
            let percent = (filesuploaded / filestotal) * 100;
            uploadcontainer.style.display = 'flex';
            uploadcontainer.querySelector("p").textContent = `${filesuploaded} of ${filestotal} uploaded`;
            uploadcontainer.querySelector(".progress-bar").style.width = percent + "%";
    }
}

function loadActions(filepath) {
    actionscontainer.innerHTML = '';
    actionscontainer.insertAdjacentHTML('beforeend', `
    <span class="create-dropdown">
        <button class="create-btn" onclick="toggleCreateDropdown()">Create&nbsp;<img src="/assets/icons/down-arrow.svg"></button>
        <div class="create-options">
            <button onclick="openCreateFileModal('${filepath}')">File</button>
            <button onclick="openCreateFolderModal('${filepath}')">Folder</button>
        </div>
    </span>
    <span class="upload-dropdown">
        <button class="upload-btn" onclick="toggleUploadDropdown()">Upload&nbsp;<img src="/assets/icons/down-arrow.svg"></button>
        <div class="upload-options">
            <button onclick="openFileInput('${filepath}')">File</button>
            <button onclick="openFolderInput('${filepath}')">Folder</button>
        </div>
    </span>`)
}

function toggleCreateDropdown() {
    let dropdown = document.querySelector('.create-dropdown');
    dropdown.classList.toggle('show');
}

function toggleUploadDropdown() {
    let dropdown = document.querySelector('.upload-dropdown');
    dropdown.classList.toggle('show');
}
function closeCreateDropdown() {
    let dropdowns = document.querySelectorAll('.create-dropdown');
    dropdowns.forEach(function(dropdown) {
        if (dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
        }
    });
}

function closeUploadDropdown() {
    let dropdowns = document.querySelectorAll('.upload-dropdown');
    dropdowns.forEach(function(dropdown) {
        if (dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
        }
    });
}

function openCreateFileModal(filepath) {
    openModal(`
        <form>
            <h1>Create file</h1>
            <input type="text" name="filename" placeholder="File name">
            <div class="buttons">
                <button class="cancel-btn" type="button" onclick="closeModal()">Cancel</button>
                <button class="submit-btn" type="submit" onclick="create('${filepath}', 'file', document.querySelector('input[name=filename]').value, this)"><span>Create</span><span class="btn-loader"></span></button>
            </div>
        </form>
    `)
}

function openCreateFolderModal(filepath) {
    openModal(`
        <form>
            <h1>Create folder</h1>
            <input type="text" name="filename" placeholder="Folder name">
            <div class="buttons">
                <button class="cancel-btn" type="button" onclick="closeModal()">Cancel</button>
                <button class="submit-btn" type="submit" onclick="create('${filepath}', 'dir', document.querySelector('input[name=filename]').value, this)"><span>Create</span><span class="btn-loader"></span></button>
            </div>
        </form>
    `)
}

function openDeleteModal(filepath) {
    if (filepath) {
        openModal(`
        <h1>Delete file</h1>
        <p>Are you sure you want to delete this file?</p>
        <div class="buttons">
            <button class="cancel-btn" onclick="closeModal()">Cancel</button>
            <button class="submit-btn" onclick="deleteFile('${filepath}', this)"><span>Delete</span><span class="btn-loader"></span></button>
        </div>
    `)
    } else {
        openModal(`
        <h1>Delete file</h1>
        <p>Are you sure you want to delete ${document.querySelectorAll(".checkbox input:checked").length} file(s)?</p>
        <div class="buttons">
            <button class="cancel-btn" onclick="closeModal()">Cancel</button>
            <button class="submit-btn" onclick="deleteCheckedFiles(this)"><span>Delete</span><span class="btn-loader"></span></button>
        </div>
    `)
    }
}

async function deleteCheckedFiles(button) {
    button.querySelector('.btn-loader').style.display = 'inline-block';
    let checkedelements = document.querySelectorAll(".checkbox input:checked");
    let successfuldeletions = 0;
    for (let cb of checkedelements) {
        let responsejson = await deleteFile(cb.parentElement.parentElement.getAttribute('data-filepath'), null, false);
        if (handleStatus(responsejson, true)) {
            successfuldeletions++;
        }
    }
    button.querySelector('.btn-loader').style.display = 'none';
    closeModal();
    if (successfuldeletions > 0) {
        await loadFiles();
    }
}

function openRenameModal(filepath, filename) {
    openModal(`
        <form>
            <h1>Rename file</h1>
            <input type="text" name="filename" placeholder="New name" value="${filename}">
            <div class="buttons">
                <button class="cancel-btn" type="button" onclick="closeModal()">Cancel</button>
                <button class="submit-btn" type="submit" onclick="renameFile('${filepath}', document.querySelector('input[name=filename]').value, this)"><span>Rename</span><span class="btn-loader"></span></button>
            </div>
        </form>
    `)
}

function openFileInput(filepath) {
    fileinput.setAttribute('data-filepath', filepath);
    fileinput.click();
}

function openFolderInput(filepath) {
    folderinput.setAttribute('data-filepath', filepath);
    folderinput.click();
}

function lastFolder(filepath, appendroot) {
    let filenames = filepath.split('/').filter(Boolean);
    let newfilepath = appendroot ? '/' : '';
    let counter = 0;
    while (counter < filenames.length - 1) {
        newfilepath +=  '/' + filenames[counter];
        counter++;
    }
    return newfilepath;
}

async function initDownload(filepath, button = null) {
    if (filepath) {
        await downloadFile([filepath]);
    } else {
        let filepaths = [];
        let checkedelements = document.querySelectorAll(".checkbox input:checked");

        for (let cb of checkedelements) {
            filepaths.push(cb.parentElement.parentElement.getAttribute('data-filepath'));
        }
        if (button !== null) {
            button.querySelector('.btn-loader').style.display = 'inline-block';
        }
        await downloadFile(filepaths);
        if (button !== null) {
            button.querySelector('.btn-loader').style.display = 'none';
        }
    }
}

function checkOptions(targetcb) {
    if (targetcb.checked) {
        checkedoptions.style.display = 'flex';
    } else {
        let displayoptions = false;
        document.querySelectorAll(".checkbox input").forEach((elm) => {
            if (elm.checked) {
                displayoptions = true;
            }
        })
        if (!displayoptions) {
            checkedoptions.style = '';
        }
    }
}
