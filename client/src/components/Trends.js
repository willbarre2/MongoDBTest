import React from 'react';
// import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
// import { getTrends } from '../actions/post.action';
import { isEmpty } from './Utils';

const Trends = () => {
    const posts = useSelector((state) => state.allPostsReducer);
    const usersData = useSelector((state) => state.usersReducer);
    // const dispatch = useDispatch();

    // useEffect(() =>{
    //     if(!isEmpty(posts[0])){
    //         // je transforme l'objet posts en array
    //         // const postsArr = Object.keys(posts).map((i) => posts[i]);
    //         let sortedArray = posts.sort((a, b) => {
    //             return b.likers.length - a.likers.length
    //         })
    //         sortedArray.length = 3;
    //         dispatch(getTrends(sortedArray));
    //     }
    // }, [posts, dispatch])

    return (
        <div className="trending-container">
            <h4>Trending</h4>
            <NavLink to="/trending">
                <ul>
                    {posts.length &&
                    posts.map((post) =>{
                        return (
                            <li key={post._id}>
                                <div>
                                    {post.picture && <img src={post.picture} alt="post-pic"/>}
                                    {post.video && (
                                        <iframe
                                        width="500"
                                        height="300"
                                        src={post.video}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        title={post._id}
                                        ></iframe>
                                    )}
                                    {isEmpty(post.picture) && isEmpty(post.video) && (
                                        <img src={usersData[0] && usersData.map((user) =>{
                                            if(user._id === post.posterId) {
                                                return user.picture;
                                            }else return null;
                                        }).join("")
                                        } alt="profil-pic" />
                                    )}
                                </div>
                                <div className="trend-content">
                                    <p>{post.message}</p>
                                    <span>Lire</span>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </NavLink>
        </div>
    );
};

export default Trends;