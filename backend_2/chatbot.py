import google.generativeai as genai
import pandas as pd
import spacy
import os
import warnings
from sentence_transformers import SentenceTransformer, util
import threading

import logging
logging.getLogger("transformers.modeling_utils").setLevel(logging.ERROR)

# Suppress FutureWarning
warnings.filterwarnings("ignore", category=FutureWarning, module="huggingface_hub.file_download")

# Disable Tokenizers Parallelism
os.environ["TOKENIZERS_PARALLELISM"] = "false"

# Configure Generative AI API
genai.configure(api_key='AIzaSyB_QEu_vwhGMfVhXpSXKwozrjOaHIGvwu8')
model = genai.GenerativeModel("gemini-1.5-flash-latest")

# Placeholder for models
nlp = None
sentence_model = None

# Function to load models in the background
def load_models():
    global nlp, sentence_model
    # Load SpaCy model
    nlp = spacy.load('en_core_web_sm')
    # Load Sentence Transformer model for better sentence embeddings
    sentence_model = SentenceTransformer('all-MiniLM-L6-v2')
    # Precompute intent embeddings
    intent_embeddings.update({intent: sentence_model.encode(phrases) for intent, phrases in intents.items()})

# Start background loading
threading.Thread(target=load_models).start()

# Function to load customer data
def load_customer_data():
    return pd.read_csv('data/customer_data.csv')

# Quick response intents and responses
quick_responses = {
    'greeting': ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'],
    'unrelated': ['how to cry', 'how to sleep', 'what is the weather']
}

# Predefined intents and responses
intents = {
    'payment steps paypal': ['steps of payment paypal', 'how to pay with paypal', 'paypal payment process', 'paypal payment steps'],
    'payment steps credit card': ['steps of payment credit card', 'how to pay with credit card', 'credit card payment process', 'credit card payment steps'],
    'payment steps bank transfer': ['steps of payment bank transfer', 'how to pay with bank transfer', 'bank transfer payment process', 'bank transfer payment steps'],
    'payment failure': ['why is my payment failing', 'payment failed', 'why did my payment fail', 'payment not going through', 'payment issue'],
    'wrong product': ['wrong product', 'defect product', 'broken product', 'received a wrong product', 'incorrect product', 'damaged product'],
    'payment methods': ['what are the payment methods', 'available payment methods', 'payment options', 'ways to pay'],
    'how to do payment': ['how to do payment', 'make a payment', 'payment process', 'how to pay'],
    'refund time': ['when will i get a refund', 'refund time', 'refund duration', 'how long for refund', 'refund processing time', 'time it will take to refund', 'refund take time'],
    'refund initiated': ['refund initiated', 'is my refund started', 'refund status', 'has my refund started', 'refund process'],
    'order details': ['give all details of order id', 'details of my order', 'order information', 'order specifics', 'order summary'],
    'order status': ['what is the status of order id', 'order status', 'order state', 'current status of my order'],
    'billing date': ['what is the billing date of order id', 'when did i purchase order id', 'purchase date', 'billing date', 'date of billing'],
    'price paid': ['what is the price paid for order id', 'amount paid for order id', 'order cost', 'order price'],
    'refund eligibility': ['will i get a refund for order id', 'refund eligibility', 'can i get a refund', 'refund policy', 'refund for defect product', 'refund for damaged product'],
    'transaction id': ['what is the transaction id of order id', 'transaction id for my order', 'order transaction id'],
    'refund transaction id': ['what is the transaction id for refund of order id', 'refund transaction id', 'transaction id for refund'],
    'refund issue': ['why did i not get my refund', 'refund issue', 'problem with refund', 'refund not received'],
    'refund eligibility': ['i got a defect product, will i get a refund', 'i got a damaged product, will i get a refund', 'defect product refund', 'damaged product refund']
}

# Placeholder for intent embeddings
intent_embeddings = {}

# Function to preprocess user input
def preprocess_input(user_input):
    return user_input.lower().strip()

# Function to generate a chatbot response using Gemini API
def generate_response(user_input):
    response = model.chat(messages=[{"role": "user", "content": user_input}])
    return response[0]['content']

# Function to get response from customer data
def get_customer_response(order_id, query_type):
    customer_data = load_customer_data()  # Reload customer data
    customer_order = customer_data[customer_data['order_id'] == order_id]

    if customer_order.empty:
        return f"Sorry, I couldn't find any order details for the order ID {order_id}. Please check the order ID and try again."
    else:
        order_details = customer_order.to_dict(orient='records')[0]
        if query_type == 'payment status':
            return f"Payment Status for Order ID {order_id}: {order_details['payment_status']}"
        elif query_type == 'product delivered':
            return f"Product Delivered for Order ID {order_id}: {'Yes' if order_details['product_delivered'] else 'No'}"
        elif query_type == 'cash back':
            return f"Cash Back for Order ID {order_id}: {order_details['cash_back']}"
        elif query_type == 'billing date':
            return f"Billing Date for Order ID {order_id}: {order_details['billing_date']}"
        elif query_type == 'price paid':
            return f"Price Paid for Order ID {order_id}: {order_details['price_paid']}"
        elif query_type == 'refund transaction id':
            if pd.isna(order_details['refund_transaction_id']):
                return "Refund has not been initiated for this ID. For more queries regarding refund for this ID, contact customer care."
            return f"Refund Transaction ID for Order ID {order_id}: {order_details['refund_transaction_id']}"
        elif query_type == 'transaction id':
            return f"Transaction ID for Order ID {order_id}: {order_details['transaction_id']}"
        elif query_type == 'refund time':
            if pd.isna(order_details['refund_time']):
                return "Refund has not been initiated for this ID. For more queries regarding refund for this ID, contact customer care."
            return f"Refund Time for Order ID {order_id}: {order_details['refund_time']}"
        elif query_type == 'order details':
            return f"Order ID: {order_details['order_id']}, Price Paid: {order_details['price_paid']}, Payment Method: {order_details['payment_method']}, Payment Status: {order_details['payment_status']}, Billing Date: {order_details['billing_date']}, Cash Back: {order_details['cash_back']}"

# Function to find the best matching intent using Sentence Transformers
def find_intent(user_input):
    input_embedding = sentence_model.encode(user_input)
    best_intent = None
    max_similarity = -1
    for intent, phrase_embeddings in intent_embeddings.items():
        similarity = util.pytorch_cos_sim(input_embedding, phrase_embeddings).max().item()
        if similarity > max_similarity:
            max_similarity = similarity
            best_intent = intent
    return best_intent, max_similarity

# Function to handle quick response checks
def check_quick_response(user_input):
    if user_input in quick_responses['greeting']:
        return "Hello! How can I assist you today with your payment or order queries?"
    if user_input in quick_responses['unrelated']:
        return "Please ask questions related to payment or order queries."
    return None

# Function to handle user input
def get_chatbot_response(user_input):
    try:
        user_input = preprocess_input(user_input)

        # Quick response check
        quick_response = check_quick_response(user_input)
        if quick_response:
            return quick_response

        # Ensure resources are loaded
        global nlp, sentence_model, intent_embeddings
        if nlp is None or sentence_model is None or not intent_embeddings:
            return "Please wait while the system initializes. Try again in a few seconds."

        doc = nlp(user_input)

        # Extracting order ID and specific queries
        order_id = None
        query_type = None

        for token in doc:
            if token.like_num:
                order_id = int(token.text)
        
        query_mapping = {
            'status': 'payment status',
            'delivered': 'product delivered',
            'cash back': 'cash back',
            'cashback': 'cash back',
            'billing date': 'billing date',
            'purchased': 'billing date',
            'date of billing': 'billing date',
            'price': 'price paid',
            'amount paid': 'price paid',
            'refund transaction id': 'refund transaction id',
            'transaction id': 'transaction id',
            'refund time': 'refund time',
            'details': 'order details',
            'refund issue': 'refund issue',
            'time to refund': 'refund time'
        }
        
        for key, value in query_mapping.items():
            if key in user_input:
                query_type = value
                break

        if order_id and query_type:
            return get_customer_response(order_id, query_type)

        # Find the best matching intent
        intent, similarity = find_intent(user_input)

        # Check similarity threshold to determine if the intent is relevant
        similarity_threshold = 0.75  # Adjust threshold as needed
        if similarity < similarity_threshold:
            return "Please ask questions related to payment or order queries."

        # Handling predefined intents
        responses = {
            'payment steps paypal': "Steps for PayPal payment:\n1. Log in to your PayPal account.\n2. Choose PayPal as your payment method.\n3. Confirm the payment.",
            'payment steps credit card': "Steps for Credit Card payment:\n1. Enter your credit card details.\n2. Confirm the payment.",
            'payment steps bank transfer': "Steps for Bank Transfer:\n1. Choose Bank Transfer as your payment method.\n2. Follow the instructions to complete the transfer.",
            'payment failure': "Please check that you are using the correct payment details. If the issue persists, try using another payment method.",
            'wrong product': "Yes, you will get a refund. Contact customer care for more details.",
            'payment methods': "The available payment methods are:\n1. Credit/Debit Card\n2. PayPal\n3. Bank Transfer",
            'how to do payment': "To make a payment, you can use the following methods:\n\n1. Credit/Debit Card: You can pay using your credit or debit card on our website.\n2. PayPal: You can use your PayPal account to make the payment.\n3. Bank Transfer: You can make a direct bank transfer to our company account.\n\nPlease let me know if you have any other questions.",
            'refund time': "You will receive a refund within 3-4 days.",
            'refund initiated': "Your refund has been initiated. Please check your email for more details.",
            'refund issue': "For more details, contact customer care.",
            'refund eligibility': "Yes, you will get a refund. Contact customer care for more details."
        }

        if intent in responses:
            return responses[intent]

        # Default response for non-relevant questions
        return "Please ask questions related to payment or order queries."

    except Exception as e:
        return f"Error generating response: {e}"

if __name__ == "__main__":
    # Example usage
    user_input = input("You: ")
    response = get_chatbot_response(user_input)
    print(f"Chatbot: {response}")

