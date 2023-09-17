import { useEffect, useState } from "react";

function WebSocketComponent() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const ws = new WebSocket("ws://moody-candies-wish.tunnelapp.dev"); // Adjust the URL if your WS server is on a different port

    ws.onopen = () => {
      console.log("Connected to the WebSocket");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessage(data.speech || data.error);
    };

    // Cleanup connection on component unmount
    return () => {
      ws.close();
    };
  }, []);

  return <div>Latest message from server: {message}</div>;
}

export default WebSocketComponent;
