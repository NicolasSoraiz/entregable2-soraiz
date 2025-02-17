// Definimos los modelos de notebooks con su precio y stock inicial //
const notebooks = [
    { nombre: "Notebook Acer Aspire", precio: 1200, stock: 10},
    { nombre: "Notebook Lenovo Thinkpad L15", precio: 1000, stock: 10},
    { nombre: "Notebook Gamer Acer Nitro 5", precio: 1500, stock: 10},
    { nombre: "Notebook LOQ Gen 9", precio: 1300, stock: 10},
    { nombre: "Notebook Asus TUF Gaming A15", precio: 1400, stock: 10}
];

// Saldo inicial del usuario //
let saldo = 5000;

// Funcion para mostrar el stock y saldo actual 
function mostrarEstado() {
    console.clear();
    console.log("Saldo disponible: $" + saldo);
    console.log("Stock de notebook:");
    notebooks.forEach((notebook, index) => {
        console.log(`${index + 1}. ${notebook.nombre} - Precio: $${notebook.precio} - Stock: ${notebook.stock}`);
    });
    alert("consulta la consola para ver tu saldo y el stock de notebooks.");
}

// Funcion para comprar una notebook //
function comprarNotebook() {
    mostrarEstado();
    let eleccion = prompt("ingrese el numero de la notebook que desea comprar (1-5) o 0 para salir:");
    let index = parseInt(eleccion) -1;
    if (index >= 0 && index < notebooks.length) {
        let notebook = notebooks[index];
        if (notebook.stock > 0 && saldo >= notebook.precio) {
            notebook.stock--;
            saldo -= notebook.precio;
            alert("Compra exitosa! has comprado " + notebook.nombre);
        } else {
            alert("No puedes comprar este modelo. verifica el stock y tu saldo.");
        }
    } else if (Number(eleccion) !== "0") {
        alert("Opcion no valida.");
    }
}

// Funcion para salir del simulador //
function salirSimulador() {
    alert("Gracias por usar el simulador. ¡Hasta la proxima!");
}