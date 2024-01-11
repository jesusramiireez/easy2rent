import GameService from "./services/GameService.js";
import MarcaService from "./services/MarcaService.js";
import Loading from "./components/Loading.js";
import { scrollToHash } from "./util.js";

const listContainer = document.querySelector('#list-container');
const selectMarca = document.querySelector('#field-marca');
const btnInsert = document.querySelector('#btn-insert');
const btnUpdate = document.querySelector('#btn-update');
const btnCancel = document.querySelector('#btn-cancel');
const messageAlert = document.querySelector('#message');
const form = document.querySelector('#frm-item');
const inputSearch = document.querySelector("#input-search");
const loadingObj = new Loading("modal-message", "Loading...");
const inputName = document.querySelector('#field-nombre');
const inputPrice = document.querySelector('#field-precio');

let currentGame = null;

const newGame = () => {
  const nombre = document.querySelector('#field-nombre').value;
  const marca = document.querySelector('#field-marca').value;
  const matricula = document.querySelector('#field-matricula').value;
  const precio = document.querySelector('#field-precio').value;
  const plazas = document.querySelector('#field-plazas').value;
  const maleta = document.querySelector("#field-maletas").value;

  const game = { nombre, marca: { id: marca }, matricula, precio, plazas, maleta };

  console.log("game", game);
  loadingObj.open();
  GameService.insert(game)
    .then(data => {
      console.log("message", data);
      renderGames();
      form.reset();
      scrollToHash("title-list");
    })
    .finally(() => {
      loadingObj.close();
    });
};


const editGame = (id) => {
  GameService.getItemById(id)
    .then((data) => {
      currentGame = data;
      document.querySelector('#field-nombre').value = data.nombre;

      MarcaService.getItemById(data.marca)
        .then((marcaData) => {
          const selectMarca = document.querySelector('#field-marca');
          selectMarca.value = marcaData; // Assign the whole response data to the value
        })
        .catch((error) => {
          console.log(error);
        });

      document.querySelector('#field-precio').value = data.precio;
      document.querySelector('#field-matricula').value = data.matricula;
      document.querySelector('#field-plazas').value = data.plazas;
      document.querySelector('#field-maletas').value = data.maletas;
      btnInsert.classList.replace('d-inline', 'd-none');
      btnUpdate.classList.replace('d-none', 'd-inline');
      btnCancel.classList.replace('d-none', 'd-inline');
      scrollToHash('title-form');
      console.log('btn-edit activated');
    });
};


const updateGame = () => {
  const id = currentGame.id;
  const nombre = document.querySelector('#field-nombre').value;
  const marca = document.querySelector('#field-marca').value;
  const matricula = document.querySelector('#field-matricula').value;
  const precio = document.querySelector('#field-precio').value;
  const plazas = document.querySelector('#field-plazas').value;
  const maleta = document.querySelector("#field-maletas").value;
  const car = { id, nombre, marca, matricula, precio, plazas, maleta };

  GameService.update(car)
    .then(data => {
      currentGame = null;
      messageAlert.textContent = data.message;
      btnCancel.classList.replace("d-inline", "d-none");
      btnUpdate.classList.replace("d-inline", "d-none");
      btnInsert.classList.replace("d-none", "d-inline");
      form.reset();
      renderGames();
    });
};

const deleteGame = (id) => {
  GameService.delete(id)
    .then(data => {
      messageAlert.textContent = data.message;
      //Change state
      renderGames();
    });
};

const populateGames = (items) => {
  const marcaPromises = items.map((e) => MarcaService.getItemById(e.marca.id));
  Promise.all(marcaPromises)
    .then((marca) => {
      items.forEach((e, i) => {
        listContainer.innerHTML += `
          <tr>
            <td>${i + 1}</td>
            <td>${e.nombre}</td>
            <td>${e.marca.name}</td>
            <td>${e.matricula}</td>
            <td>${e.precio}</td>
            <td>${e.plazas}</td>
            <td>${e.maletas}</td>
            <td class="text-center">
              <button id="btn-delete-${e.id}" class="btn btn-danger btn-delete">Delete</button>
              <button id="btn-edit-${e.id}" class="btn btn-info btn-edit" >Edit</button>
            </td>
          </tr>
        `;
      });
      attachEventListeners(); // Attach event listeners after populating the games
    })
    .catch((error) => {
      console.log(error);
    });
};

const attachEventListeners = () => {
  // Buttons delete
  const buttonsDelete = document.querySelectorAll('.btn-delete');
  buttonsDelete.forEach(button => {
    button.addEventListener("click", function () {
      let id = this.id.split("-")[2];
      deleteGame(id);
    });
  });

  // Buttons Edit
  const buttonsEdit = document.querySelectorAll('.btn-edit');
  buttonsEdit.forEach(button => {
    button.addEventListener("click", function () {
      let id = this.id.split("-")[2];
      editGame(id);
    });
  });
};

const renderGames = (searchValue) => {
  listContainer.innerHTML = "";
  if (searchValue) {
    loadingObj.open();
    GameService.searchItemByName(searchValue)
      .then((items) => {
        populateGames(items);
      })
      .finally(() => {
        loadingObj.close();
      });
  } else {
    loadingObj.open();
    GameService.getItemsList()
      .then((items) => {
        populateGames(items);
      })
      .finally(() => {
        loadingObj.close();
      });
  }
};

const validateForm = (event) => {
  event.preventDefault();
  // Validate each field

  // Execute insert or update depending on the button name 
  if (event.target.id === "btn-insert" || event.target.id === "btn-insert-submit") {
    newGame();
  } else if (event.target.id === "btn-update" || event.target.id === "btn-update-submit") {
    updateGame();
  } else {
    console.log(`Button with ID ${event.target.id} not found in validateForm function`);
  }
};

const searchGame = (event) => {
  event.preventDefault();
  const input = event.target;
  if (input.value.length >= 3) {
    let nameSearch = input.value.toLowerCase();
    renderGames(nameSearch);
  } else if (input.value.length === 0) {
    renderGames();
  }
};

const renderGategoriesSelect = () => {
  selectMarca.innerHTML = "";
  MarcaService.getItemsList()
    .then(data => {
      data.forEach(item => {
        selectMarca.innerHTML += `<option value="${item.id}">${item.name}</option>`;
      });
    })
    .catch((error) => {
      console.log(error);
    });
};
// Event listeners
btnInsert.addEventListener("click", validateForm);
btnUpdate.addEventListener("click", validateForm);
inputSearch.addEventListener("input", searchGame);
btnCancel.addEventListener("click", () => {
  currentGame = null;
  form.reset();
  btnInsert.classList.replace("d-none", "d-inline");
  btnCancel.classList.replace("d-inline", "d-none");
  btnUpdate.classList.replace("d-inline", "d-none");
});

// Initial execution
renderGategoriesSelect();
renderGames();
