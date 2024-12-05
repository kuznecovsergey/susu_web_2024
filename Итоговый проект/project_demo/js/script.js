let mainValues = [];
let activeRowIndex = null;

function userFetch(url, options, callback) {
    fetch(url, options)
    .then(response => response.text())
    .then(dataText => {
        let data;

        try {
            data = JSON.parse(dataText);
        } catch(e) {
            throw('Невалидный JSON!');
        }

        if (Object.keys(data).length === 0) {
            throw('Пустое сообщение с сервера');
        }
        
        if (data && !Object.keys(data).includes('error')) {
            throw('Формат сообщения JSON не соответствует требованиям');
        }

        if (data.error == 1) {
            throw(data.errorMsg);
        }
        
        callback(data.data)
    })
    .catch(error => alert(error));
}

userFetch('api/producers/read.php', null, function(data) {
    const rows = [];

    data.forEach(function(item) {
        rows.push(`<option value="${item.id}">${item.name}</option>`);
    });

    document.querySelector('#select-producer').innerHTML += rows.join('');
    updateMain();
});

userFetch('api/units/read.php', null, function(data) {
    const rows = [];

    data.forEach(function(item) {
        rows.push(`<option value="${item.id}">${item.name}</option>`);
    });

    document.querySelector('#select-units').innerHTML += rows.join('');
    updateMain();
});

function updateMain() {
    setActiveRow(null);

    userFetch('api/main/read.php', null, function(data) {
        mainValues = data;
        buildTable();
    });
}

function removeRow(index) {
    const needToRemove = confirm('Вы действительно хотите удалить запись?');

    if (!needToRemove) {
        return;
    }

    const id = mainValues[index].id;

    userFetch(`api/main/delete.php?id=${id}`, null, () => updateMain());
}

function buildTable() {
    const rows = [];

    mainValues.forEach(function(item, index) {
        const row = `
        <tr data-index="${index}" onclick="rowClick(${index})">
            <td>${item.name}</td>
            <td>${item.num}</td>
            <td>${item.producers_name ? item.producers_name : '' }</td>
            <td>${item.units_name ? item.units_name : ''}</td>
            <td>${item.date_create ? item.date_create : ''}</td>
            <td onclick="event.stopPropagation(); removeRow(${index})">
                <img width="20" src="img/delete.svg">
            </td>
        </tr>`;
        rows.push(row);
    });

    document.querySelector('#main-container').innerHTML = rows.join('');
}

function setActiveRow(index) {
    if (activeRowIndex !== null) {
        const item = document.querySelector(`[data-index="${activeRowIndex}"]`);
        if (item) {
            item.classList.remove('activeRow');
        }
    }

    activeRowIndex = index;

    if (index === null) {
        ['#item-name', '#item-num', '#select-producer','#select-units', '#item-date'].forEach(function(id) {
            document.querySelector(id).value = null;
        });

        return;
    }

    const item = document.querySelector(`[data-index="${index}"]`);
    if (item) {
        item.classList.add('activeRow');
    }
}

function rowClick(index) {
    setActiveRow(index);
    const item = mainValues[index];

    document.querySelector('#item-name').value = item.name;
    document.querySelector('#item-num').value = item.num;
    document.querySelector('#select-producer').value = item.producer_id;
    document.querySelector('#select-units').value = item.unit_id;
    document.querySelector('#item-date').value = item.date_create;
}

function addRow() {
    const bodyJson = {
        name: document.querySelector('#item-name').value,
        num: document.querySelector('#item-num').value,
        producer_id: document.querySelector('#select-producer').value,
        unit_id: document.querySelector('#select-units').value,
        date_create: document.querySelector('#item-date').value
    }

    userFetch(`api/main/upgrade.php`, {
        method: 'POST',
        body: JSON.stringify(bodyJson)
    }, function(data) {
        updateMain();
    });
}

function editRow() {
    if (activeRowIndex === null) {
        return;
    }

    const bodyJson = {
        id: mainValues[activeRowIndex].id,
        name: document.querySelector('#item-name').value,
        num: document.querySelector('#item-num').value,
        producer_id: document.querySelector('#select-producer').value,
        unit_id: document.querySelector('#select-units').value,
        date_create: document.querySelector('#item-date').value
    }

    userFetch(`api/main/upgrade.php`, {
        method: 'POST',
        body: JSON.stringify(bodyJson)
    }, function() {
        updateMain();
    });
}