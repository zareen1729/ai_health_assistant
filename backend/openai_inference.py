import openai
import traceback
import requests
import base64
import json
from openai import AzureOpenAI
from backend_config import *

def get_callback_function_list():
    return [  
        {
            "name": "search_hotels",
            "description": "Retrieves hotels from the search index based on the parameters provided",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {"type": "string", "description": "The location of the hotel (i.e. Seattle, WA)"},
                    "max_price": {"type": "number", "description": "The maximum price for the hotel"},
                    "features": {"type": "string", "description": "A comma separated list of features"}
                },
                "required": ["location"]
            }
        }
    ]

def openai_inference(prompt, model="gpt-4o"):
    try:
        # Get OAuth2 access token
        payload = "grant_type=client_credentials"
        credentials = base64.b64encode(f'{client_id}:{client_secret}'.encode('utf-8')).decode('utf-8')
        headers = {
            "Accept": "*/*",
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": f"Basic {credentials}"
        }

        token_response = requests.post(url, headers=headers, data=payload)
        token_response.raise_for_status()
        access_token = token_response.json().get('access_token')

        openai.api_key = access_token

        client = AzureOpenAI(
            azure_endpoint=azure_endpoint,
            api_key=access_token,
            api_version=api_version
        )

        messages = [{"role": "user", "content": prompt}]

        response = client.chat.completions.create(
            model=model,
            messages=messages,
            user=f'{{"appkey": "{app_key}"}}',
            functions=get_callback_function_list(),
            function_call="auto"
        )

        return response.choices[0].message

    except Exception as e:
        return {"error": str(e), "traceback": traceback.format_exc()}
