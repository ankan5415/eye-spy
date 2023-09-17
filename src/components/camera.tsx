import React, { useEffect, useRef, useCallback, useState } from "react";
import Webcam from "react-webcam";
import { Box, Button, Center, Text } from "@chakra-ui/react";
import EasySpeech from "easy-speech";
// @ts-ignore
import { useSpeechSynthesis } from "react-speech-kit";

const CameraFeed: React.FC = () => {
  const [text, setText] = useState("");
  const [hasEnabledVoice, setHasEnabledVoice] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const { speak } = useSpeechSynthesis();

  const videoConstraints = {
    width: 500,
    height: 500,
  };

  useEffect(() => {
    window.speechSynthesis.getVoices();
  }, []);

  const capture = async () => {
    const imageSrc = webcamRef.current?.getScreenshot();

    speak({ text: "" });
    if (imageSrc) {
      const response = await fetch("/api/processImage", {
        method: "POST",
        body: imageSrc,
      });

      const d = await response.text();
      setText(d);
      speak({ text: d });
    }
  };

  setInterval(() => {
    capture();
  }, 12000);

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
          videoConstraints={{
            ...videoConstraints,
            facingMode: { ideal: "environment" },
          }}
        />
      </Box>

      <Button onClick={capture}>Capture</Button>
    </Center>
  );
};

export default CameraFeed;
