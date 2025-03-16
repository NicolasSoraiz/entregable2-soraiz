// Obtener saldo desde LocalStorage o inicializarlo
let saldo = localStorage.getItem("saldo") ? Number(localStorage.getItem("saldo")) : 5000;
let stock = localStorage.getItem("stock") ? JSON.parse(localStorage.getItem("stock")) : [];


// Obtener elementos del DOM
const saldoElemento = document.getElementById("saldo");
const listaNotebooks = document.getElementById("Lista-notebooks");

// Verificar que los elementos existen antes de usarlos
if (!saldoElemento || !listaNotebooks) {
    console.error("Error: No se encontraron los elementos en el DOM.");
} else {
    // Mostrar saldo inicial
    saldoElemento.innerText = `Saldo disponible: $${saldo}`;

    // Cargar los productos desde productos.json si `stock` no es un array o está vacío
    if (!Array.isArray(stock) || stock.length === 0) {
        fetch("./json/productos.json")
            .then(response => response.json())
            .then(data => {
                stock = data;
                localStorage.setItem("stock", JSON.stringify(stock)); 
                actualizarLista();
            })
            .catch(error => console.error("Error al cargar el JSON:", error));
    } else {
        actualizarLista(); 
    }
}

// Función para actualizar la lista de notebooks en la interfaz
function actualizarLista() {
    saldoElemento.innerText = `Saldo disponible: $${saldo}`;
    listaNotebooks.innerHTML = ''; 

    stock.forEach((notebook, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${notebook.nombre} - Precio: $${notebook.precio} - Stock: ${notebook.stock}
            <button class="comprar-btn" data-index="${index}">Comprar</button>
        `;
        listaNotebooks.appendChild(li);
    });

    // Conectar los botones de compra en la lista
    document.querySelectorAll(".comprar-btn").forEach(boton => {
        boton.addEventListener("click", (event) => {
            event.preventDefault();
            const index = parseInt(boton.getAttribute("data-index"));
            comprarNotebook(index);
        });
    });
}

// Función para comprar una notebook
function comprarNotebook(index) {
    let notebook = stock[index];

    if (notebook.stock > 0 && saldo >= notebook.precio) {
        saldo -= notebook.precio;
        notebook.stock--;

        // Guardar cambios en localStorage
        localStorage.setItem("saldo", saldo);
        localStorage.setItem("stock", JSON.stringify(stock));

        // Actualizar la interfaz
        actualizarLista();
    } else {
        alert("No puedes comprar este modelo. Verifica el stock y tu saldo.");
    }
}







