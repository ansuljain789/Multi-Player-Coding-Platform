import { io } from "socket.io-client";

export const initSocket = async () => {
  const token = localStorage.getItem("token"); // or however you store it
  return io("http://localhost:5000", {
    auth: { token },   // pass token during handshake
  });
};



