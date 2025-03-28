const options = document.querySelector(".options");
async function fetchChangelog() {
    let clid = window.location.pathname.split('/').filter(Boolean)[1];
    let response= await fetch('/changelogs/' + clid, {
        method: 'POST',
        headers: {
            "Content-Type" : 'application/json',
            "X-CSRF-TOKEN" : document.querySelector('meta[name="csrf-token"]').content
        },
    });
    return await response.json();
}

async function loadChangelog() {
    let changelog = await fetchChangelog();
    if (changelog.type !== 'success') {
        displayNotification(changelog.content, 'error');
        return;
    }
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/twilight");
    editor.setReadOnly(true);
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
      options.insertAdjacentHTML('beforeend', `
     <a href="/changelogs">Back</a>
     <p>This file was reviewed by ${changelog.reviewed_by}</p>`)
    }
    if (changelog.is_admin && !changelog.reviewed) {
     options.insertAdjacentHTML('beforeend', `
     <a href="/changelogs">Back</a>
     <button class="accept-btn" onclick="">Accept</button>
     <button class="reject-btn">Reject</button>`);
    }
    if (!changelog.is_admin && !changelog.reviewed) {
     options.insertAdjacentHTML('beforeend', `
     <a href="/changelogs">Back</a>
     <p>This edit is pending review</p>`);
    }
    options.style.display = 'flex';
}

async function acceptEdit(clid) {
    let response = await fetch('/changelogs/' + clid + '/accept', {
        method: 'POST',
        headers: {
            "Content-Type" : 'application/json',
            "X-CSRF-TOKEN" : document.querySelector('meta[name="csrf-token"]').content
        }
    });
}

window.addEventListener('load', (event) => {
    loadChangelog();
})
