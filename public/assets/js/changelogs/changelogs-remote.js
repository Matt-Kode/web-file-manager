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

async function revert(clid, type) {
    let loader = document.getElementById("btn_" + clid);
    loader.style.display = 'inline-block';
    let repsponse= await fetch('/changelogs/' + type, {
        method: 'POST',
        headers: {
            "Content-Type" : 'application/json',
            "X-CSRF-TOKEN" : document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({id: clid})
    });
    loader.style = '';
    await loadChangelogs();
}



