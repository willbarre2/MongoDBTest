import React from 'react';
import LeftNave from '../components/LeftNav'
import Thread from '../components/Thread';

const Home = () => {
    return (
        <div className="home">
            <LeftNave />
            <div className="main">
                <Thread />
            </div>
        </div>
    );
};

export default Home;