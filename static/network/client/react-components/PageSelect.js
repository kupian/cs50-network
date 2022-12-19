import { useState, useEffect } from 'react';
import React from 'react';

export default function PageSelect(props) {

        const [pageButtons, setPageButtons] = useState([])

        function pageChange(e) {
            if (e.target.id === "previous") {
                props.setPage(props.page - 1)
                return 0;
            }
            if (e.target.id === "next") {
                props.setPage(props.page + 1)
                return 0;
            }
            props.setPage(e.target.id);
        }

        useEffect(() => {
            const pageButtonsTemp = []
            for(let i = 0; i < props.pages; i++) {
                pageButtonsTemp.push(<li key={i} className={`page-item ${props.page == i + 1 ? "active" : ""}`}><a className="page-link" href="#!" id={i+1} onClick={pageChange}>{i+1}</a></li>)
            }
            setPageButtons(pageButtonsTemp)
        }, [props.pages, props.page]);

        return (
                <nav>
                    <ul className="pagination pagination-lg justify-content-center">
                        <li className={`page-item ${props.page == 1 ? "disabled" : ""}`}><a className="page-link" href="#!" id="previous" onClick={pageChange}>Previous</a></li>
                        {pageButtons}
                        <li className={`page-item ${props.page == props.pages ? "disabled" : ""}`}><a className="page-link" href="#!" id="next" onClick={pageChange}>Next</a></li>
                    </ul>
                </nav>
        )
    }