// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://auafztfoghplfdukuydc.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1YWZ6dGZvZ2hwbGZkdWt1eWRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQ1Nzc4NjksImV4cCI6MjAxMDE1Mzg2OX0.HmHhbaNcV1Y2fVi4KtRPYNdt6F0nnQE73J6JGgyTk9A";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function base64ToBlob(base64: string, contentType = "", sliceSize = 512) {
  // remove data:image/webp;base64, if it exists
  const base64WithoutPrefix = base64.split(",")[1] || base64;

  const byteCharacters = atob(base64WithoutPrefix);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
}

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const response = req.body;
  // const blob = base64ToBlob(response, "image/jpeg");

  // // Upload the image to Supabase Storage
  // console.log("Uploading");
  // console.log("Converted to blob, uploading");

  // const { error, data } = await supabase.storage
  //   .from("htn-test")
  //   .upload(`webcam/image/${new Date().toISOString()}.jpg`, blob);

  // console.log(error, data);

  console.log(response);
  res.status(200).json({ name: "John Doe" });
}
