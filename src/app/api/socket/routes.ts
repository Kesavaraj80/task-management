// import { Server } from "socket.io";

// const SocketHandler = (req: any, res: any) => {
//   if (res.socket && !res.socket.server.io) {
//     const io = new Server(res.socket.server);
//     res.socket.server.io = io;

//     io.on("connection", (socket) => {
//       socket.on("update-task", (task) => {
//         socket.broadcast.emit("update-task", task);
//       });
//     });
//   }
//   res.end();
// };

// export const GET = SocketHandler;
// export const POST = SocketHandler;
