// ===== Clase Pedido (igual que la clase CuentaBancaria de tus ejercicios) =====
class Pedido {
    constructor() {
        this.items = [];
    }

    agregar(nombre, tamano, precio) {
        this.items.push({ nombre: nombre, tamano: tamano, precio: precio });
    }

    quitar(indice) {
        this.items.splice(indice, 1);
    }

    vaciar() {
        this.items = [];
    }

    // Ciclo for...in: suma el precio de cada producto (como el ejercicio de depósitos)
    subtotal() {
        let total = 0;
        for (let i in this.items) {
            total = total + this.items[i].precio;
        }
        return total;
    }

    // if/else: aplica el descuento según las visitas del cliente
    calcular(visitas) {
        let subtotal = this.subtotal();
        let descuento = 0;
        let texto = "";

        if (subtotal === 0) {
            texto = "";
        } else if (visitas >= 10) {
            // 10 visitas = unas fresas chicas gratis (se descuenta un tamaño chico del pedido)
            let chico = null;
            for (let i in this.items) {
                if (this.items[i].tamano === "Chico") {
                    chico = this.items[i].precio;
                    break;
                }
            }
            if (chico !== null) {
                descuento = chico;
                texto = "Con 10 visitas, tus fresas chicas van gratis.";
            } else {
                texto = "Con 10 visitas, una fresa chica va gratis. Agrega un tamaño chico.";
            }
        } else if (visitas >= 5) {
            descuento = subtotal * 0.10;
            texto = "Descuento del 10% por tus 5 visitas.";
        } else {
            texto = "Con 5 visitas tienes 10% de descuento.";
        }

        return { subtotal: subtotal, descuento: descuento, total: subtotal - descuento, texto: texto };
    }
}

// ===== Conexión con la página (DOM) =====
let pedido = new Pedido();

const lista = document.getElementById("lista-pedido");
const totalSpan = document.getElementById("total");
const descuentoTexto = document.getElementById("descuento-texto");
const inputVisitas = document.getElementById("visitas");
const mensaje = document.getElementById("mensaje");

const nombresTamano = { "60": "Chico", "80": "Mediano", "100": "Grande" };

function mostrarPedido() {
    lista.innerHTML = "";

    if (pedido.items.length === 0) {
        lista.innerHTML = '<li class="vacio">Aún no has agregado nada.</li>';
    }

    for (let i in pedido.items) {
        let item = pedido.items[i];
        let li = document.createElement("li");
        li.innerHTML = "<span>" + item.nombre + " (" + item.tamano + ") - $" + item.precio + "</span>";

        let boton = document.createElement("button");
        boton.className = "quitar";
        boton.textContent = "Quitar";
        boton.addEventListener("click", function () {
            pedido.quitar(i);
            mostrarPedido();
        });

        li.appendChild(boton);
        lista.appendChild(li);
    }

    let visitas = parseInt(inputVisitas.value) || 0;
    let resultado = pedido.calcular(visitas);
    totalSpan.textContent = "$" + resultado.total;
    descuentoTexto.textContent = resultado.texto;
}

// Botones "Agregar" del menú
const botonesAgregar = document.querySelectorAll("[data-nombre]");
for (let i = 0; i < botonesAgregar.length; i++) {
    botonesAgregar[i].addEventListener("click", function () {
        let nombre = this.dataset.nombre;
        let select = document.getElementById(this.dataset.select);
        let precio = parseInt(select.value);
        pedido.agregar(nombre, nombresTamano[select.value], precio);
        mensaje.textContent = "";
        mostrarPedido();
    });
}

// Cambiar las visitas recalcula el total
inputVisitas.addEventListener("input", mostrarPedido);

// Botón vaciar
document.getElementById("vaciar").addEventListener("click", function () {
    pedido.vaciar();
    mensaje.textContent = "";
    mostrarPedido();
});

// Botón confirmar
document.getElementById("confirmar").addEventListener("click", function () {
    if (pedido.items.length === 0) {
        mensaje.textContent = "Agrega al menos una fresa a tu pedido.";
    } else {
        let visitas = parseInt(inputVisitas.value) || 0;
        let resultado = pedido.calcular(visitas);
        mensaje.textContent = "Pedido confirmado. Total a pagar: $" + resultado.total +
            ". Te esperamos en Av. Ferrocarril Central, col. San Cayetano.";
        pedido.vaciar();
        mostrarPedido();
    }
});

mostrarPedido();
