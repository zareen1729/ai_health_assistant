import requests
from backend_config import *

def get_health_advice_from_ai(symptoms_description, model_name="gpt-4"):
    """
    Calls OpenAI to get health guidance based on user-provided symptoms.
   
    Args:
        symptoms_description (str): The symptoms entered by the user.
        model_name (str): OpenAI model to use (default is GPT-4).
   
    Returns:
        str: Health assistant's guidance or error message.
    """
    print("🔍 Querying AI Health Assistant...")
   
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }
   
    prompt_text = f"You are an AI health assistant. Help a user understand their symptoms and suggest if they need to seek medical help. Keep it simple, clear, and non-alarming.\n\nSymptoms: {symptoms_description}"
   
    payload = {
        "model": model_name,
        "messages": [{"role": "user", "content": prompt_text}],
        "temperature": 0.3
    }
   
    try:
        response = requests.post(OPENAI_CHAT_COMPLETION_URL, headers=headers, json=payload)
        response.raise_for_status()
        response_json = response.json()
       
        ai_response = response_json['choices'][0]['message']['content']
        print(f"✅ AI Health Assistant Response: {ai_response}")
       
        return ai_response
   
    except requests.exceptions.RequestException as e:
        error_message = f"⚠️ Unable to fetch advice at the moment. Error: {str(e)}"
        print(error_message)
        return error_message
