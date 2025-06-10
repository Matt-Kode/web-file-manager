async function  fetchFiles(filepathparam) {
    let response = await fetch('/remote/get', {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({filepath: filepathparam})
    });
    return await response.json();
}

async function saveFile(button, filepathparam) {
    let loader = button.querySelector(".btn-loader");
    loader.style.display = 'inline-block';
    let response = await fetch('/remote/put', {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({filepath: filepathparam, content: editor.getValue()})
    });
    loader.style.display = 'none';
    handleStatus(await response.json());
}

async function create(filepathparam, filetypeparam, filenameparam, button) {
    button.querySelector('.btn-loader').style.display = 'inline-block';
    let response = await fetch('/remote/create', {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({filepath: filepathparam, filename: filenameparam, filetype: filetypeparam})
    });
    button.querySelector('.btn-loader').style.display = 'none';
    if (handleStatus(await response.json())) {
        closeModal();
        await loadFiles();
    }
}

async function deleteFile(filepathparam, button, handlestatus = true) {
    if (button !== null) {
        button.querySelector('.btn-loader').style.display = 'inline-block';
    }
    let response = await fetch('/remote/delete', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({filepath: filepathparam})
    });
    if (button !== null) {
        button.querySelector('.btn-loader').style.display = 'none';
    }
    if (!handlestatus) {
        return await response.json();
    }
    if (handleStatus(await response.json(), true)) {
        closeModal();
        await loadFiles();
    }
}

async function renameFile(filepathparam, newfilenameparam, button) {
    button.querySelector('.btn-loader').style.display = 'inline-block';
    let response = await fetch('/remote/rename', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({filepath: filepathparam, newfilename: newfilenameparam})
    });
    button.querySelector('.btn-loader').style.display = 'none';
    if (handleStatus(await response.json())) {
        closeModal();
        await loadFiles();
    }
}

async function uploadFile(filepathparam, file) {
    let form = new FormData();
    form.append('file', file);
    form.append('filepath', filepathparam);
    let response = await fetch('/remote/upload', {
        method: "POST",
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
        },
        body: form
    });
    return await response.json();
}

async function downloadFile(filepathsarray) {
    let response = await fetch('/remote/download', {
        method: "POST",
        headers:  {
            "Content-Type": "application/json",
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({filepaths: filepathsarray})
    });
    if (response.headers.get('Content-Type') !== 'application/octet-stream' && response.headers.get('Content-Type') !== 'application/zip') {
        handleStatus(await response.json());
        return;
    }
    let blob = await response.blob();
    const downloadUrl = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = response.headers.get('File-Name');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(downloadUrl);
}



