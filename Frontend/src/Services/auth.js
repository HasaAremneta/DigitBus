import api from "./api";

export async function login(NombreUsuario, password) {
    return api.post('/auth/login', { NombreUsuario, password });
}
