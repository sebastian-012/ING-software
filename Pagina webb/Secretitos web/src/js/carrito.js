import { cargarLS, guardarLS } from "./helpers.js";
import { products } from "./productos.js";
import { currentUser } from "./usuarios.js";

const lista = document.querySelector('#lista-carrito tbody');
const cartCount = document.getElementById("cart-count");
const totalEl = document.getElementById("cart-total");

function getCartKey() {
    const user = currentUser ? (currentUser.user || currentUser.usuario || currentUser.nombre) : "guest";
    return "carrito_" + user;
}

let cartKey = getCartKey();
export let carritoItems = cargarLS(cartKey, []);

export function saveCart() {
    guardarLS(cartKey, carritoItems);
    renderCart();
}

export function renderCart() {
    lista.innerHTML = "";

    carritoItems.forEach(item => {
        const tr = document.createElement("tr");
        const precio = Number(item.precio);
        const total = precio * item.cantidad;

        tr.innerHTML = `
            <td><img src="${item.imagen}" width="60"></td>
            <td>${item.titulo}</td>
            <td>S/ ${precio.toFixed(2)}</td>
            <td><input class="cart-qty" type="number" min="1" value="${item.cantidad}" data-id="${item.id}"></td>
            <td>S/ ${total.toFixed(2)}</td>
            <td><a href="#" class="borrar" data-id="${item.id}">X</a></td>
        `;

        lista.appendChild(tr);
    });

    updateCartSummary();
}

function updateCartSummary() {
    const total = carritoItems.reduce((acc, el) => acc + el.precio * el.cantidad, 0);
    const count = carritoItems.reduce((acc, el) => acc + el.cantidad, 0);

    cartCount.textContent = count;
    totalEl.textContent = "S/ " + total.toFixed(2);
}

export function insertarCarrito(info) {
    const id = Number(info.id);
    let item = carritoItems.find(p => p.id === id);

    if (item) {
        item.cantidad++;
    } else {
        carritoItems.push({
            id,
            cantidad: 1,
            precio: Number(info.precio.replace(/[^0-9.]/g, "")),
            imagen: info.imagen,
            titulo: info.titulo
        });
    }

    saveCart();
}
