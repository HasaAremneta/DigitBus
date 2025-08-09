import api  from "./api";

export function solicitudRegistro(data) {
    return api.post('/solicitudes/crear', data);
}