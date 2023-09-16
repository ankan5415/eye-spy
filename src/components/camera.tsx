import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { Box, Button, Center, useInterval } from "@chakra-ui/react";
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

const CameraFeed: React.FC = () => {
  const webcamRef = useRef(null);
  const videoConstraints = {
    facingMode: { exact: "environment" },
    width: 1280,
    height: 720,
  };

  const capture = React.useCallback(async () => {
    // @ts-ignore
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      const blob = base64ToBlob(imageSrc, "image/jpeg");
      const { error, data } = await supabase.storage
        .from("htn-test")
        .upload(`webcam/image/${new Date().toISOString()}.jpg`, blob);
      console.log("Captured data");
    }
  }, [webcamRef]);

  useInterval(capture, 3000);

  return (
    <Center h="full" w="full" justifyContent={"center"} alignItems={"center"}>
      <Box
        width="300px"
        height="300px"
        borderRadius="lg"
        overflow="hidden"
        position={"relative"}
      >
        <Webcam
          audio={false}
          height="100%"
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width="100%"
          videoConstraints={videoConstraints}
        />
      </Box>
    </Center>
  );
};

export default CameraFeed;
