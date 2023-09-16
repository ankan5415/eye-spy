import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { Box, Button, Center, useInterval } from "@chakra-ui/react";

function base64ToBlob(base64: string, contentType = "", sliceSize = 512) {
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
    width: 500,
    height: 500,
  };

  const capture = React.useCallback(async () => {
    // @ts-ignore
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      const blob = base64ToBlob(imageSrc, "image/jpeg");
      // const { error, data } = await supabase.storage
      //   .from("htn-test")
      //   .upload(`webcam/image/${new Date().toISOString()}.jpg`, blob);

      await fetch("https://big-suits-give.tunnelapp.dev/invocation", {
        method: "POST",
        body: imageSrc,
      });
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
