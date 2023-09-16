import React, { useState, useRef, useEffect } from "react";
import { Box, Button, Center, Flex, useMediaQuery } from "@chakra-ui/react";
import CameraFeed from "@/components/camera";

// @ts-ignore
export default function Home(props) {
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
