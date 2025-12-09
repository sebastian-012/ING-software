// =================== LOCALSTORAGE HELPER ===================
function guardarLS(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function cargarLS(key, defaultValue) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : defaultValue;
    } catch (e) {
        return defaultValue;
    }
}

// =================== USUARIOS INICIALES ===================
let usuarios = cargarLS('usuarios', []);

// Crear usuario admin inicial si no existe
if (!usuarios.some(u => u.rol === 'Admin')) {
    usuarios.push({
        nombre: 'Administrador',
        usuario: 'admin',
        email: 'admin@gmail.com',
        pass: '12345678',
        rol: 'Admin'
    });
    guardarLS('usuarios', usuarios);
}

// =================== VARIABLES GLOBALES ===================
const loginFormContainer = document.getElementById("login");
const registerFormContainer = document.getElementById("registro");
const loginForm = document.querySelector("#login form");
const registerForm = document.querySelector("#registro form");
const loginUsuario = document.getElementById("loginUsuario");
const loginPass = document.getElementById("loginPass");
const regEmail = document.getElementById("regEmail");
const regUser = document.getElementById("regUser");
const regPass = document.getElementById("regPass");
const regPass2 = document.getElementById("regPass2");
const errorLogin = document.getElementById("errorLogin");
const errorRegistro = document.getElementById("errorRegistro");
const msgEmail = document.getElementById("msgEmail");

const detalleProducto = document.getElementById('detalle-producto');
const carrito = document.getElementById('carrito');
const lista = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
const elementos1 = document.getElementById('lista-1');
const searchInput = document.getElementById('search');
const suggestions = document.getElementById('suggestions');
const loadMoreBtn = document.getElementById('load-more');
const userInfo = document.getElementById('user-info');
const welcomeMsg = document.getElementById('welcome-msg');
const logoutBtn = document.getElementById('logout-btn');
const btnAbrir = document.querySelector('.btnAbrir');
const adminMenu = document.getElementById('admin-menu'); // panel admin opcional

let currentUser = cargarLS('sesionActiva', null);
let currentItem = 4; // cuántos productos se muestran inicialmente

// =================== PRODUCTOS ===================
const products = [
    { id: 1, name: "Refresco", price: 100, image: "src/assets/imagen4.jpeg", porciones: "1", descripcion: "Bebida refrescante de sabor único." },
    { id: 2, name: "Torta", price: 100, image: "src/assets/imagen2.jpeg", porciones: "1", descripcion: "Deliciosa torta casera, ideal para cualquier ocasión." },
    { id: 3, name: "Torta de chocolate", price: 100, image: "src/assets/imagen5.jpeg", porciones: "2", descripcion: "Exquisita torta de chocolate con cobertura de cacao puro." },
    { id: 4, name: "Torta de tres leches", price: 100, image: "src/assets/imagen3.jpeg", porciones: "2", descripcion: "Torta suave y húmeda con mezcla de tres tipos de leche." },
    { id: 5, name: "Refresco", price: 100, image: "src/assets/imagen4.jpeg", porciones: "1", descripcion: "Bebida refrescante de sabor único." },
    { id: 6, name: "Torta", price: 100, image: "src/assets/imagen2.jpeg", porciones: "1", descripcion: "Deliciosa torta casera, ideal para cualquier ocasión." },
    { id: 7, name: "Torta de chocolate", price: 100, image: "src/assets/imagen5.jpeg", porciones: "2", descripcion: "Exquisita torta de chocolate con cobertura de cacao puro." },
    { id: 8, name: "Torta de tres leches", price: 100, image: "src/assets/imagen3.jpeg", porciones: "2", descripcion: "Torta suave y húmeda con mezcla de tres tipos de leche." }
];

// =================== FUNCIONES MOSTRAR/OCULTAR FORMULARIOS ===================
function mostrarLogin() {
    if (registerFormContainer) registerFormContainer.style.display = "none";
    if (loginFormContainer) loginFormContainer.style.display = "flex";
}

function mostrarRegistro() {
    if (loginFormContainer) loginFormContainer.style.display = "none";
    if (registerFormContainer) registerFormContainer.style.display = "flex";
}

function cerrarForm() {
    if (loginFormContainer) loginFormContainer.style.display = "none";
    if (registerFormContainer) registerFormContainer.style.display = "none";
}

// =================== VER/Ocultar contraseña ===================
function verPass(id) {
    const campo = document.getElementById(id);
    if (!campo) return;
    campo.type = campo.type === "password" ? "text" : "password";
}

// =================== VALIDACIÓN EMAIL TIEMPO REAL ===================
if (regEmail) {
    regEmail.addEventListener("input", () => {
        const email = regEmail.value.trim();
        const regex = /^[^\s@]+@(gmail\.com|hotmail\.com)$/i;
        msgEmail.textContent = regex.test(email) ? "✓ Correo válido" : "Debe terminar en @gmail.com o @hotmail.com";
    });
}

// =================== LOGIN ===================
if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const usuario = loginUsuario.value.trim();
        const pass = loginPass.value;
        if (errorLogin) { errorLogin.textContent = ""; errorLogin.classList.remove("success", "error"); }

        if (!usuario || !pass) {
            if (errorLogin) { errorLogin.textContent = "Todos los campos son obligatorios."; errorLogin.classList.add("error"); }
            return;
        }

        const usuariosLS = cargarLS("usuarios", []);
        const encontrado = usuariosLS.find(u =>
            ((u.email && u.email.toLowerCase() === usuario.toLowerCase()) ||
            (u.user && u.user.toLowerCase() === usuario.toLowerCase()) ||
            (u.usuario && u.usuario.toLowerCase() === usuario.toLowerCase())) &&
            u.pass === pass
        );

        if (!encontrado) {
            if (errorLogin) { errorLogin.textContent = "Datos incorrectos."; errorLogin.classList.add("error"); }
            return;
        }

        guardarLS("sesionActiva", encontrado);
            currentUser = encontrado;

            // Si es administrador, redirigir al panel admin
            if (encontrado.rol === 'Admin') {
                window.location.href = 'admin.html'; // redirige a admin.html
                return; // salir para que no siga cargando el carrito
            }

            // Si es cliente normal, sigue el flujo
            cerrarForm();
            mostrarUsuario(encontrado);
            cargarCarrito();

    });
}

// =================== REGISTRO ===================
if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = regEmail.value.trim();
        const user = regUser.value.trim();
        const pass = regPass.value;
        const pass2 = regPass2.value;
        if (errorRegistro) errorRegistro.textContent = "";

        const regex = /^[^\s@]+@(gmail\.com|hotmail\.com)$/i;
        if (!regex.test(email)) { if (errorRegistro) errorRegistro.textContent = "Correo inválido."; return; }
        if (user.length < 3) { if (errorRegistro) errorRegistro.textContent = "El nombre de usuario debe tener mínimo 3 caracteres."; return; }
        if (pass.length < 8) { if (errorRegistro) errorRegistro.textContent = "La contraseña debe tener mínimo 8 caracteres."; return; }
        if (pass !== pass2) { if (errorRegistro) errorRegistro.textContent = "Las contraseñas no coinciden."; return; }

        const usuariosLS = cargarLS("usuarios", []);
        if (usuariosLS.some(u => u.email === email)) { if (errorRegistro) errorRegistro.textContent = "Este correo ya está registrado."; return; }

        usuariosLS.push({ nombre: user, usuario: user, user: user, email, pass, rol: 'Cliente' });
        guardarLS("usuarios", usuariosLS);
        alert("Cuenta creada correctamente.");
        mostrarLogin();
        registerForm.reset();
    });
}

// =================== COMPRAR ELEMENTO (DELEGACIÓN) ===================
function comprarElemento(e) {
    const target = e.target;
    const agregar = target.closest && target.closest('.agregar-carrito');
    if (!agregar) return;

    e.preventDefault();
    if (!currentUser) {
        mostrarLogin();
        return;
    }

    const box = agregar.closest('.box');
    if (!box) return;

    const infoProducto = {
        imagen: box.querySelector('img') ? box.querySelector('img').src : '',
        titulo: box.querySelector('h3') ? box.querySelector('h3').textContent : 'Producto',
        precio: box.querySelector('.precio') ? box.querySelector('.precio').textContent : '',
        id: agregar.dataset.id || ''
    };
    insertarCarrito(infoProducto);
}

// =================== COMPRAR DESDE DETALLE ===================
function comprarDetalle(e) {
    const agregar = e.target.closest && e.target.closest('.agregar-carrito');
    if (!agregar) return;
    e.preventDefault();
    if (!currentUser) { mostrarLogin(); return; }

    const box = agregar.closest('.box-detalle');
    if (!box) return;

    const productName = box.querySelector('h3') ? box.querySelector('h3').textContent : '';
    const product = products.find(p => p.name === productName);
    if (!product) return;

    insertarCarrito({
        imagen: product.image,
        titulo: product.name,
        precio: "S/ " + product.price.toFixed(2),
        id: product.id
    });
}

// =================== CARRITO ===================
function getCartKey() {
    const userKey = currentUser && (currentUser.user || currentUser.usuario || currentUser.nombre) ? (currentUser.user || currentUser.usuario || currentUser.nombre) : 'guest';
    return 'carrito_' + userKey;
}

let cartKey = getCartKey();
let carritoItems = cargarLS(cartKey, []);

function saveCart() {
    guardarLS(cartKey, carritoItems);
    renderCart();
}

function renderCart() {
    if (!lista) return;
    lista.innerHTML = '';
    carritoItems.forEach(item => {
        const tr = document.createElement('tr');
        const precioNum = Number(item.precio) || 0;
        const importe = (precioNum * Number(item.cantidad)).toFixed(2);
        tr.innerHTML = `
            <td><img src="${item.imagen}" alt="" style="width:60px; height:auto;"></td>
            <td>${item.titulo}</td>
            <td>${item.descripcion || ''}</td>
            <td>S/ ${Number(precioNum).toFixed(2)}</td>
            <td><input class="cart-qty" type="number" min="1" value="${item.cantidad}" data-id="${item.id}"></td>
            <td>S/ ${importe}</td>
            <td><a href="#" class="borrar" data-id="${item.id}">X</a></td>
        `;
        lista.appendChild(tr);
    });
    updateCartSummary();
}

function updateCartSummary() {
    const countEl = document.getElementById('cart-count');
    const totalEl = document.getElementById('cart-total');
    const total = carritoItems.reduce((sum, it) => sum + (Number(it.precio) * Number(it.cantidad)), 0);
    const count = carritoItems.reduce((c, it) => c + Number(it.cantidad), 0);
    if (countEl) countEl.textContent = count;
    if (totalEl) totalEl.textContent = 'S/ ' + total.toFixed(2);
}

function insertarCarrito(elemento) {
    const id = Number(elemento.id) || 0;
    const prod = products.find(p => p.id === id) || {};
    const rawPrecio = elemento.precio !== undefined ? String(elemento.precio) : (prod.price !== undefined ? String(prod.price) : '0');
    const price = Number(rawPrecio.replace(/[^0-9\.]/g, '')) || 0;

    const existente = carritoItems.find(i => Number(i.id) === id && id !== 0);
    if (existente) {
        existente.cantidad = Number(existente.cantidad) + 1;
    } else {
        const newId = id === 0 ? Date.now() : id;
        carritoItems.push({
            id: newId,
            imagen: elemento.imagen || prod.image || '',
            titulo: elemento.titulo || prod.name || 'Producto',
            descripcion: prod.descripcion || elemento.descripcion || '',
            precio: price,
            cantidad: 1
        });
    }
    saveCart();
}

function eliminarElemento(e) {
    const borrar = e.target.closest && e.target.closest('.borrar');
    if (!borrar) return;
    e.preventDefault();
    const id = Number(borrar.dataset.id);
    carritoItems = carritoItems.filter(i => Number(i.id) !== id);
    saveCart();
}

function handleQtyChange(e) {
    if (!e.target.classList.contains('cart-qty')) return;
    const id = Number(e.target.dataset.id);
    const val = Math.max(1, Number(e.target.value) || 1);
    const item = carritoItems.find(i => Number(i.id) === id);
    if (item) {
        item.cantidad = val;
        saveCart();
    }
}

function vaciarCarrito(e) {
    if (e) e.preventDefault();
    carritoItems = [];
    saveCart();
}

function cargarCarrito() {
    cartKey = getCartKey();
    carritoItems = cargarLS(cartKey, []);
    renderCart();
}

// =================== EVENTOS ===================
if (elementos1) elementos1.addEventListener('click', comprarElemento);
if (detalleProducto) detalleProducto.addEventListener('click', comprarDetalle);
if (lista) {
    lista.addEventListener('click', eliminarElemento);
    lista.addEventListener('input', handleQtyChange);
}
if (vaciarCarritoBtn) vaciarCarritoBtn.addEventListener('click', vaciarCarrito);

// =================== BUSCADOR ===================
if (searchInput && suggestions) {
    searchInput.addEventListener('input', () => {
        const query = (searchInput.value || '').trim().toLowerCase();
        suggestions.innerHTML = '';
        if (!query) { suggestions.style.display = 'none'; return; }

        const filtered = products.filter(p => p.name.toLowerCase().includes(query));
        filtered.forEach(product => {
            const item = document.createElement('div');
            item.classList.add('suggestion-item');
            item.innerHTML = `
                <img src="${product.image}" alt="${product.name}" style="width:50px; height:auto;">
                <div class="sugg-txt">
                    <h4>${product.name}</h4>
                    <p>S/ ${product.price.toFixed(2)}</p>
                </div>
            `;
            item.addEventListener('click', () => {
                suggestions.innerHTML = '';
                suggestions.style.display = 'none';
                detalleProducto.innerHTML = `
                    <div class="box-detalle">
                        <img src="${product.image}" alt="${product.name}">
                        <div>
                            <h3>${product.name}</h3>
                            <p class="precio">S/ ${product.price.toFixed(2)}</p>
                            <p class="porciones">Porciones: ${product.porciones}</p>
                            <p class="descripcion">${product.descripcion}</p>
                            <input type="number" min="1" max="10" value="1" class="cantidad">
                            <a href="#" class="agregar-carrito btn-3" data-id="${product.id}">Agregar al carrito</a>
                        </div>
                    </div>
                `;
                detalleProducto.scrollIntoView({ behavior: 'smooth' });
            });
            suggestions.appendChild(item);
        });
        suggestions.style.display = filtered.length ? 'block' : 'none';
    });

    document.addEventListener('click', e => {
        const target = e.target;
        if (target === searchInput) return;
        if (suggestions.contains(target)) return;
        suggestions.style.display = 'none';
    });
}

// =================== CARGAR MÁS ===================
(function initBoxes() {
    const boxes = [...document.querySelectorAll('.box-container .box')];
    boxes.forEach((b, i) => { b.style.display = i >= currentItem ? 'none' : 'inline-block'; });
    if (boxes.length <= currentItem && loadMoreBtn) loadMoreBtn.style.display = 'none';
})();
if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        const boxes = [...document.querySelectorAll('.box-container .box')];
        const nextLimit = currentItem + 4;
        for (let i = currentItem; i < nextLimit && i < boxes.length; i++) boxes[i].style.display = 'inline-block';
        currentItem += 4;
        if (currentItem >= boxes.length) loadMoreBtn.style.display = 'none';
    });
}

// =================== USUARIO LOGUEADO ===================
function mostrarUsuario(usuario) {
    if (!usuario) return;
    welcomeMsg.textContent = `Bienvenido, ${usuario.user || usuario.usuario || usuario.nombre}`;
    if (userInfo) userInfo.style.display = 'flex';
    if (btnAbrir) btnAbrir.style.display = 'none';
    if (usuario.rol === 'Admin' && adminMenu) adminMenu.style.display = 'block';
    if (usuario.rol !== 'Admin' && adminMenu) adminMenu.style.display = 'none';
}

function cerrarSesion() {
    localStorage.removeItem('sesionActiva');
    userInfo.style.display = 'none';
    if (btnAbrir) btnAbrir.style.display = 'inline-block';
    currentUser = null;
    if (adminMenu) adminMenu.style.display = 'none';
    cargarCarrito();
}

if (logoutBtn) logoutBtn.addEventListener('click', cerrarSesion);

// =================== INICIALIZAR ===================
(function init() {
    if (loginFormContainer) loginFormContainer.style.display = "none";
    if (registerFormContainer) registerFormContainer.style.display = "none";
    currentUser = cargarLS('sesionActiva', null);
    if (currentUser) mostrarUsuario(currentUser);
    cargarCarrito();
})();

// =================== SLIDER AUTOMÁTICO ===================
const slides = document.querySelectorAll('.slide');
let currentSlide = 0;
function nextSlide() {
    if (slides.length === 0) return;
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}
if (slides.length > 0) setInterval(nextSlide, 4000);
