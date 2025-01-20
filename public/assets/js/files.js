const table = document.querySelector('.file-table');
const filepathcontainer = document.querySelector('.file-path')
const actionscontainer = document.querySelector('.actions')
let editor = null;
const editorcontainer = document.querySelector(".editor-container")

async function  fetchFiles(filepath) {
    let response = await fetch('/api/get', {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({filepath: filepath})
    });
    return await response.json();
}

async function loadFiles(filepath) {
    table.innerHTML = '';
    closeEditor();
    let data = await fetchFiles(filepath);
    if (data.type === 'dir' && data.content.length === 0) {
        table.insertAdjacentHTML('beforeend', `<div class="empty-dir"><p>This directory is empty</p></div>`)
        filePathLoader(filepath);
        return;
    }
    if (data.type === 'dir') {
        loadActions();
        let content = data.content;
        for (let i = 0; i<content.length; i++) {
            if (content[i].type === 'dir') {
                table.insertAdjacentHTML('beforeend', `
                <tr data-filepath="${filepath + '/' + content[i].name}">
                    <td onclick="loadFiles(this.parentElement.getAttribute('data-filepath'))"><img src="/assets/icons/directory.svg">&nbsp;&nbsp;<p>${content[i].name}</p></td>
                    <td></td>
                    <td><button onclick=""><img src="/assets/icons/menu.svg"></button></td>
                </tr>`)

            }
            if (content[i].type === 'file') {
                table.insertAdjacentHTML('beforeend', `
                <tr data-filepath="${filepath + '/' + content[i].name}">
                    <td onclick="loadFiles(this.parentElement.getAttribute('data-filepath'))"><img src="/assets/icons/file.svg">&nbsp;&nbsp;<p>${content[i].name}</p></td>
                    <td>${content[i].size}</td>
                    <td><button onclick=""><img src="/assets/icons/menu.svg"></button></td>
                </tr>`)

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
    let files = filepath.split('/');
    for (let i = 0; i<files.length; i++) {
        let currentfilepath = '';
        for (let j = 1; j<=i; j++) {
            currentfilepath += '/' + files[j]
        }
        if (currentfilepath) {
            if (i+1 === files.length) {
                filepathcontainer.insertAdjacentHTML('beforeend', `<button data-filepath="${currentfilepath}" onclick="loadFiles(this.getAttribute('data-filepath'))">${files[i]}</button>`)
            } else {
                filepathcontainer.insertAdjacentHTML('beforeend', `<button data-filepath="${currentfilepath}" onclick="loadFiles(this.getAttribute('data-filepath'))">${files[i]}</button><span>&nbsp;>&nbsp;</span>`)
            }
        }
    }
}

async function saveFile(filepath) {
    let loader = document.querySelector(".btn-loader");
    loader.style.display = 'inline-block';
    let response = await fetch('/api/put', {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({filepath: filepath, content: editor.getValue()})
    });
    loader.style.display = 'none';
    handleStatus(await response.json());
}

function handleStatus(data) {
    if (data.type === 'error') {
        displayNotification(data.content, 'error');
        return;
    }
    if (data.type === 'success') {
        displayNotification(data.content, 'success');
        return;
    }
}

function loadActions() {
    actionscontainer.innerHTML = '';
    actionscontainer.insertAdjacentHTML('beforeend', `
<span class="dropdown">
<button class="create-btn" onclick="toggleCreateDropdown()">Create&nbsp;<img src="/assets/icons/down-arrow.svg"></button>
<div class="create-options">
<button>File</button>
<button>Folder</button>
</div>
</span>
<button>Upload</button>`)
}

async function create(filepath, filetype, filename) {
    let response = await fetch('/api/put', {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({filepath: filepath, filename: filename, filetype: filetype})
    });
}

function toggleCreateDropdown() {
    let dropdown = document.querySelector('.dropdown');
    dropdown.classList.toggle('show');
}
