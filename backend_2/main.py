from flask import Flask, request, jsonify
from chatbot import get_chatbot_response
from recommendation import get_recommendation
from flask_cors import CORS

app = Flask(__name__)
cors=CORS(app, origins='*')  # This will enable CORS for all routes

@app.route('/chatbot', methods=['POST'])
def chatbot():
    user_input = request.json.get('input')
    response = get_chatbot_response(user_input)
    return jsonify({'response': response})

@app.route('/recommend', methods=['POST'])
def recommend():
    product_id = request.json.get('product_id')
    recommendation = get_recommendation(product_id)
    return jsonify(recommendation)

if __name__ == '__main__':
    app.run(debug=True)
