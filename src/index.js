const WebSocket = require("ws");
const { getLastBlock, getMediumFee } = require("./service/mempool.js");
const {
    getPrice,
    closeConnectionCoinbaseWebSocket,
} = require("./service/coinbase.js");

const port = 8080;
const wss = new WebSocket.Server({ port: port });

wss.on("connection", (ws) => {
    // Send initial data to the client
    ws.send("Welcome to the WebSocket server!");

    ws.on("message", (message) => {
        try {
            const data = JSON.parse(message);
            if (data && typeof data === "object") {
                if (data.action === "want") {
                    console.log("Client wants data:", data);
                    ws.send("Subscribte to the WebSocket server!");
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
    });

    const intervalId = setInterval(async () => {
        if (ws.readyState === WebSocket.OPEN) {
            try {
                ws.send(
                    JSON.stringify({
                        lastBlock: await getLastBlock(),
                        price: await getPrice(),
                        mediumFee: await getMediumFee(),
                    })
                );
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
    });
});

console.log(`WebSocket server is running on port ${port}`);
