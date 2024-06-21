import React from 'react';
import Chatbot from '../components/Chatbot';

const App: React.FC = () => {
    return (
        <div className="app container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">AI Chatbot</h1>
            <div className="w-full">
                <Chatbot />
            </div>
        </div>
    );
};

export default App;
