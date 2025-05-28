const changelogs = document.querySelector('.changelogs');
const editorcontainer = document.querySelector('.editor-container');
const editoroptions = document.querySelector('.editor-options');

const editor = ace.edit("editor");
editor.setTheme("ace/theme/twilight");
editor.setReadOnly(true);

const changelogloader = document.querySelector('.loader');

async function loadChangelogs() {
    changelogs.innerHTML = '';
    changelogloader.style.display = 'flex'
    let data = await fetchChangelogs();
    changelogloader.style.display = 'none'
    for (let cl of data.changelogs) {
        let status = `<p class="pending">pending</p>`;
        if (cl.approved === 0) {
            status = `<p class="rejected">rejected</p>`;
        } else if (cl.approved === 1) {
            status = `<p class="approved">approved</p>`;
        }
        changelogs.insertAdjacentHTML('beforeend', `
        <div class="changelog">
            <span class="desc">
                <div class="path">${cl.filepath}</div>
                <div class="info">done by ${cl.done_by} on ${cl.done_at}</div>
            </span>
            <span class="status">${status}</span>
            <button onclick="loadChangelog(${cl.id}, this, '${cl.filepath.split('/').slice(-1)[0]}')">
                <span>View</span>
                <span class="btn-loader"></span>
            </button>
        </div>`);
    }
}

async function loadChangelog(id, button, filename) {
    let loader = button.querySelector('.btn-loader');
    loader.style.display = 'inline-block';
    let changelog = await fetchChangelog(id);
    loader.style.display = 'none';
    if (changelog.type !== 'success') {
        displayNotification(changelog.content, 'error');
        return;
    }

    //clear all existing highlights
    let session = editor.getSession();
    let existingmarkers = session.getMarkers(false);
    console.log(existingmarkers);
    for (let id in existingmarkers) {
        session.removeMarker(id);
    }

    editor.setValue(changelog.diff.all_lines);

    for (let line of changelog.diff.added_lines) {
        let Range = ace.require('ace/range').Range;
        let range = new Range(line, 0, line, 1);
        editor.session.addMarker(range, "green_highlighted_line", "fullLine");
    }
    for (let line of changelog.diff.removed_lines) {
        let Range = ace.require('ace/range').Range;
        let range = new Range(line, 0, line, 1);
        editor.session.addMarker(range, "red_highlighted_line", "fullLine");
    }
    if (changelog.reviewed) {
        editoroptions.innerHTML = `
            <button class="back-btn" onclick="closeChangelog()">Back</button>
            <span id="filename">${filename}</span>
            <p>This file was reviewed by ${changelog.reviewed_by}</p>`;
    }
    if (changelog.is_admin && !changelog.reviewed) {
        editoroptions.innerHTML = `
            <button class="back-btn" onclick="closeChangelog()">Back</button>
            <span id="filename">${filename}</span>
            <span class="choices">
                <button class="accept-btn" onclick="">Accept</button>
                <button class="reject-btn" onclick="">Reject</button>
            </span>`;
    }
    if (!changelog.is_admin && !changelog.reviewed) {
        editoroptions.innerHTML = `
            <button class="back-btn" onclick="closeChangelog()">Back</button>
            <span id="filename">${filename}</span>
            <p>This edit is pending review</p>`;
    }
    editorcontainer.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeChangelog() {
    editorcontainer.style.display = 'none';
    document.body.style.overflow = 'scroll';
}
