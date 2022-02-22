import React, { useContext } from 'react';
import { UidContext } from '../components/AppContext';
import LeftNave from '../components/LeftNav'
import Log from '../components/Log';
import NewPostForm from '../components/Post/NewPostForm';
import Thread from '../components/Thread';

const Home = () => {
    const uid = useContext(UidContext);
    return (
        <div className="home">
            <LeftNave />
            <div className="main">
                <div className="home-header">
                    {uid ? <NewPostForm /> : <Log signin={true} signup={false} />}
                </div>
                <Thread />
            </div>
        </div>
    );
};

export default Home;