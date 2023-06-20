const http = require("http");
const express = require("express");
const morgan = require("morgan");
const { Server } = require("socket.io");

const app = express();
app.use(morgan("combined"));
app.use(express.static("."));

//initialize a simple http server
const server = http.createServer(app);
const io = new Server(server);

let clients = [];

let FreeIds = [0, 1, 2, 3, 4, 5, 6, 7];

let tanks = [];
let bullets = [];
let buffs = [];
let data_buf = [tanks, bullets];

io.on("connection", (socket) => {
  clients.push(socket);
  var rand = Math.floor(Math.random() * FreeIds.length);
  socket.emit("ConnectReply", FreeIds[rand]);
  socket.UID = FreeIds[rand];
  console.log(`assigned id ${socket.UID} to ${socket.handshake.address}`);
  FreeIds.splice(rand, 1);

  socket.on("PushData", (data) => {
    tanks[data[0].UID] = data[0];
    bullets[data[0].UID] = data[1];
    for (const client of clients) client.emit("updateSuggest", data_buf);
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected with id: ${socket.id}`);
    const index = clients.indexOf(socket);
    FreeIds.push(socket.UID);
    if (index > -1) {
      clients.splice(index, 1);
      tanks.splice(socket.UID, 1);
    }
  });
  setInterval(function () {
    for (const client of clients) client.emit("updateRequest");
  }, 30);

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  /*
  setInterval(function () {
    let rand = getRandomInt(1000);
    if (rand == 16 || other event values) for (const client of clients) client.emit("event", rand);  
  }, 1000);
  */
});

server.listen(process.env.PORT || 1626, () => {
  console.log(`Server started on port ${server.address().port} :)`);
});
