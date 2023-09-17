import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
// @ts-ignore
import { useSpeechSynthesis } from "react-speech-kit";

// @ts-ignore
export default function Home(props) {
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

    speak({ text: "" });

    if (imageSrc) {
      const response = await fetch("/api/processImage", {
        method: "POST",
        body: imageSrc,
      }).then((res) => res.text());

      if (response) {
        setText(response);
        speak({ text: response });
      } else {
        setText("Something went wrong, please try again");
      }
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
    <div>
      <div className="w-full flex h-screen items-center justify-center">
        <Webcam
          className="rounded-full"
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            ...videoConstraints,
            facingMode: { ideal: "environment" },
          }}
        />

        {text && <p className="mt-3">{text}</p>}
      </div>
    </div>
  );
}
