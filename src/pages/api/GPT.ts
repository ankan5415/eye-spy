// /pages/api/guidance.ts

import ElevenLabsAPI from "@/lib/elevenlabs";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const gptRole =
      "I'm a blind person without a cane. You are a camera that has detected several objects in my room and has to tell me what to do next.";
    const userPrePrompt =
      "These are the approximations for where the objects in my room are based on what you, as the camera, can see:";
    const objectLocations = JSON.stringify(req.body);
    // const objectLocations =
    //   "1. Luggage at the bottom of the screen 2. Table on the left 3. Couch on the right.";
    const userPrompt =
      "I am moving forward. Tell me what to do next. Give me a max of one sentence.";

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: gptRole },
        {
          role: "user",
          content: `${userPrePrompt} ${objectLocations} ${userPrompt}`,
        },
      ],
    });

    const text = completion.choices[0].message.content;

    const speechResponse = await ElevenLabsAPI.textToSpeech(
      "21m00Tcm4TlvDq8ikWAM",
      text!
    );

    res.status(200).send(speechResponse);
  } else {
    res.status(405).send("Method Not Allowed");
  }
}
