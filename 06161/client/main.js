import { io } from "socket.io-client";
import { GetData, InitGame } from "./game.js";
import { ProvideData } from "./game.js";

async function main() {
  const socket = io();

  // client-side
  socket.on("connect", () => {
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    socket.on("ConnectReply", function (id) {
      if (id != -1) InitGame(id);
    });

    socket.on("updateRequest", function () {
      socket.emit("PushData", ProvideData());
    });

    socket.on("updateSuggest", function (data_buf) {
      GetData(data_buf);
    });
  });

  socket.on("disconnect", () => {
    console.log(socket.id); // undefined
  });
}

window.addEventListener("load", (event) => {
  main();
});
