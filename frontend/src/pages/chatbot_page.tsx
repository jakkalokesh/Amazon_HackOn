import React from 'react';
import Chatbot from '../components/Chatbot';

const App: React.FC = () => {
    return (
        <div className="app container mx-auto p-4">
            <div className="w-full">
                <Chatbot />
            </div>
        </div>
    );
};

export default App;
