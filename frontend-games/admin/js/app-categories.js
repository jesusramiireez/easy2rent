import CategoryService from "./services/CategoryService.js";
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

let currentCategory = null;

const newCategory = () => {
    const name = document.querySelector('#field-name').value;
    const description = document.querySelector('#field-description').value;
    const category = {name, description};
    console.log("category", category);
    loadingObj.open();
    CategoryService.insert(category).then(data => {
        console.log("message", data);
        renderCategories();
        form.reset();
        scrollToHash("title-list");
    }).finally(() => {
        loadingObj.close();
    });
}

const editCategory = (id) => {
    CategoryService.getItemById(id).then(data => {
        currentCategory = data;
        document.querySelector('#field-name').value = data.name;
        document.querySelector('#field-description').value = data.description;
    });
    btnInsert.classList.replace("d-inline", "d-none");
    btnUpdate.classList.replace("d-none", "d-inline");
    btnCancel.classList.replace("d-none", "d-inline");
    scrollToHash("title-form");
}

const updateCategory = () => {
    const id = currentCategory.id;
    const name = document.querySelector('#field-name').value;
    const description = document.querySelector('#field-description').value;
    const category = {id, name, description}

    CategoryService.update(category).then(data => {
        currentCategory = null;
        messageAlert.textContent = data.message;
        btnCancel.classList.replace("d-inline", "d-none");
        btnUpdate.classList.replace("d-inline", "d-none");
        btnInsert.classList.replace("d-none", "d-inline");
        form.reset();
        renderCategories();
    });

}

const deleteCategory = (id) => {
    CategoryService.delete(id)
        .then(data => {
            messageAlert.textContent = data.message;
            //Change state
            renderCategories();
        })
}

const populateCategories = (items) => {
    items.forEach((e, i) => {
        listContainer.innerHTML += `
            <tr>
                <td>${i + 1}</td>
                <td>${e.name}</td>
                <td>${e.description}</td> 
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
            deleteCategory(id);
        })
    });

    // Buttons Edit
    const buttonsEdit = document.querySelectorAll('.btn-edit');
    buttonsEdit.forEach(button => {
        button.addEventListener("click", function () {
            let id = this.id.split("-")[2];
            editCategory(id);
        })
    });
}

const renderCategories = (searchValue) => {
    listContainer.innerHTML = "";
    if (searchValue) {
        loadingObj.open();
        CategoryService.searchItemByName(searchValue)
            .then(items => {
                if (items.length===0){
                    listContainer.innerHTML = "<tr><td colspan='4'>No items found<td></tr>";
                }else{
                    populateCategories(items);
                }
               
            }).finally(() => {
                loadingObj.close();
            });
    } else {
        loadingObj.open();
        CategoryService.getItemsList()
            .then(items => {
                populateCategories(items);
            }).finally(() => {
                loadingObj.close();
            });
    }
}
const validateForm = (event) => {
    event.preventDefault();
    //Execute insert or update depends to button name 
    if (event.target.id === "btn-insert") {
        newCategory();
    } else if (event.target.id === "btn-update") {
        updateCategory();
    }else{
        console.log("id button not found in validateForm function");
    }
}

const searchCategory = (event) => {
    event.preventDefault();
    const input = event.target;
    if (input.value.length >= 3) {
        let nameSearch = input.value.toLowerCase();
        renderCategories(nameSearch);
    } else if (input.value.length == 0) {
        renderCategories();
    }
}

function init() {
    renderCategories();
    btnCancel.addEventListener("click", function (e) {
        currentCategory = null;
        messageAlert.textContent = "";
        btnCancel.classList.replace("d-inline", "d-none");
        btnUpdate.classList.replace("d-inline", "d-none");
        btnInsert.classList.replace("d-none", "d-inline");
        form.reset();
    });

    inputSearch.addEventListener("keyup", searchCategory);
    btnInsert.addEventListener("click", validateForm);
    btnUpdate.addEventListener("click", validateForm);
    // Reiniciamos el formulario por si hay datos precargados
    form.reset();
}

init();