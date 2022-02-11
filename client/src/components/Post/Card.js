import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePost } from '../../actions/post.action';
import FollowHandler from '../Profil/FollowHandler';
import { dateParser, isEmpty } from '../Utils';
import LikeButton from './LikeButton';

const Card = ({ post }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdated, setIsUpdated] = useState(false);
    const [textUpdate, setTextUpdate] = useState(null);
    const usersData = useSelector((state) => state.usersReducer);
    const userData = useSelector((state) => state.userReducer);
    const dispatch = useDispatch();

    const updateItem = () =>{
        if(textUpdate){
            dispatch(updatePost(post._id, textUpdate))
        }
        setIsUpdated(false);
    }

    useEffect(() => {
        !isEmpty(usersData[0]) && setIsLoading(false);
    }, [usersData])

    return (
        <li className="card-container" key={post._id}>
            {isLoading ? (
                <i className='fas fa-spinner fa-spin'></i>
            ) : (
                <>
                    <div className="card-left">
                        <img 
                            src={!isEmpty(usersData[0]) && 
                                usersData
                                .filter((user) => user._id === post.posterId)
                                .map((user) => {
                                    return user.picture;
                                }).join('')
                            }
                            alt="poster-pic" />
                    </div>
                    <div className="card-right">
                        <div className="card-header">
                            <div className="pseudo">
                                <h3>
                                    {!isEmpty(usersData[0]) && 
                                    usersData
                                        .filter((user) => user._id === post.posterId)
                                        .map((user) => {
                                            return user.pseudo
                                    }).join('')
                                    }
                                </h3>
                                {post.psterId !== userData._id && (
                                    <FollowHandler idToFollow={post.posterId} type={'card'} />
                                )}
                            </div>
                            <span>
                                {dateParser(post.createdAt)}
                            </span>
                        </div>
                        {isUpdated === false && <p>{post.message}</p>}
                        {isUpdated && (
                            <div className="update-post">
                                <textarea 
                                 defaultValue={post.message}
                                 onChange={(e) => setTextUpdate(e.target.value)}
                                />
                                <div className="button-container">
                                    <button className="btn" onClick={updateItem}>Valider modification</button>
                                </div>
                            </div>
                        )}
                        {post.picture && <img src={post.picture} alt='card-pic' className='card-pic' />}
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
                        {userData._id === post.posterId && (
                            <div className="button-container">
                                <div onClick={() => setIsUpdated(!isUpdated)}>
                                    <img src="./img/icons/edit.svg" alt="" />
                                </div>
                            </div>
                        )}
                        <div className="card-footer">
                            <div className="comment-icon">
                                <img src="./img/icons/message1.svg" alt="comment" />
                                <span>{post.comments.length}</span>
                            </div>
                            <LikeButton post={post} />
                            <img src="./img/icons/share.svg" alt="share" />
                        </div>

                    </div>
                </>
            )}
        </li>
    );
};

export default Card;