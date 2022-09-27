import React from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import LeftNav from '../components/LeftNav';
import Card from '../components/Post/Card';
import Trends from '../components/Trends';
import { isEmpty } from '../components/Utils';

const Trending = () => {
    const posts = useSelector((state) => state.allPostsReducer);


    return (
        <div className="trending-page">
            <LeftNav />
            <div className="main">
                <ul>
                    {!isEmpty(posts[0]) && posts.map((post) => <Card post={post} key={post._id} />)}
                </ul>
            </div>
            <div className="right-side">
                <div className="right-side-container">
                    <Trends />
                </div>
            </div>
        </div>
    );
};

export default Trending;



