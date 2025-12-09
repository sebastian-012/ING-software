import { mostrarUsuario, currentUser } from "./usuarios.js";
import { startSlider } from "./sliders.js";
import { cargarCarrito } from "./carrito.js";

if (currentUser) {
    mostrarUsuario(currentUser);
}

cargarCarrito();
startSlider();
