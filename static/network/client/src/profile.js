import ReactDOM from 'react-dom';
import { React, useEffect, useState } from 'react';
import PostList from '../react-components/PostList';
import csrfCookie from './csrfcookie';
import PageSelect from '../react-components/PageSelect';

document.addEventListener("DOMContentLoaded", () => {
    const csrf_token = csrfCookie();
    const domContainer = document.querySelector("#react-container");
    const root = ReactDOM.createRoot(domContainer);

    function App(props) {
        const [page, setPage] = useState(1)
        const [pages, setPages] = useState(0)
        const [username, setUsername] = useState(window.location.href.split("/profile/")[1])

        useEffect(() => {
            fetch(`/profile/${username}`, {
                method: "POST",
                headers: {
                    "X-CSRFToken": csrf_token
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
        }, [])

        return (
            <div>
                <h2>{username}</h2>
                <div className="row">
                    <PostList csrf_token={props.csrf_token} page={page} setPage={setPage} pages={pages} setPages={setPages} />
                </div>
                <div className="row justify-content-center">
                    <PageSelect pages={pages} page={page} setPage={setPage} />
                </div>
            </div>
        )
    }

    root.render(<App csrf_token={csrf_token} />)
})