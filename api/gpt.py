import openai
from http.server import BaseHTTPRequestHandler
from dotenv import load_dotenv
load_dotenv()

openai.api_key = os.getenv('OPENAI_API_KEY')


gpt_role = "I'm a blind person without a cane. You are a camera that has detected several objects in my room and has to tell me what to do next."
user_pre_prompt = "These are the approximations for where the objects in my room are based on what you, as the camera, can see:"
object_locations = "1. Luggage at the bottom of the screen 2. Table on the left 3. Couch on the right."
user_prompt = "I am moving forward. Tell me what to do next"

class handler(BaseHTTPRequestHandler):

    def do_GET(self):
        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
            {"role": "system", "content": gpt_role},
            {"role": "user", "content": f'{user_pre_prompt} {object_locations} {user_prompt}'}
            ]
        )
        
        self.send_response(200)
        self.send_header('Content-type','text/plain')
        self.end_headers()
        self.wfile.write(completion.choices[0].message.encode('utf-8'))
        return
    