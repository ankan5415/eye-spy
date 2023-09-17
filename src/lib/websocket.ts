// /server/websocketServer.js
import WebSocket from "ws";
// @ts-ignore
let wss;
// @ts-ignore
export function startWebSocketServer(server) {
  wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("Client connected");
  });
}
// @ts-ignore
export function sendToAllClients(data) {
  // @ts-ignore
  if (!wss) {
    console.error("WebSocket server has not been initialized.");
    return;
  }

  // @ts-ignore
  wss.clients.forEach((client) => {
    client.send(JSON.stringify(data));
  });
}
