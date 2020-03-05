/*eslint-disable*/
import React, { useState, useCallback, useEffect } from "react";
import { connect } from 'react-redux';

// reactstrap components
import {
    Button,
    Collapse,
    Container, DropdownItem, DropdownMenu, DropdownToggle,
    Nav,
    Navbar,
    NavbarBrand,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    UncontrolledTooltip
} from "reactstrap";
import {Link} from "react-router-dom";
import {logout} from "../../actions/authAction";
// core components

const mapStateToProps = (state) => ({
    user: window._.get(state, ['auth', 'user'], {})
});

const mapDispatchToProps = { logout };

const Header = (props) => {
    const [navbarColor, setNavbarColor] = useState("navbar-transparent");
    const [collapseOpen, setCollapseOpen] = useState(false);
    const { user } = props;
    const signOut = useCallback(() => {
        props.logout();
    }, []);
    useEffect(() => {
        const updateNavbarColor = () => {
            if (
                document.documentElement.scrollTop > 15 ||
                document.body.scrollTop > 15
            ) {
                setNavbarColor("");
            } else if (
                document.documentElement.scrollTop < 16 ||
                document.body.scrollTop < 16
            ) {
                setNavbarColor("navbar-transparent");
            }
        };
        window.addEventListener("scroll", updateNavbarColor);
        return function cleanup() {
            window.removeEventListener("scroll", updateNavbarColor);
        };
    });
    return (
        <>
            {collapseOpen ? (
                <div
                    id="bodyClick"
                    onClick={() => {
                        document.documentElement.classList.toggle("nav-open");
                        setCollapseOpen(false);
                    }}
                />
            ) : null}
            <Navbar className={"fixed-top " + navbarColor} expand="lg" color="info">
                <Container>
                    <div className="navbar-translate">
                        <Link
                            to="/"
                            class="navbar-brand"
                        >
                            Tag Container
                        </Link>
                        <button
                            className="navbar-toggler navbar-toggler"
                            onClick={() => {
                                document.documentElement.classList.toggle("nav-open");
                                setCollapseOpen(!collapseOpen);
                            }}
                            aria-expanded={collapseOpen}
                            type="button"
                        >
                            <span className="navbar-toggler-bar top-bar"></span>
                            <span className="navbar-toggler-bar middle-bar"></span>
                            <span className="navbar-toggler-bar bottom-bar"></span>
                        </button>
                    </div>
                    <Collapse
                        className="justify-content-end"
                        isOpen={collapseOpen}
                        navbar
                    >
                        <Nav navbar>
                            <UncontrolledDropdown nav>
                                <DropdownToggle
                                    caret
                                    color="default"
                                    href="#pablo"
                                    nav
                                    onClick={e => e.preventDefault()}
                                >
                                    <i className="now-ui-icons users_single-02 mr-1"/>
                                    <p>{user.username}</p>
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem onClick={signOut}>
                                        <i className="fas fa-sign-out-alt mr-1"/>
                                        Sign Out
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </Nav>
                    </Collapse>
                </Container>
            </Navbar>
        </>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
