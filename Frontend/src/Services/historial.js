import api from "./api";

export function obtenerHistorial() {
    return api.get('/historial');
}

// export function obtenerHistorialPorTarjeta(idTarjeta){
//     return api.get(`/historial/tarjeta/${idTarjeta}`);
// }