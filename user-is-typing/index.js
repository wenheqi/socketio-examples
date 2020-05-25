const express = require("express");
const socketio = require("socket.io");

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/", express.static("public"));

const server = app.listen(PORT, () => {
  console.log(`server listening on PORT ${PORT}`);
});

const io = socketio(server);

io.on("connection", (socket) => {
  console.log(`socket ${socket.id} connected`);
  io.emit("sys message", { socketId: socket.id, isConnected: true });
  socket.on("chat message", (payload) => {
    socket.broadcast.emit("chat message", payload);
  });
  socket.on("disconnect", () => {
    console.log(`socket id ${socket.id} is disconnected`);
    io.emit("sys message", { socketId: socket.id, isConnected: false });
  });
  socket.on("user typing", (data) => {
    socket.broadcast.emit("user typing", data);
  });
});
