// import { useEffect, useRef } from "react";
// import { DefaultEventsMap } from "socket.io";
// import io, { Socket } from "socket.io-client";

// export default function useSocket() {
//   const socketRef = useRef<null | Socket<DefaultEventsMap, DefaultEventsMap>>(
//     null
//   );

//   useEffect(() => {
//     socketRef.current = io();

//     return () => {
//       if (socketRef.current) {
//         socketRef.current.disconnect();
//       }
//     };
//   }, []);

//   return socketRef;
// }
