import express from "express";
import { botName, PORT } from "./consts";
import { join } from "path";
import { createServer } from "http";
import socketio from "socket.io";
import { formatData } from "./utils/formatData";
import { getUser, getUsersInRoom, userJoin, userLeave } from "./user";

/*
  -- NOTE -- 
  - if the message is to be sent to everyone except the current user, who is connected to a particular io [socket], then we should emit socket.broadcast [socket's broadcast object].
  - if the message is to be sent to everyone, then we should emit the io [socketio server object]
  - if the message is to be sent to only the user, then we should emit the socket [socket object]

  --- SUB NOTE ---

  -- socket holds the info on the current client
  -- socket.broadcast holds the info on all other clients except the current client
  -- io holds info on all the clients 

  in a given web-socket based server.


*/

const main = async () => {
  const app = express();
  const server = createServer(app);

  const io = new socketio.Server(server);

  io.on("connection", (socket) => {
    socket.on("joinRoom", ({ username, room }) => {
      socket.emit("message", formatData(botName, "Welcome to ChatCord!"));

      userJoin(socket.id, username, room);

      socket.join(room);

      io.to(room).emit("updateRoomUsers", getUsersInRoom(room));

      socket.broadcast
        .to(room)
        .emit(
          "message",
          formatData(botName, `${username} has joined the room`)
        );
    });

    socket.on("newMessage", (message: string) => {
      const user = getUser(socket.id);
      const { username, room } = user ? user : { username: "", room: "" };

      io.to(room).emit("message", formatData(username, message));
    });

    // VERY IMPORTANT! //
    socket.on("disconnect", () => {
      const user = getUser(socket.id);
      const { username, room } = user ? user : { username: "", room: "" };

      userLeave(socket.id);

      io.to(room).emit("updateRoomUsers", getUsersInRoom(room));

      io.to(room).emit(
        "message",
        formatData(botName, `${username} has left the room!`)
      );
    });
  });

  app.use(express.static(join(__dirname, "../public")));

  server.listen(PORT, () =>
    console.log(`Server started at http://localhost:${PORT}`)
  );
};

main();
