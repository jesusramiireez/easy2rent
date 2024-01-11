import MarcaService from "./services/MarcaService.js";
import Loading from "./components/Loading.js";
import { scrollToHash } from "./util.js";
const listContainer = document.querySelector('#list-container');
const btnInsert = document.querySelector('#btn-insert');
const btnUpdate = document.querySelector('#btn-update');
const btnCancel = document.querySelector('#btn-cancel');
const messageAlert = document.querySelector('#message');
const form = document.querySelector('#frm-item');
const inputSearch = document.querySelector("#input-search");
const loadingObj = new Loading("modal-message", "Loading...")

let currentMarca = null;

const newMarca = () => {
    const nombreInput = document.querySelector('#field-name');
    const nombre = nombreInput.value;
    console.log("nombre:", nombre); 
    const marca = { name: nombre };
    console.log("marca:", marca);
    loadingObj.open();
    MarcaService.insert(marca).then(data => {
        console.log("message", data);
        renderMarcas();
        form.reset();
        scrollToHash("title-list");
    }).finally(() => {
        loadingObj.close();
    });
};
const editMarca = (id) => {
    MarcaService.getItemById(id).then(data => {
        currentMarca = data;
        if (data && data.name) {
            document.querySelector('#field-name').value = data.name;
        } else {
            console.error('La propiedad "name" no está definida en el objeto recibido.');
        }
    }).catch(error => {
        console.error('Error al obtener la marca:', error);
    });
    btnInsert.classList.replace("d-inline", "d-none");
    btnUpdate.classList.replace("d-none", "d-inline");
    btnCancel.classList.replace("d-none", "d-inline");
    scrollToHash("title-form");
}

const updateMarca = () => {
    const id = currentMarca.id;
    const name = document.querySelector('#field-name').value;
    const marca = { id, name };

    MarcaService.update(marca).then(data => {
        currentMarca = null;
        messageAlert.textContent = data.message;
        btnCancel.classList.replace("d-inline", "d-none");
        btnUpdate.classList.replace("d-inline", "d-none");
        btnInsert.classList.replace("d-none", "d-inline");
        form.reset();
        renderMarcas();
    });
};

const deleteMarca = (id) => {
    MarcaService.delete(id)
        .then(data => {
            messageAlert.textContent = data.message;
            //Change state
            renderMarcas();
        })
}

const populateMarcas = (items) => {
    items.forEach((e, i) => {
        listContainer.innerHTML += `
            <tr>
                <td>${i + 1}</td>
                <td>${e.name}</td>
                <td class="text-center">
                    <button id="btn-delete-${e.id}" class="btn btn-danger btn-delete">Delete</button>
                    <button id="btn-edit-${e.id}" class="btn btn-info btn-edit" >Edit</button>
                </td>
            </tr>
        `;
    });

    // Buttons delete
    const buttonsDelete = document.querySelectorAll('.btn-delete');
    buttonsDelete.forEach(button => {
        button.addEventListener("click", function () {
            let id = this.id.split("-")[2];
            deleteMarca(id);
        })
    });

    // Buttons Edit
    const buttonsEdit = document.querySelectorAll('.btn-edit');
    buttonsEdit.forEach(button => {
        button.addEventListener("click", function () {
            let id = this.id.split("-")[2];
            editMarca(id);
        })
    });
}

const renderMarcas = (searchValue) => {
    listContainer.innerHTML = "";
    if (searchValue) {
        loadingObj.open();
        MarcaService.searchItemByName(searchValue)
            .then(items => {
                if (items.length===0){
                    listContainer.innerHTML = "<tr><td colspan='4'>No items found<td></tr>";
                }else{
                    populateMarcas(items);
                }
               
            }).finally(() => {
                loadingObj.close();
            });
    } else {
        loadingObj.open();
        MarcaService.getItemsList()
            .then(items => {
                populateMarcas(items);
            }).finally(() => {
                loadingObj.close();
            });
    }
}
const validateForm = (event) => {
    event.preventDefault();
    //Execute insert or update depends to button name 
    if (event.target.id === "btn-insert") {
        newMarca();
    } else if (event.target.id === "btn-update") {
        updateMarca();
    }else{
        console.log("id button not found in validateForm function");
    }
}

const searchMarca = (event) => {
    event.preventDefault();
    const input = event.target;
    if (input.value.length >= 3) {
        let nameSearch = input.value.toLowerCase();
        renderMarcas(nameSearch);
    } else if (input.value.length == 0) {
        renderMarcas();
    }
}

function init() {
    renderMarcas();
    btnCancel.addEventListener("click", function (e) {
        currentMarca = null;
        messageAlert.textContent = "";
        btnCancel.classList.replace("d-inline", "d-none");
        btnUpdate.classList.replace("d-inline", "d-none");
        btnInsert.classList.replace("d-none", "d-inline");
        form.reset();
    });

    inputSearch.addEventListener("keyup", searchMarca);
    btnInsert.addEventListener("click", validateForm);
    btnUpdate.addEventListener("click", validateForm);
    // Reiniciamos el formulario por si hay datos precargados
    form.reset();
}

init();