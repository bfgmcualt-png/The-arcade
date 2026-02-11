const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Welcome to The Arcade 🎮");
});

const players = {};

io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);

  players[socket.id] = { x: 100, y: 100 };

  io.emit("updatePlayers", players);

  socket.on("move", (data) => {
    players[socket.id] = data;
    io.emit("updatePlayers", players);
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
    io.emit("updatePlayers", players);
  });
});

server.listen(PORT, () => {
  console.log("The Arcade running...");
});
