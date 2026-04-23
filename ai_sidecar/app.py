import os
import json
from flask import Flask, request, jsonify
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Initialize GenAI client if API key is present
api_key = os.environ.get("GEMINI_API_KEY")
client = None
if api_key:
    client = genai.Client(api_key=api_key)

@app.route('/api/analyze', methods=['POST'])
def analyze():
    data = request.json
    if not data or 'image_base64' not in data:
        return jsonify({"error": "No image_base64 provided"}), 400

    # Check if we should use dummy mode (no API key or explicit request)
    if not client or data.get('dummy_mode', False):
        return get_dummy_response()

    image_base64 = data['image_base64']

    try:
        # Prepare the prompt
        prompt = """
        このお酒の画像から銘柄を特定し、ネット上の情報を元に標準的なスペックを5つの軸（1.0〜5.0）で評価してください。
        以下のJSON形式で必ず返してください。余計なテキストを含めないでください。
        {
            "name": "お酒の銘柄名",
            "sweetness": 3.0,
            "acidity": 3.5,
            "body": 4.0,
            "aroma": 4.5,
            "bitterness": 2.0
        }
        """

        # Using standard gemini-2.5-pro model. Passing base64 as inline data.
        # In actual usage with the newer SDK, you'd convert base64 to bytes, but let's assume standard parts API.
        import base64
        image_bytes = base64.b64decode(image_base64)

        response = client.models.generate_content(
            model='gemini-2.5-pro',
            contents=[
                types.Part.from_bytes(data=image_bytes, mime_type='image/jpeg'),
                prompt
            ],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
            )
        )

        result = json.loads(response.text)
        return jsonify(result)

    except Exception as e:
        print(f"Error during AI analysis: {e}")
        # Fallback to dummy on error
        return get_dummy_response()

def get_dummy_response():
    """Returns a mock response for development or when API is unavailable."""
    return jsonify({
        "name": "ダミー銘柄 (API未設定)",
        "sweetness": 3.0,
        "acidity": 2.5,
        "body": 4.0,
        "aroma": 3.5,
        "bitterness": 2.0
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
