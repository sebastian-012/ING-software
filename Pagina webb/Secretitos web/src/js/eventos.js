import { comprarElemento, comprarDetalle } from "./carrito.js";
import { loginForm, registerForm } from "./usuarios.js";

document.addEventListener("click", e => {
    if (e.target.closest(".agregar-carrito")) {
        comprarElemento(e);
    }
});
