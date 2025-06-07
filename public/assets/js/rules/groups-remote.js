async function fetchGroups() {
    let response = await fetch('/groups', {
        method: 'POST',
        headers: {
            "Content-Type" : 'application/json',
            "X-CSRF-TOKEN" : document.querySelector('meta[name="csrf-token"]').content
        }
    });
    return await response.json();
}

async function fetchRules(groupid) {
    let response = await fetch('/groups/rules', {
        method: 'POST',
        headers: {
            "Content-Type" : 'application/json',
            "X-CSRF-TOKEN" : document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({group_id: groupid})
    });
    return await response.json();
}

async function addGroup(nameparam, discord_role_id) {
    let roleid = discord_role_id || null;
    let response = await fetch('/groups/create', {
        method: 'POST',
        headers: {
            "Content-Type" : 'application/json',
            "X-CSRF-TOKEN" : document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({name: nameparam, discord_role_id: roleid})
    });
    if (handleStatus(await response.json())) {
        closeModal();
        await loadGroups();
    }
}

async function editGroup(idparam, nameparam, discord_role_id) {
    let roleid = discord_role_id || null;
    let response = await fetch('/groups/update', {
        method: 'POST',
        headers: {
            "Content-Type" : 'application/json',
            "X-CSRF-TOKEN" : document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({id: idparam, name: nameparam, discord_role_id: roleid})
    });
    if (handleStatus(await response.json())) {
        closeModal();
        await loadGroups();
    }
}

async function addRule(groupelement, groupid, filepathparam, priorityparam, viewparam, editparam, createparam, renameparam, downloadparam, uploadparam, deleteparam) {
    let response = await fetch('/groups/rules/create', {
        method: 'POST',
        headers: {
            "Content-Type" : 'application/json',
            "X-CSRF-TOKEN" : document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({
            group_id: groupid,
            filepath: filepathparam,
            priority: priorityparam,
            permissions: {
                view: viewparam,
                edit: editparam,
                create: createparam,
                rename: renameparam,
                download: downloadparam,
                upload: uploadparam,
                delete: deleteparam
            }})
    });
    if (handleStatus(await response.json())) {
        closeModal();
        await loadRules(groupelement, groupid);
    }
}

async function editRule(ruleid, groupelement, groupid, filepathparam, priorityparam, viewparam, editparam, createparam, renameparam, downloadparam, uploadparam, deleteparam) {
    let response = await fetch('/groups/rules/update', {
        method: 'POST',
        headers: {
            "Content-Type" : 'application/json',
            "X-CSRF-TOKEN" : document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({
            rule_id: ruleid,
            filepath: filepathparam,
            priority: priorityparam,
            permissions: {
                view: viewparam,
                edit: editparam,
                create: createparam,
                rename: renameparam,
                download: downloadparam,
                upload: uploadparam,
                delete: deleteparam
            }})
    });
    if (handleStatus(await response.json())) {
        closeModal();
        await loadRules(groupelement, groupid);
    }
}

async function deleteGroup(groupid) {
    let response = await fetch('/groups/delete', {
        method: 'POST',
        headers: {
            "Content-Type" : 'application/json',
            "X-CSRF-TOKEN" : document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({group_id: groupid})
    });
    if (handleStatus(await response.json())) {
        closeModal();
        await loadGroups();
    }
}

async function deleteRule(ruleid, groupelement, groupid) {
    let response = await fetch('/groups/rules/delete', {
        method: 'POST',
        headers: {
            "Content-Type" : 'application/json',
            "X-CSRF-TOKEN" : document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({rule_id: ruleid})
    });
    if (handleStatus(await response.json())) {
        closeModal();
        await loadRules(groupelement, groupid);
    }
}
