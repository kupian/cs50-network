import LikeButton from './LikeButton';
import { useState, useEffect } from 'react';
import React from 'react';

export default function Post(props) {

    const [editing, setEditing] = useState(false);
    const [content, setContent] = useState(props.post.content)
    const [visible, setVisible] = useState(true);

    function handleTextChange(e) {
        setContent(e.target.value);
    }

    function edit() {
        if (editing) {
            setEditing(false)
        }
        else {
            setEditing(true)
        }
    }

    function deletePost() {
        fetch(`/delete/${props.post.pk}`, {
            method: "POST",
            headers: {
                "X-CSRFToken": props.csrf_token
            },
        })
        .then(() => {
            setVisible(false);
        })
    }

    function submitEdit() {
        fetch(`/edit/${props.post.pk}`, {
            method: "POST",
            headers: {
                "X-CSRFToken": props.csrf_token
            },
            body: JSON.stringify({
                "content": content
            })
        })
        .then(() => {
            setEditing(false);
        })
    }

    if (visible){
    return(
        <div className="border m-3 p-2">
            <div className="row">
                <div className="col-11">
                    <strong><a href="/profile/{props.user}" className="text-decoration-none">{props.post.user}</a></strong>
                    <br />
                    <p className="font-weight-light">{props.post.timestamp}</p>
                </div>
                <div className="col text-right">
                    {props.post.belongsToUser
                        ? <p><a className="m-1 text-decoration-none" href="#!" onClick={edit}>Edit</a><a className="m-1 link-danger text-decoration-none" href="#!" onClick={deletePost}>Delete</a></p>
                        : ""
                    }
                </div>
            </div>
            <div className="row">
                <div className="h5 col mb-3">
                    {editing
                    ? <div>
                        <div className="row">
                            <div className="col">
                                <textarea defaultValue={content} onChange={handleTextChange} rows="2" cols="100"></textarea>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <button className="btn btn-primary" onClick={submitEdit}>Edit</button>
                            </div>
                        </div>
                    </div>
                    : <p>{content}</p>
                    }
                </div>
            </div>
            <div className="row">
                <div className="col like-button-div">
                    <LikeButton csrf_token={props.csrf_token} postID={props.post.pk} likes={props.post.likes} liked={props.post.liked} />
                </div>
            </div>
        </div>
    )
    }
else {
    return(<></>)
}
}