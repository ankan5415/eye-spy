import ElevenLabsAPI from "@/lib/elevenlabs";
import { sendToAllClients } from "@/lib/websocket"; // Adjust the path as needed
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const text = req.body.data;
  let responsePayload;

  try {
    console.log("here");
    const speechResponse = await ElevenLabsAPI.textToSpeech(
      "21m00Tcm4TlvDq8ikWAM",
      text
    );

    console.log("here");
    responsePayload = { speech: speechResponse.data };

    // Send data via WebSocket
    sendToAllClients(responsePayload);
    console.log("here");
  } catch (error) {
    // console.log(error);
    // @ts-ignore
    responsePayload = { error: error.message || "Error processing request." };
    // sendToAllClients(responsePayload);
  }

  // End the connection after sending the data
  res.status(200).json(responsePayload);
}
