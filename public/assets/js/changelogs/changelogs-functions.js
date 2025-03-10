const changelogscontainer = document.querySelector('.changelogs-container');
async function loadChangelogs() {
    changelogscontainer.innerHTML = '';
    let data = await fetchChangelogs();
    for (let cl of data.changelogs) {
        if (cl.action === 'edit') {
        changelogscontainer.insertAdjacentHTML('beforeend', `
        <div class="changelog">
            <span>
                <div class="desc">${cl.action} file ${cl.filepath}</div>
                <div class="info">done by ${cl.done_by} on ${cl.done_at}</div>
            </span>
            ${data.is_admin === 1 ? `<button onClick="revert(${cl.id}, 'revert_edit')"><span>Revert</span><span id="btn_${cl.id}" class="btn-loader"></span></button>` : ''}
        </div>`);
            continue;
        }
        if (cl.action === 'delete') {
        changelogscontainer.insertAdjacentHTML('beforeend', `
        <div class="changelog">
            <span>
                <div class="desc">${cl.action} file ${cl.filepath}</div>
                <div class="info">done by ${cl.done_by} on ${cl.done_at}</div>
            </span>
            ${data.is_admin === 1 ? `<button onClick="revert(${cl.id}, 'revert_delete')"><span>Revert</span><span id="btn_${cl.id}" class="btn-loader"></span></button>` : ''}
        </div>`);
            continue;
        }
        changelogscontainer.insertAdjacentHTML('beforeend', `
        <div class="changelog">
            <span>
                <div class="desc">${cl.action} file ${cl.filepath}</div>
                <div class="info">done by ${cl.done_by} on ${cl.done_at}</div>
            </span>
        </div>`);
    }
}
