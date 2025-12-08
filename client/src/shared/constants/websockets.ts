export const webSocketSettings = {
    withCredentials: true,
    transports: ["websocket"],
    reconnection: true,       // включить авто-подключение
    reconnectionAttempts: 5,  // максимум 5 попыток
    reconnectionDelay: 5000,  // задержка между попытками
}