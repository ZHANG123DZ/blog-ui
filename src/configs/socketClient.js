import PusherJS from "pusher-js";

const socketClient = new PusherJS(import.meta.env.VITE_SOKETI_KEY, {
  cluster: "",
  wsHost: "103.20.96.194",
  wsPort: 6001,
  forceTLS: false,
  encrypted: false,
  disableStats: true,
  enabledTransports: ["ws", "wss"],
});

export default socketClient;
