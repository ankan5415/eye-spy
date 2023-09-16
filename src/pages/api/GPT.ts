// /pages/api/guidance.ts

import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// You'd set up the OpenAI API key, model, etc. here based on the library you're using

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
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: gptRole },
        {
          role: "user",
          content: `${userPrePrompt} ${objectLocations} ${userPrompt}`,
        },
      ],
    });

    // console.log(completion.choices[0].message.content);
    // try {
    //   await axios.post(`${process.env.LOCAL_URL}/api/TTS`, {
    //     data: completion.choices[0].message.content,
    //   });
    // } catch (error) {
    //   console.log("Fuck");
    // }
    res.status(200);
  } else {
    res.status(405).send("Method Not Allowed");
  }
}
