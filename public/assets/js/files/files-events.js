let upload_cancel = false;
window.addEventListener('hashchange', (event) => {
    if (!window.location.hash) {
        window.location.hash = '/';
    } else {
        loadFiles();
    }
})

window.addEventListener('load', (event) => {
    if (!window.location.hash) {
        window.location.hash = '/';
    } else {
        loadFiles();
    }
});

window.addEventListener('click', (event) => {
    if (event.target.parentElement === null) {
        closeCreateDropdown();
        closeUploadDropdown();
        closeContextMenu();
        return;
    }
    if (!event.target.matches('.create-btn') && !event.target.matches('.create-btn *')) {
        closeCreateDropdown();
    }
    if (!event.target.matches('.upload-btn') && !event.target.matches('.upload-btn *')) {
        closeUploadDropdown();
    }
    if (event.target.parentElement.matches('.context-menu-btn')) {
        let filepath = event.target.parentElement.parentElement.parentElement.getAttribute('data-filepath');
        toggleContextMenu(event.pageX-110, event.pageY, filepath);
    } else {
        closeContextMenu();
    }
})

window.addEventListener('change', async (event) => {
    upload_cancel = false;
    if (event.target.matches('.file-input')) {
        let files = event.target.files;
        let filepath = event.target.getAttribute('data-filepath');

        let successfuluploads = 0;
        for (let i = 0; i < files.length; i++) {
            if (upload_cancel) {
                break;
            }
            let response = await uploadFile(filepath, files[i]);
            if (response.type === "success") {
                successfuluploads++;
            }
            if (response.type === "error") {
                displayNotification(`${response.content} (${files[i].name})` ,'error');
            }
            if (response.type === 'no_permission') {
                displayNotification('Permission Denied', 'error');
                return;
            }
            displayUpload("in_progress", successfuluploads, files.length);
        }
        displayUpload("complete", successfuluploads, files.length);
        await loadFiles();
        }

        if (event.target.matches('.folder-input')) {
            let files = event.target.files;
            let filepath = event.target.getAttribute('data-filepath');

            let successfuluploads = 0;
            for (let i = 0; i < files.length; i++) {
                if (upload_cancel) {
                    break;
                }
                let relativefilepath = filepath + lastFolder(files[i].webkitRelativePath, false);
                let response = await uploadFile(relativefilepath, files[i]);
                if (response.type === "success") {
                    successfuluploads++;
                }
                if (response.type === "error") {
                    displayNotification(`${response.content} (${files[i].name})` ,'error');
                }
                if (response.type === 'no_permission') {
                    displayNotification('Permission Denied', 'error');
                    return;
                }
                displayUpload("in_progress", successfuluploads, files.length);
            }
            displayUpload("complete", successfuluploads, files.length);
            await loadFiles();
        }
})


