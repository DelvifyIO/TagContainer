import React, { useCallback } from "react";
import { connect } from 'react-redux';

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Col, FormFeedback
} from "reactstrap";

// core components
import ExamplesNavbar from "components/Navbars/ExamplesNavbar.js";
import TransparentFooter from "components/Footers/TransparentFooter.js";
import {login} from "../actions/authAction";


const mapStateToProps = (state) => ({
  auth: window._.get(state, ['auth'], {})
});
const mapDispatchToProps = { login };

function Login(props) {
  const { login, auth } = props;
  const [firstFocus, setFirstFocus] = React.useState(false);
  const [lastFocus, setLastFocus] = React.useState(false);
  const onSubmit = useCallback((e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    login({ username, password })
        .then(() => {
          window.location.href = "/";
        });
  }, []);
  React.useEffect(() => {
    document.body.classList.add("login-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    return function cleanup() {
      document.body.classList.remove("login-page");
      document.body.classList.remove("sidebar-collapse");
    };
  });
  return (
    <>
      <div className="page-header clear-filter" filter-color="blue">
        <div
          className="page-header-image"
          style={{
            backgroundImage: "url(" + require("assets/img/login.jpg") + ")"
          }}
        />
        <div className="content">
          <Container>
            <Col className="ml-auto mr-auto" md="4">
              <Card className="card-login card-plain">
                <Form action="" className="form" method="" onSubmit={onSubmit}>
                  <CardHeader className="text-center">
                    <div className="logo-container">
                      <img
                        alt="..."
                        src={require("assets/img/now-logo.png")}
                      />
                    </div>
                  </CardHeader>
                  <CardBody>
                    <InputGroup
                      className={
                        "no-border input-lg" +
                        (firstFocus ? " input-group-focus" : "")
                      }
                    >
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="now-ui-icons users_circle-08"/>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Username"
                        name="username"
                        autoComplete="username"
                        type="text"
                        onFocus={() => setFirstFocus(true)}
                        onBlur={() => setFirstFocus(false)}
                        invalid={!!(auth.errorMsg && auth.errorMsg.username)}
                      />
                    </InputGroup>
                    <div className="text-danger mb-1" style={{ fontSize: '80%' }}>{ auth.errorMsg && auth.errorMsg.username }</div>
                    <InputGroup
                      className={
                        "no-border input-lg" +
                        (lastFocus ? " input-group-focus" : "")
                      }
                    >
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="now-ui-icons ui-1_lock-circle-open"/>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        onFocus={() => setLastFocus(true)}
                        onBlur={() => setLastFocus(false)}
                        invalid={!!(auth.errorMsg && auth.errorMsg.password)}
                      />
                    </InputGroup>
                    <div className="text-danger mb-1" style={{ fontSize: '80%' }}>{ auth.errorMsg && auth.errorMsg.password }</div>
                  </CardBody>
                  <CardFooter className="text-center">
                    <Button block className="btn-round" color="info" size="lg">
                      Login
                    </Button>
                  </CardFooter>
                  <div className="text-danger mb-1" style={{ fontSize: '80%' }}>{ auth.errorMsg && auth.errorMsg.message }</div>
                </Form>
              </Card>
            </Col>
          </Container>
        </div>
      </div>
    </>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
