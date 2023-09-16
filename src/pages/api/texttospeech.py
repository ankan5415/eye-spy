import pyttsx3

text_speech = pyttsx3.init()

answer = input("Text: ")
text_speech.say(answer)
text_speech.runAndWait()