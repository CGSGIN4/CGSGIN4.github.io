import { io } from "socket.io-client";
import { fs } from "fs";

async function main() {
  const socket = io();

  // client-side
  socket.on("connect", () => {
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    socket.on("MessageFromServer", function (msg) {
      let tag = document.getElementById("id2");
      console.log(msg);
      let before = tag.value + "\n";
      console.log(`${socket.id} received message ${msg}`);
      tag.value = before + msg;
      tag.scrollTop = tag.scrollHeight;
    });
  });

  socket.on("disconnect", () => {
    console.log(socket.id); // undefined
  });

  document.getElementById("send").onclick = () => {
    function isEmpty(str) {
      if (str.trim() == "") return true;
      return false;
    }
    let value = document.getElementById("id1").value;
    let nick = document.getElementById("nick").value;
    if (
      !isEmpty(value) &&
      !isEmpty(nick) &&
      nick.length <= 15 &&
      value.length <= 150
    ) {
      console.log(`message from client: ${value}`);
      document.getElementById("id1").value = "";
      value = nick + ": " + value;
      value = value.replace(/\n+$/m, "");

      socket.emit("MessageToServer", value);
    }
  };

  document.getElementById("id1").onkeyup = (ev) => {
    if (ev.code === "Enter") {
      function isEmpty(str) {
        if (str.trim() == "") return true;
        return false;
      }
      let value = document.getElementById("id1").value;
      let nick = document.getElementById("nick").value;
      if (
        !isEmpty(value) &&
        !isEmpty(nick) &&
        nick.length <= 15 &&
        value.length <= 150
      ) {
        console.log(`message from client: ${value}`);
        document.getElementById("id1").value = "";
        value = nick + ": " + value;
        socket.emit("MessageToServer", value);
      }
    }
  };
}

window.addEventListener("load", (event) => {
  main();
});
