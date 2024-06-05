# Simple WebSocket Server

A simple WebSocket server that sends Bitcoin data to the client every 5 seconds.

## Features

Get from [coibase.com](https://docs.cdp.coinbase.com/prime/docs/websocket-feed/):

> API WebSocket connection.

-   Bitcoin Price

Get from [mempool.space](https://mempool.space/docs/api/rest):

> API REST connection.

-   Last block hegith
-   Medium fee

## Setup

1. Use the Node.js version specified in the `.nvmrc` file. (Install it if you don't have it installed yet.)

    ```bash
    nvm use
    ```

2. Install the dependencies.

    ```bash
    pnpm install
    ```

3. Run the server.

    ```bash
     pnpm dev
    ```

## Conection

From your client, connect to the WebSocket server and send a message to subscribe it.

Subscribing message:

```json
{ "action": "want" }
```

Responses:

-   Successfull message:

    ```
    Subscribte to the WebSocket server!
    ```

-   Data every 5 seconds:

    ```json
    {
    	"lastBlock": <string>,
    	"price": <string>,
    	"mediumFee": <string>
    }
    ```
