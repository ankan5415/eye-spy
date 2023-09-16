// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import ElevenLabsAPI from "@/lib/elevenlabs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const text = req.body;

  const speech = await ElevenLabsAPI.textToSpeech("21m00Tcm4TlvDq8ikWAM", text); //Rachel TTS voice

  res.status(200).json({ speech });
}
