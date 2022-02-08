import React from 'react';
import LeftNav from '../LeftNav';
import { useSelector } from "react-redux";
import UploadImg from './UploadImg';
import { useState } from 'react';

const UpdateProfil = () => {
    const userData = useSelector((state) => state.userReducer);
    const [bio, setBio] = useState('');
    const [updateForm, setUpdateForm] = useState(false);

    return (
        <div className="profil-container">
            <LeftNav />
            <h1> Profil de {userData.pseudo}</h1>
            <div className="update-container">
                <div className="left-part">
                    <h3>Photo de profil</h3>
                    <img src={userData.picture} alt="user-pic" />
                    <UploadImg />
                    {/* <p>{errors.maxSize}</p>
                    <p>{errors.format}</p> */}
                </div>
                <div className="right-part">
                    <div className="bio-update">
                        <h3>Bio</h3>
                        {updateForm === false && (
                            <>
                                <p onClick={() => setUpdateForm(!updateForm)}>{userData.bio}</p>
                                <button onClick={() => setUpdateForm(!updateForm)}>Modifier bio</button>
                            </>
                        )}
                        {updateForm && (
                            <>
                                <textarea type="text" defaultValue={userData.bio} onChange={(e) => setBio(e.target.value)}></textarea>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateProfil;