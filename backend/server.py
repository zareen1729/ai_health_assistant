from flask import Flask, request, jsonify
from flask_cors import CORS
from backend_config import *  # Ensure this has API keys or other configs
from ollama_inference import ollama_inference
from bridgeit_openai_inference import openai_inference
import time

app = Flask(__name__)
CORS(app)

@app.route('/api/chat', methods=['POST'])
def chat_handler():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Invalid JSON request"}), 400

    prompt = data.get('code')
    model_name = data.get('model', 'gpt-4o').lower()
    tasks = data.get('tasks', {})

    if not prompt:
        return jsonify({"error": "Health input is required."}), 400

    # Select model inference function
    if model_name == 'llama3':
        model_fn = lambda input_prompt: ollama_inference(input_prompt, "llama3")
    elif model_name in ['gpt-4', 'gpt-4o']:
        model_fn = lambda input_prompt: openai_inference(input_prompt, model_name)
    else:
        return jsonify({"error": f"Unsupported model '{model_name}'."}), 400

    # Define prompt type for health use case
    health_prompt_prefix = (
        "You are an AI health assistant. Analyze the following patient symptoms and medical details. "
        "Provide a preliminary analysis, list possible conditions, and recommend if they should consult a specialist."
        "\n\nPatient Report:\n"
    )

    results = {}

    try:
        if tasks.get('codeReview'):  # Only respond if this task is flagged
            full_prompt = f"{health_prompt_prefix}{prompt}"

            response = model_fn(full_prompt)

            # Extract usable response depending on model structure
            if isinstance(response, dict):
                if "choices" in response:
                    results["codeReview"] = response["choices"][0]["message"]["content"].strip()
                elif "content" in response:
                    results["codeReview"] = response["content"].strip()
                elif "error" in response:
                    results["codeReview"] = f"Error: {response['error']}"
                else:
                    results["codeReview"] = str(response)
            else:
                results["codeReview"] = str(response).strip()

            time.sleep(1)

        return jsonify({"response": results}), 200

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Exception occurred: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(debug=True, port=8001)
