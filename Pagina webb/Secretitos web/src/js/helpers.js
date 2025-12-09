// =================== LOCALSTORAGE HELPER ===================
export function guardarLS(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function cargarLS(key, defaultValue) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : defaultValue;
    } catch (e) {
        return defaultValue;
    }
}
