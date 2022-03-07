const options = {
  cors: true,
  origins: "*:*",
};
module.exports = (server) => {
  global.io = require("socket.io")(server, {
    cors: {
      origin: "*",
    },
  });
  console.log("Socket Initialization");
  // io.set('origins', '*:*');
  io.once("connection", function (client) {
    console.log("Handshake Successful ");
    client.on("disconnect", function () {
      console.log("disconnected");
    });
    client.on("room", function (data) {
      client.join(data.roomId);
      console.log(" Client joined the room and client id is " + client.id);
    });
  });
};
