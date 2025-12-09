import { products } from "./productos.js";

const searchInput = document.getElementById("search");
const suggestions = document.getElementById("suggestions");
const detalleProducto = document.getElementById("detalle-producto");

if (searchInput) {
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        suggestions.innerHTML = "";

        if (!query) {
            suggestions.style.display = "none";
            return;
        }

        const filtered = products.filter(p => p.name.toLowerCase().includes(query));

        filtered.forEach(product => {
            const div = document.createElement("div");
            div.classList.add("suggestion-item");
            div.innerHTML = `
                <img src="${product.image}" width="50">
                <div>
                    <h4>${product.name}</h4>
                    <p>S/ ${product.price}</p>
                </div>
            `;

            div.onclick = () => {
                suggestions.innerHTML = "";
                suggestions.style.display = "none";

                detalleProducto.innerHTML = `
                    <div class="box-detalle">
                        <img src="${product.image}">
                        <h3>${product.name}</h3>
                        <p>S/ ${product.price}</p>
                        <a href="#" class="agregar-carrito" data-id="${product.id}">Agregar</a>
                    </div>
                `;
            };

            suggestions.appendChild(div);
        });

        suggestions.style.display = "block";
    });
}
