let headers = new Headers();
headers.append('authorization', 'Bearer blablatoken');
headers.append('Accept', 'application/json');
headers.append('Content-Type', 'application/json');

function addItem() {
    let value = document.getElementById('input').value;
    let url = `/newtodo`;
    let body = {
        item: value
    };

    fetch(url, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify(body)
    })
    .then((res) => {
        location.href = '/';
    });
}

function deleteItem(id) {
    console.log(id);
    let url = `/todo/${id}`;
    console.log(url);
    fetch(url, {
        method: 'DELETE',
        headers: headers
    })
    .then((res) => {
        location.href = '/';
    });
}

function toggleComplete(id) {
    let url = `/todo/${id}/completed`;

    fetch(url, {
        method: 'POST',
        headers: headers
    }).then(res => res);
}
