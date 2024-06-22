import React from 'react';
import Recommendation from '../components/Recommendation';

const App: React.FC = () => {
    return (
        <div className="app container mx-auto p-4">
            <div className="w-full">
                <Recommendation />
            </div>
        </div>
    );
};

export default App;