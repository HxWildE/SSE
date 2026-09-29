const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {

    // Serve frontend
    if (req.url === "/") {
        const html = fs.readFileSync("./index.html");

        res.writeHead(200, {
            "Content-Type": "text/html"
        });

        res.end(html);
        return;
    }

    // SSE endpoint
    if (req.url === "/events") {

        res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive"
        });

        console.log("SSE client connected");

        let price = 100;

        res.write(`data: ${JSON.stringify({
            price,
            time: new Date().toISOString()
        })}\n\n`);

        const interval = setInterval(() => {

            price += (Math.random() - 0.5) * 5;

            const event = {
                price: Number(price.toFixed(2)),
                time: new Date().toISOString()
            };

            console.log("Sending:", event);

            res.write(`data: ${JSON.stringify(event)}\n\n`);

        }, 1000);

        req.on("close", () => {
            clearInterval(interval);
            console.log("SSE client disconnected");
        });

        return;
    }

    res.writeHead(404);
    res.end("Not Found");
});

server.listen(3000, () => {
    console.log("Server: http://localhost:3000");
});