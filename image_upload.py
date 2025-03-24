import base64
import requests
import sys
import requests

file_path = sys.argv[1]
file_name = file_path.split('/')[-1]

file_encoded = None
with open(file_path, "rb") as image_file:
    file_encoded = base64.b64encode(image_file.read()).decode('utf-8')

r_json = { 'name': file_name, 'type': 'image', 'isPublic': True, 'data': file_encoded, 'parentId': sys.argv[3] }
r_headers = { 'X-Token': sys.argv[2] }

try:
    r = requests.post("http://localhost:5000/files", json=r_json, headers=r_headers)
    print(f"Response status code: {r.status_code}")
    print(f"Response text: {r.text}")

    # Handle 413 error specifically
    if r.status_code == 413:
        print("Payload too large. Consider reducing the file size.")

    # Attempt to parse JSON response
    print(r.json())

except requests.exceptions.RequestException as e:
    print(f"An error occurred: {e}")

