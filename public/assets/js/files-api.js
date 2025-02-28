async function  fetchFiles(filepathparam) {
    let response = await fetch('/api/get', {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({filepath: filepathparam})
    });
    return await response.json();
}

async function saveFile(filepathparam) {
    let loader = document.querySelector(".btn-loader");
    loader.style.display = 'inline-block';
    let response = await fetch('/api/put', {
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

async function create(filepathparam, filetypeparam, filenameparam) {
    let response = await fetch('/api/create', {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({filepath: filepathparam, filename: filenameparam, filetype: filetypeparam})
    });
    if (handleStatus(await response.json())) {
        closeModal();
        await loadFiles(filepathparam);
    }
}

async function deleteFile(filepathparam, handlestatus = true) {
    closeModal();
    let response = await fetch('/api/delete', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({filepath: filepathparam})
    });
    if (!handlestatus) {
        return await response.json();
    }
    handleStatus(await response.json());
    await loadFiles(lastFolder(filepathparam, true));
}

async function renameFile(filepathparam, newfilenameparam) {
    closeModal();
    let response = await fetch('/api/rename', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({filepath: filepathparam, newfilename: newfilenameparam})
    });
    if (handleStatus(await response.json())) {
        closeModal();
        await loadFiles(lastFolder(filepathparam, true));
    }
}

async function uploadFile(filepathparam, file) {
    let form = new FormData();
    form.append('file', file);
    form.append('filepath', filepathparam);
    let response = await fetch('/api/upload', {
        method: "POST",
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
        },
        body: form
    });
    return await response.json();
}

async function downloadFile(filepathsarray) {
    let response = await fetch('/api/download', {
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



