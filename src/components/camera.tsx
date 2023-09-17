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
  const [timer, setTimer] = useState(0);

  const videoConstraints = {
    width: 500,
    height: 500,
  };

  useEffect(() => {
    window.speechSynthesis.getVoices();
  }, []);

  const capture = async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    console.log(timer);
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
    setTimer(0);
  };

  useEffect(() => {
    if (timer > 5) {
      capture();
      setTimer(0);
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [timer]);

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
