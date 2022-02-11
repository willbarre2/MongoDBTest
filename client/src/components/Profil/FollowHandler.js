import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { followUser, unFollowUser } from '../../actions/user.actions';
import { isEmpty } from '../Utils';

const FollowHandler = ({idToFollow, type}) => {
    const userData = useSelector((state) => state.userReducer);
    const [isFollowed, setIsFollowed] = useState(false);
    const dispatch = useDispatch();

    const handleFollow = () => {
        dispatch(followUser(userData._id, idToFollow));
        setIsFollowed(true);
    };

    const handleUnfollow = () => {
        dispatch(unFollowUser(userData._id, idToFollow));
        setIsFollowed(false);
    };

    useEffect(() => {
        if(!isEmpty(userData.following)) {
            if(userData.following.includes(idToFollow)){
                setIsFollowed(true);
            }else setIsFollowed(false);
        }
    }, [userData, idToFollow])

    return (
        <>
        {isFollowed && !isEmpty(userData) && (
            <span onClick={handleUnfollow}>
                { type === "suggestion" && <button className='unfollow-btn'>Abonné</button> }
                { type === "card" && <img src='./img/icons/checked.svg' alt='checked' title='ne plus suivre' />}
            </span>
        )}
        {isFollowed === false && !isEmpty(userData) && (
            <span onClick={handleFollow}>
               { type === "suggestion" && <button className='follow-btn'>Suivre</button> }
               { type === "card" && <img src='./img/icons/check.svg' alt='check' title='suivre'/>}
            </span>
        )}
        </>
    );
};

export default FollowHandler;