const express = require("express");
const http = require("http");
const app = express();
const cors = require("cors")
const server = http.createServer(app);
const socket = require("socket.io");
const io = require("socket.io")(server, {
  cors: {
    origin: "https://localhost:3000",
    method: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.emit("me", socket.id);

  socket.on("disconnet", () => {
    socket.broadcast.emit("CallEnded");
  });

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("callUser", {
      signal: data.signalData,
      from: data.from,
      name: data.name,
    });
  });

  socket.on(
    "answerCall",
    (data) => io.to(data.to).emit("CallAccepted"),
    data.signal
  );
});

server.listen(5000, () => console.log("server is running on port 5000"));
