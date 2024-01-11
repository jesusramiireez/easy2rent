const carrito = document.querySelector("#carrito");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBtn = document.querySelector("#vaciar-carrito");
const carList = document.querySelector('#car-container');
const searchInput = document.querySelector('#search-input');
const btnSearch = document.querySelector('.fa-magnifying-glass');
let articulosCarrito = [];

let carsJSON = [];

window.onload = async () => {
    cargarEventListeners();
    getCars();
}

function cargarEventListeners() {
    carList.addEventListener("click", agregarCoche);

    carrito.addEventListener("click", eliminarCoche);
    searchInput.addEventListener("keyup", searchCars);
    btnSearch.addEventListener("click", searchCars)

    articulosCarrito = JSON.parse(localStorage.getItem("carritoCoches")) || [];
    generarCarritoHTML();

    vaciarCarritoBtn.addEventListener("click", () => {
        articulosCarrito = []; // reseteamos el arreglo
        contenedorCarrito.innerHTML = ""; // Eliminamos todo el HTML
        localStorage.removeItem("carritoCoches");
        document.querySelector("#num-coches").innerHTML = "0"; // Inicializar cantidad coches
    });

}


const getCars = () => {
    fetch("http://localhost:8800/api/cars")
        .then(res => res.json())
        .then(data => {
            carsJSON = data
            printCars(carsJSON);
        });
};


const printCars = (cars) => {
    carList.innerHTML = "";
    cars.forEach(car => {
        let rating = null;
        if (car.nota < 5) {
            rating = "Mal"
        } else if (car.nota >= 5 && car.nota <= 7) {
            rating = "Bien"
        } else if (car.nota > 7 && car.nota < 8.5) {
            rating = "Genial"
        } else if (car.nota > 8.5) {
            rating = "Excelente"
        }
        let htmlCoche = `
            <div class="car-card">
                <div class="image-container">
                    <img src="./img/${car.matricula}.png" class="imagen-coche" alt="">
                </div>    
                <div class="car-information">
                    <div class="card-title">
                        <h4 class="marca">${car.marca.name}</h4>
                        <h4 class="nombre">${car.nombre}</h4>
                    </div>   
                    <div class="car-attributes">
                        <p><i class="fa-solid fa-user"></i>${car.plazas}</p>
                        <p><i class="fa-solid fa-gauge-high"></i>Km ilimitados</p>
                        <p><i class="fa-solid fa-gears"></i>${car.cambio}</p>
                        <p><i class="fa-solid fa-suitcase-rolling"></i>${car.maletas} maleta grande</p>
                    </div>
                    <div id="valorations-container">
                        <p class="rating-box-${rating}">${car.nota}</p>
                        <p id="rating-text">${rating}</p>
                    </div>
                </div>
                <div class="card-bottom">
                    <div class="logo-marca">
                        <img src="./img/${car.marca.name}.png" alt="">
                    </div>
                    <div class="pago">
                        <p class="price-intro">Precio por 2 días:</p>
                        <p class="card-price">${car.precio}€</p>
                        <p class="cancelacion"><i class="fa-solid fa-check"></i> Cancelar en cualquier momento</p>
                        <button class="button-continuar" type="button" data-id="${car.id}">Alquilar</button>
                    </div>
                </div>
            </div>
        `;
        carList.innerHTML += htmlCoche;
    });
}

/**
 * Lee el contenido del HTML al que le dimos click y lo añade al carrito
 * @param {*} e : evento de usuario
 */
function agregarCoche(e) {
    e.preventDefault();
    let coche;
  
    if (e.target.classList.contains("button-continuar")) {
      coche = e.target.parentElement.parentElement.parentElement;
    } else {
      console.error("Error leyendo datos, no hay coches");
      return false;
    }
  
    const infoCoche = {
      id: e.target.dataset.id, 
      imagen: coche.querySelector(".imagen-coche").src,
      nombre: coche.querySelector(".card-title .nombre").textContent,
      marca: coche.querySelector(".card-title .marca").textContent,
      precio: coche.querySelector(".card-price").textContent,
      cantidad: 1,
    };

    const existe = articulosCarrito.some((coche) => coche.id === infoCoche.id);
    if (existe) {
        const coches = articulosCarrito.map((coche) => {
            if (coche.id === infoCoche.id) {
                coche.cantidad++;
                return coche; 
            } else {
                return coche; 
            }
        });
        console.log("agregarCoche -> coches", coches);
        articulosCarrito = coches;
    } else {
        articulosCarrito.push(infoCoche); 
    }

    console.log(articulosCarrito);
    generarCarritoHTML();
    mostrarAlert();
}

function eliminarCoche(e) {
    if (e.target.classList.contains("borrar-coche")) {
        const cocheId = e.target.getAttribute("data-id");

        articulosCarrito = articulosCarrito.filter((coche) => coche.id !== cocheId);

        generarCarritoHTML();
    }
}

function generarCarritoHTML() {
    contenedorCarrito.innerHTML = "";

    let cantidadTotal = 0;
    let precioTotal = 0;

    articulosCarrito.forEach((coche) => {
        const { imagen, nombre, marca, precio, cantidad, id } = coche; 
        const row = document.createElement("tr");
        row.innerHTML = `
              <td>
                  <img src="${imagen}" width="100">
              </td>
              <td>${nombre}</td>
              <td>${marca}</td>
              <td>${precio}</td>
              <td>
                  <a href="#" class="borrar-coche" data-id="${id}" > X </a>
              </td>
          `;
        precioTotal += precio;
        contenedorCarrito.appendChild(row);

    });

    if (cantidadTotal > 0) {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td colspan="3">Total</td>
          <td>${precioTotal}€</td>
          <td></td>
      `;
        contenedorCarrito.appendChild(row);
    }


    localStorage.setItem("carritoCoches", JSON.stringify(articulosCarrito));
    calcularNumeroCoches();
}

function calcularNumeroCoches() {
    let cantidadTotal = 0;
    articulosCarrito.forEach((item) => (cantidadTotal += item.cantidad));
  
    let numCoches = document.querySelector("#num-coches");
    numCoches.innerHTML = cantidadTotal;
  }

const searchCars = () => {
    if (searchInput.value === "") {
        printCars(carsJSON);
        return;
    }
    const nuevoJSON = carsJSON.filter(e => {
        return (e.nombre.toUpperCase().includes(searchInput.value.toUpperCase())
            || e.marca.name.toUpperCase().includes(searchInput.value.toUpperCase())
        )

    });
    printCars(nuevoJSON);
}

function mostrarAlert() {
    Swal.fire({
      position: "center-center",
      icon: "success",
      title: "Coche añadido al carrito",
      showConfirmButton: false,
      timer: 1500,
    });
  }


