import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (token: string) => {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL /**|| "http://localhost:5000"**/, {
      auth: { token },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Connected to socket server:", socket?.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });
  }
  return socket;
};

export const getSocket = () => socket;
