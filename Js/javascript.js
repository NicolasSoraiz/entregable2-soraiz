// Obtener saldo desde LocalStorage o inicializarlo
let saldo = localStorage.getItem("saldo") ? Number(localStorage.getItem("saldo")) : 5000;
let stock = localStorage.getItem("stock") ? JSON.parse(localStorage.getItem("stock")) : [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
// Obtener elementos del DOM
const saldoElemento = document.getElementById("saldo");
const listaNotebooks = document.getElementById("Lista-notebooks");
const contenedorDestacados = document.getElementById("contenedor-productos-destacados");
const contenedorProductos = document.getElementById("contenedor-productos");
const listaCarrito = document.getElementById("lista-carrito");
const finalizarCompraBtn = document.getElementById("finalizar-compra-btn");
// Verificar que los elementos existen antes de usarlos
if (!saldoElemento || !listaNotebooks || !contenedorDestacados || !contenedorProductos) {
    console.error("Error: No se encontraron los elementos en el DOM.");
} else {
    // Mostrar saldo inicial
    saldoElemento.innerText = `Saldo disponible: $${saldo}`;
// Cargar productos desde JSON si el stock está vacío
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
    contenedorDestacados.innerHTML = '';
    contenedorProductos.innerHTML = '';
// Dividir productos en destacados y normales
    const productosDestacados = stock.slice(0, 3); 
    const productosNormales = stock.slice(3, 6);
// Función para renderizar productos
function renderizarProductos(lista, contenedor, offset) {
    lista.forEach((notebook, index) => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img src="${notebook.imagen}" alt="${notebook.nombre}">
            <h3>${notebook.nombre}</h3>
            <p><strong>Precio:</strong> $${notebook.precio}</p>
            <p><strong>Stock:</strong> ${notebook.stock}</p>
            <a href="#" class="boton agregar-carrito-btn" data-index="${index + offset}">Agregar al carrito</a>
            <a href="#" class="boton comprar-btn" data-index="${index + offset}">Comprar</a> 
        `;
        contenedor.appendChild(div);
    });
}
// Renderizar los productos en sus respectivas secciones con el offset correcto
renderizarProductos(productosDestacados, contenedorDestacados, 0);
renderizarProductos(productosNormales, contenedorProductos, 3);
}
// Manejar compras dinámicamente
document.body.addEventListener("click", (event) => {
    if (event.target.classList.contains("comprar-btn")) {
        event.preventDefault();
        const index = parseInt(event.target.getAttribute("data-index"));
        comprarNotebook(index);
    }
    if (event.target.classList.contains("agregar-carrito-btn")) {
        event.preventDefault();
        const index = parseInt(event.target.getAttribute("data-index"));
        agregarAlCarrito(index);
    }
    if (event.target.classList.contains("cancelar-compra")) {
        const index = parseInt(event.target.getAttribute("data-index"));
        cancelarCompra(index);
    }
});
// Funcion para agregar al carrito
function agregarAlCarrito(index) {
    const notebook = stock[index];
    if (notebook.stock > 0) {
        notebook.stock -= 1;
        carrito.push({ ...notebook });
        localStorage.setItem("carrito", JSON.stringify(carrito));
        localStorage.setItem("stock", JSON.stringify(stock));
        mostrarCarrito();
        actualizarLista();
        Swal.fire({
            title: "Agregado al carrito",
            text: `${notebook.nombre} fue agregado al carrito.`,
            icon: "success",
            confirmButtonText: "Aceptar"
        });
    } else {
        Swal.fire({
            title: "Sin stock",
            text: "Este producto no tiene stock disponible.",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });
    }
}
function mostrarCarrito() {
    listaCarrito.innerHTML = "";
    if (carrito.length === 0) {
        listaCarrito.innerHTML = "<li>El carrito está vacío</li>";
        return;
    }
    carrito.forEach((producto, i) => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${producto.nombre} - $${producto.precio}
            <button class="cancelar-compra" data-index="${i}">❌ Cancelar</button>
        `;
        listaCarrito.appendChild(li);
    });
}
// Mostrar al cargar
mostrarCarrito();
function cancelarCompra(index) {
    const productoCancelado = carrito[index];
    const productoOriginal = stock.find(p => p.nombre === productoCancelado.nombre);
    if (productoOriginal) {
        productoOriginal.stock += 1;
    }
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    localStorage.setItem("stock", JSON.stringify(stock));
    mostrarCarrito();
    actualizarLista();
    Swal.fire({
        title: "Producto eliminado",
        text: "El producto fue eliminado del carrito y el stock fue actualizado",
        icon: "info",
        confirmButtonText: "Aceptar"
    });
}
// Función para comprar una notebook
function comprarNotebook(index) {
    let notebook = stock[index];
    if (notebook.stock > 0 && saldo >= notebook.precio) {
        saldo -= notebook.precio;
        notebook.stock--;
        localStorage.setItem("saldo", saldo);
        localStorage.setItem("stock", JSON.stringify(stock));
        actualizarLista();
        Swal.fire({
            title: "Compra Exitosa",
            text: `Has comprado ${notebook.nombre} por $${notebook.precio}`,
            icon: "success",
            confirmButtonText: "Aceptar"
        });
    } else {
        Swal.fire({
            title: "Error",
            text: "No puedes comprar este modelo. Verifica el stock y tu saldo.",
            icon: "error",
            confirmButtonText: "Aceptar"
        });
    }
}
// Finalizar compra
finalizarCompraBtn.addEventListener("click", () => {
    if (carrito.length === 0) {
        Swal.fire({
            title: "Carrito vacío",
            text: "Agrega productos antes de finalizar la compra.",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });
        return;
    }
    const total = carrito.reduce((acc, prod) => acc + prod.precio, 0);
    if (saldo >= total) {
        saldo -= total;
        carrito = [];
        localStorage.setItem("saldo", saldo);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        mostrarCarrito();
        actualizarLista();
        Swal.fire({
            title: "Compra Finalizada",
            text: `Gracias por tu compra. Total: $${total}`,
            icon: "success",
            confirmButtonText: "Aceptar"
        });
    } else {
        Swal.fire({
            title: "Saldo insuficiente",
            text: `Tu saldo es de $${saldo} y el total del carrito es $${total}`,
            icon: "error",
            confirmButtonText: "Aceptar"
        });
    }
});