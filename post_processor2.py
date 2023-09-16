import requests
import numpy as np
import cv2

from service import *

input_image = cv2.imread("input.jpg")

# Create a dictionary with the image in the format expected by BentoML
input_data = {'input_img': input_image}

url = 'http://localhost:5000/predict'  # Replace with the actual URL of your service
response = requests.post(url, files=input_data)

# Check if the request was successful
if response.status_code == 200:
    # Parse the JSON response
    result = response.json()
    
    # Access the bounding boxes and labels
    bounding_boxes = result['Boxes']
    labels = result['Classes']
    
    # Now you can use bounding_boxes and labels as needed
    print("Bounding Boxes:", bounding_boxes)
    print("Labels:", labels)
else:
    print("Error:", response.text)

