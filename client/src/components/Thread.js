import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPosts } from '../actions/post.action';
import Card from './Post/Card';
import { isEmpty } from './Utils';

const Thread = () => {
    const [loadPost, setLoadPost] = useState(true);
    const [count, setCount] = useState(5);
    const dispatch = useDispatch();
    const posts = useSelector((state) => state.postReducer);

    const loadMore = ()=> {
        if(window.innerHeight + document.documentElement.scrollTop + 1 > document.scrollingElement.scrollHeight){
            setLoadPost(true);
        }
    }

    useEffect(() => {
        if (loadPost) {
            dispatch(getPosts(count));
            setLoadPost(false)
            // on rajoute 5 à count pour qu'au prochain loadPost il y ai 5 posts de plus
            setCount(count + 5);
        }
        window.addEventListener('scroll', loadMore);
        // enlève écouteur quand on sort du composant
        return () => window.removeEventListener('scroll', loadMore);
    }, [loadPost, dispatch, count])

    return (
       <div className="thread-container">
           <ul>
               {!isEmpty(posts[0]) &&
               posts.map((post) => {
                   return <Card post={post} key={post._id} />
               })}
           </ul>
       </div>
    );
};

export default Thread;