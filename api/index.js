// api/index.js
const WebSocket = require("ws");
const { getLastBlock } = require("./service/mempool.js");
const {
    getPrice,
    closeConnectionCoinbaseWebSocket,
} = require("./service/coinbase.js");

const wss = new WebSocket.Server({ noServer: true });

// Aumentar el límite de listeners si es necesario
require("events").EventEmitter.defaultMaxListeners = 20;

wss.on("connection", (ws) => {
    ws.send("Welcome to the WebSocket server!");

    const onMessage = (message) => {
        try {
            const data = JSON.parse(message);
            if (data && typeof data === "object") {
                if (data.action === "want") {
                    console.log("Client wants data:", data);
                    ws.send("Subscribe to the WebSocket server!");
                } else {
                    console.log("Unrecognized message:", data);
                    ws.send("Unrecognized message!");
                }
            } else {
                console.log("Message is not a valid JSON object:", message);
                ws.send("Message is not a valid JSON object!");
            }
        } catch (error) {
            console.error("Error parsing JSON message:", error);
            ws.send("Error parsing JSON message!");
        }
    };

    ws.on("message", onMessage);

    const intervalId = setInterval(async () => {
        if (ws.readyState === WebSocket.OPEN) {
            try {
                const lastBlock = await getLastBlock();
                const price = await getPrice();
                ws.send(JSON.stringify({ lastBlock, price }));
                console.log("Data sent to the client!");
            } catch (error) {
                console.error("Error sending data to the client:", error);
                ws.send("Error sending data to the client!");
            }
        } else {
            console.log("WebSocket is not open!");
            clearInterval(intervalId);
        }
    }, 5000);

    ws.on("close", () => {
        console.log("WebSocket is closed!");
        closeConnectionCoinbaseWebSocket();
        clearInterval(intervalId);
        ws.off("message", onMessage); // Remove the message listener
    });

    ws.on("error", (error) => {
        console.error("WebSocket error:", error);
        closeConnectionCoinbaseWebSocket();
        clearInterval(intervalId);
        ws.off("message", onMessage); // Remove the message listener
    });
});

module.exports = (req, res) => {
    if (
        req.url === "/ws" &&
        req.headers.upgrade &&
        req.headers.upgrade.toLowerCase() === "websocket"
    ) {
        wss.handleUpgrade(req, req.socket, Buffer.alloc(0), (ws) => {
            wss.emit("connection", ws, req);
        });
    } else {
        res.status(200).send("WebSocket server is running");
    }
};

console.log(`WebSocket server is running`);
