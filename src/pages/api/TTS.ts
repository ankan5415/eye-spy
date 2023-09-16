// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import ElevenLabsAPI from "@/lib/elevenlabs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const text = req.body.data;
  let speech = "";
  res.status(200).json({ speech });
  try {
    const data = await ElevenLabsAPI.textToSpeech("21m00Tcm4TlvDq8ikWAM", text); //Rachel TTS voice
  } catch (error: any) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
    }
  }

  res.status(200).json({ speech });
}
