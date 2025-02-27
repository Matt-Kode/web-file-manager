window.addEventListener('load', (event) => {
    loadFiles('/');
});

window.addEventListener('click', (event) => {
    if (!event.target.matches('.create-btn') && !event.target.matches('.create-btn *')) {
        closeCreateDropdown();
    }
    if (!event.target.matches('.upload-btn') && !event.target.matches('.upload-btn *')) {
        closeUploadDropdown();
    }
    if (event.target.parentElement.matches('.context-menu-btn')) {
        let filepath = event.target.parentElement.parentElement.parentElement.getAttribute('data-filepath');
        toggleContextMenu(filepath, event.pageX-110, event.pageY);
    } else {
        closeContextMenu();
    }
})

window.addEventListener('submit', (event) => {
    event.preventDefault();
})

window.addEventListener('change', async (event) => {
    if (event.target.matches('.file-input')) {
        let files = event.target.files;
        let filepath = event.target.getAttribute('data-filepath');

        let successfuluploads = 0;
        for (let i = 0; i < files.length; i++) {
            let response = await uploadFile(filepath, files[i]);
            if (response.type === "success") {
                successfuluploads++;
            }
            if (response.type === "error") {
                displayNotification(`${response.content} (${files[i].name})` ,'error');
            }
            displayUpload("in_progress", successfuluploads, files.length);
        }
        displayUpload("complete", successfuluploads, files.length);
        await loadFiles(filepath);
        }

        if (event.target.matches('.folder-input')) {
            let files = event.target.files;
            let filepath = event.target.getAttribute('data-filepath');

            let successfuluploads = 0;
            for (let i = 0; i < files.length; i++) {
                let relativefilepath = filepath + lastFolder(files[i].webkitRelativePath, false);
                let response = await uploadFile(relativefilepath, files[i]);
                if (response.type === "success") {
                    successfuluploads++;
                }
                if (response.type === "error") {
                    displayNotification(`${response.content} (${files[i].name})` ,'error');
                }
                displayUpload("in_progress", successfuluploads, files.length);
            }
            displayUpload("complete", successfuluploads, files.length);
            await loadFiles(filepath);
        }
})
