// src/auth.js
export const getUsuario = () => {
    const usuario = localStorage.getItem('usuario')
    return usuario ? JSON.parse(usuario) : null
}

export const isAdmin = () => {
    const usuario = getUsuario()
    return usuario && usuario.tipo === 'admin'
}

export const isPremium = () => {
    const usuario = getUsuario()
    return usuario && usuario.tipo === 'premium'
}

export const isAuthenticated = () => {
    return getUsuario() !== null
}

export const logout = () => {
    localStorage.removeItem('usuario')
    window.location.href = '/login'
}