from transformers import pipeline

p = pipeline("automatic-speech-recognition")

import gradio as gr

def transcribe(audio):
    text = p(audio)["text"]
    return text