// socket.js
const socketIo = require("socket.io");

const setupSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: true,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Socket ${socket.id} connected`);

    socket.on("userJoined", (data) => {
      io.emit("userJoinedMessage", `${data.name} has joined`);
    });

    socket.on("userDonation", (user) => {
      // Send a message to the sender

      // Broadcast to all other users (excluding sender)
      socket.broadcast.emit(
        "userDonationMessage",
        `Thanks to ${user.name} for donating $${user.amount}`
      );

      console.log(`${user.name} has Donated ${user.amount}`);
    });

    socket.on("disconnect", () => {
      console.log(`Socket ${socket.id} disconnected`);
    });
  });
};

module.exports = setupSocket;
