import React, { useState, useRef, useEffect } from "react";
import { Box, Button, Center, Flex, useMediaQuery } from "@chakra-ui/react";
// import "regenerator-runtime/runtime.js";

// import SpeechRecognition, {
//   useSpeechRecognition,
// } from "react-speech-recognition";

import CameraFeed from "@/components/camera";
// import WebSocketComponent from "@/components/Websocket";

// @ts-ignore
export default function Home(props) {
  // const {
  //   transcript,
  //   listening,
  //   resetTranscript,
  //   browserSupportsSpeechRecognition,
  // } = useSpeechRecognition();

  // useEffect(() => {
  //   SpeechRecognition.startListening();
  // }, []);

  // useEffect(() => {
  //   console.log(transcript);
  // }, [transcript]);

  return (
    <Box
      bgImage={{ base: "none" }}
      bgPosition="center"
      bgSize="cover"
      h="100vh"
      w="full"
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Center h="full" w="full" justifyContent={"center"} alignItems={"center"}>
        <CameraFeed />
      </Center>
    </Box>
  );
}
