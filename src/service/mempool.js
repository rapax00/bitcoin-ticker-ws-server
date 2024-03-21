const mempoolJS = require("@mempool/mempool.js");

async function getLatestBlock() {
    try {
        const { bitcoin } = mempoolJS();
        const latestBlocks = await bitcoin.blocks.getBlocks({
            start_height: undefined,
            end_height: undefined,
        });
        console.log("Latest block:", latestBlocks[0].height);
        return latestBlocks[0].height;
    } catch (error) {
        console.error("Error fetching latest block:", error);
        return null;
    }
}

module.exports = { getLatestBlock };
