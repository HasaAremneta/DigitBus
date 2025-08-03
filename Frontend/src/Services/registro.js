import api from "./api";

export function registroUsuario(data) {
    return api.post('/usuarios/registro', data);
}