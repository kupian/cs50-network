import ReactDOM from 'react-dom';
import { React, useState } from 'react';
import PostList from '../react-components/PostList';
import PageSelect from '../react-components/PageSelect';
import csrfCookie from './csrfcookie';

document.addEventListener("DOMContentLoaded", () => {
    const csrf_token = csrfCookie();
    const domContainer = document.querySelector("#react-container");
    const root = ReactDOM.createRoot(domContainer);

    function App(props) {
        const [page, setPage] = useState(1)
        const [pages, setPages] = useState(0)
        return (
            <div>
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