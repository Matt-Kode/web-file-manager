const table = document.querySelector('.file-table');
const filepathcontainer = document.querySelector('.file-path');
const actionscontainer = document.querySelector('.actions');
let editor = null;
const editorcontainer = document.querySelector(".editor-container");
const fileinput = document.querySelector(".file-input");
const folderinput = document.querySelector(".folder-input");
const uploadcontainer = document.querySelector(".uploads-container");



async function loadFiles(filepath) {
    table.innerHTML = '';
    closeEditor();
    let data = await fetchFiles(filepath);
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
                <tr data-filepath="${filepath + content[i].name  + '/'}">
                    <td onclick="loadFiles(this.parentElement.getAttribute('data-filepath'))"><img src="/assets/icons/directory.svg">&nbsp;&nbsp;<p>${content[i].name}</p></td>
                    <td></td>
                    <td><button class="context-menu-btn"><img src="/assets/icons/menu.svg"></button></td>
                </tr>`);

            }
            if (content[i].type === 'file') {
                table.insertAdjacentHTML('beforeend', `
                <tr data-filepath="${filepath + content[i].name}">
                    <td onclick="loadFiles(this.parentElement.getAttribute('data-filepath'))"><img src="/assets/icons/file.svg">&nbsp;&nbsp;<p>${content[i].name}</p></td>
                    <td>${content[i].size}</td>
                    <td><button class="context-menu-btn"><img src="/assets/icons/menu.svg"></button></td>
                </tr>`);

            }
        }
        filePathLoader(filepath);
        return;
    }
    if (data.type === 'file') {
        loadEditor(filepath, data.extension, data.content);
        filePathLoader(filepath);
        return;
    }
    if (data.type === 'error') {
        displayNotification(data.content, 'error');
    }

}

function loadEditor(filepath, filetype, content) {
    actionscontainer.innerHTML = '';
    editorcontainer.innerHTML = `<div id="editor"></div><button class="save-btn" data-filepath=${filepath} onclick="saveFile(this.getAttribute('data-filepath'))">Save file&nbsp;&nbsp;<span class="btn-loader"></span></button>`
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/twilight");
    editor.session.setMode("ace/mode/" + filetype);
    editor.setValue(content);
}

function closeEditor() {
    editorcontainer.innerHTML = '';
    editor = null;
}

function filePathLoader(filepath) {
    filepathcontainer.innerHTML = '';
    let files = filepath.split('/').filter(Boolean);

    if (files.length === 0) {
        filepathcontainer.insertAdjacentHTML('beforeend', `<button data-filepath="/" onclick="loadFiles(this.getAttribute('data-filepath'))">root</button>`);
        return;
    }
    filepathcontainer.insertAdjacentHTML('beforeend', `<button data-filepath="/" onclick="loadFiles(this.getAttribute('data-filepath'))">root</button><span>&nbsp;>&nbsp;</span>`);
    for (let i = 0; i<files.length; i++) {
        let currentfilepath = '/';
        for (let j = 0; j<=i; j++) {
            currentfilepath += files[j] +  '/';
        }
        if (currentfilepath) {
            if (i+1 === files.length) {
                filepathcontainer.insertAdjacentHTML('beforeend', `<button data-filepath="${currentfilepath}" onclick="loadFiles(this.getAttribute('data-filepath'))">${files[i]}</button>`);
            } else {
                filepathcontainer.insertAdjacentHTML('beforeend', `<button data-filepath="${currentfilepath}" onclick="loadFiles(this.getAttribute('data-filepath'))">${files[i]}</button><span>&nbsp;>&nbsp;</span>`);
            }
        }
    }
}

function handleStatus(data) {
    if (data.type === 'error') {
        displayNotification(data.content, 'error');
        return false;
    }
    if (data.type === 'success') {
        displayNotification(data.content, 'success');
        return true;
    }
}

function displayUpload(currentstatus, filesuploaded, filestotal) {
    if (currentstatus === "complete") {
        uploadcontainer.style.display = 'none';
    }
    if (currentstatus === "in_progress") {
        let percent = (filesuploaded / filestotal) * 100;
        console.log(percent);
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
                <button class="submit-btn" type="submit" onclick="create('${filepath}', 'file', document.querySelector('input[name=filename]').value)">Submit</button>
                <button class="cancel-btn" type="button" onclick="closeModal()">Cancel</button>
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
                <button class="submit-btn" type="submit" onclick="create('${filepath}', 'dir', document.querySelector('input[name=filename]').value)">Submit</button>
                <button class="cancel-btn" type="button" onclick="closeModal()">Cancel</button>
            </div>
        </form>
    `)
}

function toggleContextMenu(filepath, posx, posy) {
        let contextmenu = document.querySelector(".context-menu");
        contextmenu.setAttribute("data-filepath", filepath);
        contextmenu.classList.toggle('show');
        contextmenu.style.top = posy + 'px';
        contextmenu.style.left = posx + 'px';
}

function closeContextMenu() {
    document.querySelectorAll('.context-menu').forEach(function(menu) {
        if (menu.classList.contains('show')) {
            menu.classList.remove('show');
        }
    })
}

function openDeleteModal(filepath) {
    openModal(`
        <h1>Delete file</h1>
        <p>Are you sure you want to delete this file?</p>
        <div class="buttons">
            <button class="submit-btn" onclick="deleteFile('${filepath}')">Delete</button>
            <button class="cancel-btn" onclick="closeModal()">Cancel</button>
        </div>
    `)
}

function openRenameModal(filepath) {
    openModal(`
        <form>
            <h1>Rename file</h1>
            <input type="text" name="filename" placeholder="New name">
            <div class="buttons">
                <button class="submit-btn" type="submit" onclick="renameFile('${filepath}', document.querySelector('input[name=filename]').value)">Submit</button>
                <button class="cancel-btn" type="button" onclick="closeModal()">Cancel</button>
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
        newfilepath +=  filenames[counter] + '/';
        counter++;
    }
    return newfilepath;
}

function initDownload(filepath) {
    if (filepath) {
        downloadFile([filepath]);
        return;
    } else {
        //TODO: download all checked files
    }
}
