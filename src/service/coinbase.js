const WebSocket = require("ws");

async function connectToCoinbaseWebSocket() {
    return new Promise((resolve, reject) => {
        const ws = new WebSocket("wss://ws-feed.exchange.coinbase.com");

        ws.on("open", function open() {
            console.log("Conexión establecida con el WebSocket de Coinbase");
            // Subscribirse al canal de precios de Bitcoin
            ws.send(
                JSON.stringify({
                    type: "subscribe",
                    product_ids: ["BTC-USD"],
                    channels: ["ticker_batch"],
                })
            );
        });

        ws.on("message", function incoming(data) {
            const message = JSON.parse(data);
            if (message.type === "ticker") {
                console.log("Precio de Bitcoin (USD):", message.price);
                // Resuelve la promesa con el precio de Bitcoin
                resolve(message.price);
                // Cierra la conexión después de recibir el precio (opcional)
                ws.close();
            }
        });

        ws.on("error", function error(err) {
            console.error(
                "Error en la conexión con el WebSocket de Coinbase:",
                err
            );
            // Rechaza la promesa en caso de error
            reject(err);
        });
    });
}

module.exports = {
    connectToCoinbaseWebSocket,
};
