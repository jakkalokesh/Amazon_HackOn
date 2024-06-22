# Amazon HackOn (Theme - 4)

Welcome to our project repository !!

This project aims to revolutionize the payment landscape by implementing a suite of AI and ML-powered solutions that enhance the customer experience and streamline financial management.

## Getting Started

### Setup:

1. #### Cloning the project
- Clone the project using the below command.

```sh
    git clone https://github.com/jakkalokesh/Amazon_HackOn.git
```
2. #### Setting up Frontend
- Navigate to the `frontend` directory in your terminal.
- Enter the following command.

```sh
    npm install
```
3. #### Setting up Backend (Part-1)
- Navigate to the `backend_1` directory in your terminal.
- Enter the following command.
```sh
    npm install
```
- Now create a `.env` file in this directory and add the below data.
```sh
    EMAIL = YOUR_EMAIL
    PASS = APP_PASSWORD
    PORT = 3000
    MONGODB_URI = YOUR_MONGOBD 
```
- In the above replace `YOUR_EMAIL` with your email and replace `PASS` with your google app password.
- And if you are interested to use your own database you can add the link in place of `YOUR_MONGOBD`. If not it works using our data.
4. #### Setting up Backend (Part-2)
- Navigate to the `backend_2` directory in your terminal.
- Create a `venv` file using the below command.
```sh
    python -m venv venv
```
- Activate venv using the below command.
```sh
    source venv/bin/activate  # for mac or linux
    <venv_path>/bin/activate  # for windows
```
- Now to install required python packages use the below command.
```sh
    pip install -r requirements.txt
```
- Next use the below command to install en_core_web_sm.
```sh
    python -m spacy download en_core_web_sm
```
- Open `chatbot.py` file (you can find it here - backend_2/chatbot.py) and replace `YOUR_API_KEY` with your google Gemini API key.
    

### Deploy:
 
 Note - Run the below commands in different terminals

1. Navigate to `backend_1` directory and run the below command.

    ```sh
    npx tsc --watch
    ```
2. Again navigate to `backend_1` directory and run the below command.

    ```sh
    npm start
    ```
3. Navigate to `backend_2` directory and run the below command.

    ```sh
    python main.py
    ```
4. Navigate to `frontend` directory and run the following command.

    ```sh
    npm run dev
    ```


#### API Documentation for backend_1:

   - https://documenter.getpostman.com/view/30668785/2sA3XWcJkA




# Project

- We aim to transform the payment landscape by implementing a suite of AI-powered solutions. Our platform includes a smart chatbot for effortless handling of customer payment inquiries, an automated budgeting tool equipped with annual spending limits and threshold alerts, comprehensive savings tracking, detailed spending analysis across various product categories, and an advanced machine learning-based recommendation engine. This engine optimizes payment methods by analyzing specific transaction histories, success rates, cashback offers, and payment costs. Through these innovative features, we seek to redefine the way users manage and optimize their financial transactions.

## Tools and Technologies used

- MongoDB
- Express
- React
- Node.js
- Typescript
- Tailwind CSS
- Flask
- Pandas
- Sentence Transformers
- Scikit-learn

## Screenshots of Our Project

### 1. Home
![alt text](<screenshots/Screenshot 2024-06-22 at 5.52.50 PM.png>)

### 2. AI Chatbot
![alt text](<screenshots/Screenshot 2024-06-22 at 5.56.55 PM.png>)

### 3. Threshold Limit
![alt text](<screenshots/Screenshot 2024-06-22 at 5.57.57 PM.png>)

### 4. Spendings vs Savings
![alt text](<screenshots/Screenshot 2024-06-22 at 6.00.44 PM.png>)

![alt text](<screenshots/Screenshot 2024-06-22 at 6.01.15 PM.png>)

![alt text](<screenshots/Screenshot 2024-06-22 at 6.01.39 PM.png>)

![alt text](<screenshots/Screenshot 2024-06-22 at 6.02.17 PM.png>)

### 5. Recommendation system
![alt text](<screenshots/Screenshot 2024-06-22 at 5.59.18 PM.png>)
