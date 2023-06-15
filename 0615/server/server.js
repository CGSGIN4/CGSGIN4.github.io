const http = require("http");
const express = require("express");
const morgan = require("morgan");
const { Server } = require("socket.io");
const fs = require("fs");

const app = express();
app.use(morgan("combined"));
app.use(express.static("."));

//initialize a simple http server
const server = http.createServer(app);
const io = new Server(server);

const clients = [];

io.on("connection", (socket) => {
  clients.push(socket);
  console.log(`Client connected with id: ${socket.id}`);
  socket.on("MessageToServer", (msg) => {
    const replyMsg = msg;
    console.log(replyMsg);

    let fileContent = fs.readFileSync("../dist/chat.txt", "utf8");
    fs.appendFileSync("../dist/chat.txt", replyMsg);

    for (client of clients) {
      client.emit("MessageFromServer", replyMsg);
      continue;
    }
  });
  socket.on("disconnect", () => {
    console.log(`Client disconnected with id: ${socket.id}`);
    const index = clients.indexOf(socket);
    if (index > -1) {
      clients.splice(index, 1);
    }
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port ${server.address().port} :)`);
});
