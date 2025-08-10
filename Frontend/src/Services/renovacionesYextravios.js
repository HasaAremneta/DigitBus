import api from "./api";

export function renovarYExtravios(data) {
    return api.post('/renovaciones/renovacion', data);
}

export function solicitudExtravios(data) {
    return api.post('/renovaciones/extravios', data);
}
