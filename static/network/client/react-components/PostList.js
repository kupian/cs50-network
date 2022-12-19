import Post from "./Post";
import React from 'react';
import { useState, useEffect } from 'react';

export default function PostList(props) {
    /*
    ! State stores current page
    ! When page button or whatever is clicked, change state.
    ! Hook change of state to fetch for new page, resulting in update of
    ! posts. !!!
    */
   
   const [postList, setPostList] = useState()

   useEffect(() => {
    setPostList();
    fetch(`/${props.page}`, {
        method: "POST",
        headers: {
            "X-CSRFToken": props.csrf_token
        }
    })
    .then(response => response.json())
        .then(data => {
            let posts = data.posts;
            props.setPages(data.pageCount);
            const newPostList = posts.map((post) => {
                return(<Post csrf_token={props.csrf_token} post={post} key={post.pk} />)
            })
            setPostList(newPostList);
        })
   }, [props.page])

   return (
    <div className="col">
        {postList}
    </div>
   )
}