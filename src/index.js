const WebSocket = require("ws");
const { getLatestBlock } = require("./service/mempool.js");
const { connectToCoinbaseWebSocket } = require("./service/coinbase.js");

const port = 8080;
const wss = new WebSocket.Server({ port: port });

wss.on("connection", (ws) => {
    // Send initial data to the client
    ws.send("Welcome to the WebSocket server!");

    // Handle incoming messages from this client
    ws.on("message", (message) => {
        console.log("Received message:", message.toString("utf8"));

        // Send a response to the client
        ws.send("Message received successfully!");

        try {
            const data = JSON.parse(message);
            if (data && typeof data === "object") {
                // Check the content of the message and perform actions accordingly
                if (data.action === "want") {
                    // Definir una función asíncrona para poder utilizar await
                    const processData = async () => {
                        // Esperar la respuesta de las funciones antes de enviar el mensaje
                        const lastBlock = await getLatestBlock();
                        const price = await connectToCoinbaseWebSocket();

                        // Enviar el mensaje con los resultados
                        ws.send(
                            JSON.stringify({
                                lastBlock: lastBlock,
                                price: price,
                            })
                        );
                    };

                    // Llamar a la función asíncrona para procesar los datos
                    processData();
                } else {
                    // Handle other types of messages
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

        if (ws.readyState === WebSocket.OPEN) {
            const processData = async () => {
                // Esperar la respuesta de las funciones antes de enviar el mensaje
                const lastBlock = await getLatestBlock();
                const price = await connectToCoinbaseWebSocket();

                // Enviar el mensaje con los resultados
                ws.send(
                    JSON.stringify({
                        lastBlock: lastBlock,
                        price: price,
                    })
                );
            };

            // Llamar a la función asíncrona para procesar los datos
            setInterval(processData, 5000);
        }
    });

    // Handle client disconnection
    ws.on("close", () => {
        ws.send("Connection closed!");
    });
});

console.log(`WebSocket server is running on port ${port}`);
