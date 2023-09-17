import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import OpenAI from "openai";
import ElevenLabsAPI from "@/lib/elevenlabs";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const imageData = req.body;

  try {
    console.log("Analyzing");
    const response = await axios(
      "https://big-suits-give.tunnelapp.dev/invocation",
      {
        method: "POST",
        data: imageData,
      }
    );

    const gptRole =
      "I'm a blind person without a cane. You are a camera that has detected several objects in my room and has to tell me what to do next.";
    const userPrePrompt =
      "These are the approximations for where the objects in my room are based on what you, as the camera, can see:";
    const userPrompt =
      "I am moving forward. Tell me what to do next. Give me a max of one sentence.";
    const objectLocations = response.data;

    console.log("Got text");
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: gptRole },
        {
          role: "user",
          content: `${userPrePrompt} ${objectLocations} ${userPrompt}`,
        },
      ],
    });

    const text = completion.choices[0].message.content;

    // console.log("Creating speech response");
    // const speechResponse = await ElevenLabsAPI.textToSpeech(
    //   "21m00Tcm4TlvDq8ikWAM",
    //   text!
    // ).catch((error) => console.log(error));

    // console.log(speechResponse);

    // res.status(200).send(speechResponse.data);
    res.status(200).send(text);
  } catch (error: any) {
    res.status(500).send(`Something went wrong: ${error.message}`);
  }
}
