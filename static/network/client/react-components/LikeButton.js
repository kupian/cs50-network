import { useState, useEffect } from 'react';
import React from 'react';

export default function LikeButton(props) {

    const [likes, setLikes] = React.useState(props.likes)
    const [liked, setLiked] = React.useState(props.liked)
    const [likeButtonClassName, setLikeButtonClassName] = useState()

    function LikeClick(event)
    {
        fetch(`/like/${props.postID}`, {
        method: "POST",
        headers: {
            "X-CSRFToken": props.csrf_token
            }
        })
        .then(response => response.json())
        .then(data => {
            setLiked(data.liked);
            setLikes(data.likes);
        });
    }

    useEffect(() => {
        setLikeButtonClassName(liked ? "liked bi bi-heart-fill" : "like bi bi-heart-fill")
    }, [liked])

    return (
        <i className={likeButtonClassName} onClick={LikeClick}> {likes}</i>
    )
}