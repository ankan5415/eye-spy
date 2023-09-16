import axios, { AxiosResponse } from "axios";

class ElevenLabsAPI {
  private static BASE_URL: string =
    "https://api.elevenlabs.io/v1/text-to-speech";
  private static HEADERS: any = {
    accept: "audio/mpeg",
    "Content-Type": "application/json",
    "xi-api-key": process.env.ELEVEN_API_KEY!,
  };

  public static async textToSpeech(
    voiceId: string,
    text: string
  ): Promise<AxiosResponse> {
    const url = `${this.BASE_URL}/${voiceId}`;
    const data = {
      text: text,
      model_id: "eleven_monolingual_v1",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.5,
      },
    };

    return await axios.post(url, data, {
      headers: this.HEADERS,
    });
  }
}

export default ElevenLabsAPI;
