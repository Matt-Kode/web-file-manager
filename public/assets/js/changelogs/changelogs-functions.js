const changelogscontainer = document.querySelector('.changelogs-container');
async function loadChangelogs() {
    changelogscontainer.innerHTML = '';
    let data = await fetchChangelogs();
    for (let cl of data.changelogs) {
        let status = `<p class="pending">pending</p>`;
        if (cl.approved === 0) {
            status = `<p class="rejected">rejected</p>`;
        } else if (cl.approved === 1) {
            status = `<p class="approved">approved</p>`;
        }
        changelogscontainer.insertAdjacentHTML('beforeend', `
        <div class="changelog">
            <span>
                <div class="desc">${cl.action} file ${cl.filepath}</div>
                <div class="info">done by ${cl.done_by} on ${cl.done_at}</div>
            </span>
            ${status}
            <a href="/changelogs/${cl.id}">View</a>
        </div>`);
    }
}
