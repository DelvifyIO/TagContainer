import React from "react";
import PropTypes from "prop-types";

// reactstrap components
import { Pagination as PaginationComponent, PaginationItem, PaginationLink } from "reactstrap";

// core components

function Pagination(props) {
    const { page, totalPage, goToPage } = props;
    return (
        <>
            <nav aria-label="...">
                <PaginationComponent>
                    <PaginationItem className={page === 1 ? "disabled" : ""}>
                        <PaginationLink onClick={() => { goToPage(page - 1); }} tabIndex="-1">{"◂"}</PaginationLink>
                    </PaginationItem>
                    {
                        window._.times(totalPage, (index) => {
                            return <PaginationItem key={`page_${index}`} className={page === index+1 ? "active" : ""}>
                                <PaginationLink onClick={() => { goToPage(index + 1); }}>
                                    {index + 1}
                                </PaginationLink>
                            </PaginationItem>
                        })
                    }
                    <PaginationItem className={page === totalPage ? "disabled" : ""}>
                        <PaginationLink onClick={() => { goToPage(page + 1); }}>
                            {"▸"}
                        </PaginationLink>
                    </PaginationItem>
                </PaginationComponent>
            </nav>
        </>
    );
}

Pagination.propTypes = {
    page: PropTypes.number,
    totalPage: PropTypes.number,
    goToPage: PropTypes.func,
};

Pagination.defaultProps = {
    page: 1,
    totalPage: 1,
    goToPage: () => {},
};

export default Pagination