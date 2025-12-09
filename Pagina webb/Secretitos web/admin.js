// =================== LOCALSTORAGE HELPER ===================
function cargarLS(key, defaultValue) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : defaultValue;
    } catch (e) {
        return defaultValue;
    }
}

// =================== SESIÓN ===================
let currentUser = cargarLS('sesionActiva', null);

if (!currentUser || currentUser.rol !== 'Admin') {
    alert("Acceso denegado. Solo administradores.");
    window.location.href = "index.html"; // Página de login
}

// =================== CARGAR USUARIOS ===================
function cargarUsuarios() {
    const usuarios = cargarLS('usuarios', []);
    const tbodyUsuarios = document.querySelector('#tablaUsuarios tbody');
    tbodyUsuarios.innerHTML = '';
    usuarios.forEach(u => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${u.user}</td>
            <td>${u.email}</td>
            <td>${u.rol}</td>
        `;
        tbodyUsuarios.appendChild(tr);
    });
}

// =================== CARGAR COMPRAS ===================
function cargarCompras() {
    const usuarios = cargarLS('usuarios', []);
    const tbodyCompras = document.querySelector('#tablaCompras tbody');
    tbodyCompras.innerHTML = '';
    usuarios.forEach(u => {
        const carrito = cargarLS('carrito_' + (u.user || u.usuario || u.nombre), []);
        carrito.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${u.user}</td>
                <td>${item.titulo}</td>
                <td>${item.cantidad}</td>
                <td>S/ ${(item.precio * item.cantidad).toFixed(2)}</td>
            `;
            tbodyCompras.appendChild(tr);
        });
    });
}

// =================== LOGOUT ===================
document.getElementById('logoutAdmin').addEventListener('click', () => {
    localStorage.removeItem('sesionActiva');
    window.location.href = 'index.html';
});

// =================== INICIALIZAR ===================
cargarUsuarios();
cargarCompras();
