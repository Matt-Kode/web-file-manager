async function fetchChangelogs() {
    let response = await fetch('/changelogs', {
        method: 'POST',
        headers: {
            "Content-Type" : 'application/json',
            "X-CSRF-TOKEN" : document.querySelector('meta[name="csrf-token"]').content
        }
    });
    return await response.json();
}

async function fetchChangelog(id) {
    let response = await fetch('/changelogs/' + id, {
        method: 'POST',
        headers: {
            "Content-Type" : 'application/json',
            "X-CSRF-TOKEN" : document.querySelector('meta[name="csrf-token"]').content
        }
    });
    return await response.json();
}

async function acceptChangelog(clid, filename, button) {
    button.querySelector('.btn-loader').style.display = 'inline-block';
    let response = await fetch(`/changelogs/${clid}/accept`, {
        method: 'POST',
        headers: {
            "Content-Type" : 'application/json',
            "X-CSRF-TOKEN" : document.querySelector('meta[name="csrf-token"]').content
        }
    });
    button.querySelector('.btn-loader').style.display = 'none';
    let data = await response.json();
    if (data.type === 'conflict') {
        openConflictModal(data.content, filename, clid);
        return;
    }

    if (handleStatus(data)) {
        closeEditor();
        await loadChangelogs();
    }
}

async function rejectChangelog(clid, button) {
    button.querySelector('.btn-loader').style.display = 'inline-block';
    let response = await fetch(`/changelogs/${clid}/reject`, {
        method: 'POST',
        headers: {
            "Content-Type" : 'application/json',
            "X-CSRF-TOKEN" : document.querySelector('meta[name="csrf-token"]').content
        }
    });
    button.querySelector('.btn-loader').style.display = 'none';
    if (handleStatus(await response.json())) {
        closeEditor();
        await loadChangelogs();
    }
}

async function saveConflict(button, clid) {
    button.querySelector('.btn-loader').style.display = 'inline-block';
    let response = await fetch(`/changelogs/conflict/save`, {
        method: 'POST',
        headers: {
            "Content-Type" : 'application/json',
            "X-CSRF-TOKEN" : document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({changelog_id: clid, content: editor.getValue()})
    });
    button.querySelector('.btn-loader').style.display = 'none';
    if (handleStatus(await response.json())) {
        closeEditor();
        await loadChangelogs();
    }
}



