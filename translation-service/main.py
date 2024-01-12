import deepl
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()
auth_key = os.getenv("AUTH_KEY")
translator = deepl.Translator(auth_key)

app = Flask(__name__)
CORS(app)


@app.route('/translate', methods=['POST'])
def echo():
    data = request.json  # Assuming the input is in JSON format
    if 'message' in data:
        translation_result = translator.translate_text(data['message'], target_lang="EN-GB")
        translation_text = str(translation_result)
        print(f"Translated {data['message']} into {translation_text}")
        return jsonify({'translation': translation_text})
    else:
        return jsonify({'error': 'Missing "message" parameter'}), 400


if __name__ == '__main__':
    app.run(debug=True)
