import PusherJS from "pusher-js";
PusherJS.logToConsole = true;
const socketClient = new PusherJS("2f6cdd2a7f0e4b6b8a51dc82e7e9e370", {
  cluster: "",
  wsHost: "103.20.96.194",
  wsPort: 6001,
  forceTLS: false,
  encrypted: false,
  disableStats: true,
  enabledTransports: ["ws", "wss"],
});

export default socketClient;
