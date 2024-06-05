const WebSocket = require("ws");

let ws;

async function getPrice() {
    return new Promise((resolve, reject) => {
        try {
            if (!ws || ws.readyState === WebSocket.CLOSED) {
                ws = new WebSocket("wss://ws-feed.pro.coinbase.com");

                ws.on("open", () => {
                    console.log("Connected to Coinbase WebSocket.");
                    ws.send(
                        JSON.stringify({
                            type: "subscribe",
                            product_ids: ["BTC-USD"],
                            channels: ["ticker"],
                        })
                    );
                });
            } else {
                ws.on("message", function incoming(data) {
                    const message = JSON.parse(data);
                    if (message.type === "ticker") {
                        resolve(message.price);
                    }
                });
            }
        } catch (error) {
            console.error("Error obtaining:", error);
            reject(error);
        }
    });
}

async function closeConnectionCoinbaseWebSocket() {
    try {
        if (ws && ws.readyState !== WebSocket.CLOSED) {
            console.log("Closing Coinbase WebSocket connection");
            await ws.close();
        }
    } catch (error) {
        console.error("Error closing Coinbase WebSocket connection:", error);
    }
}

module.exports = {
    getPrice,
    closeConnectionCoinbaseWebSocket,
};
