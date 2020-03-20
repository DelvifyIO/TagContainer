import React, { useState, useEffect, useCallback } from "react";
import {Col, Form, InputGroupAddon, InputGroupText, Row, Table} from "reactstrap";
import FormGroup from "reactstrap/es/FormGroup";
import InputGroup from "reactstrap/es/InputGroup";
import Input from "reactstrap/es/Input";
import Button from "reactstrap/es/Button";
import moment from "moment";

import {useDataFetch, useForm} from "../hooks";
import {clientMapper} from "../utils/mappers";
import Pagination from "../components/Pagination";
import {TAG_STATUS} from "../utils/enums";
import store from "../store";
import {push} from "react-router-redux";

const Index = (props) => {
  const [searchFocus, setSearchFocus] = useState(false);
  const [clients, setClients] = useState([]);
  const [keyword, setKeyword] = useState(null);
  const [newClientLoading, setNewClientLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    page,
    goToPage,
    totalPage,
    data,
    fetchData,
    loading
  } = useDataFetch(props, '/client', {}, { sortBy: 'name', order: 'asc' }, clientMapper);

  useEffect(() => {
    document.body.classList.add("index-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    return function cleanup() {
      document.body.classList.remove("index-page");
      document.body.classList.remove("sidebar-collapse");
    };
  });

  useEffect(() => {
    fetchData({ name: keyword })
        .then(() => {
          setError(null);
        })
        .catch((e) => {
          if (e.status === 404) {
            setError('No results');
          } else {
            setError(e.message);
          }
        });
  }, [keyword]);

  useEffect(() => {
    let proxyUrl = 'https://cors-anywhere.herokuapp.com/';

    setClients(data);
    const promises = [];
    data.forEach((client) => {
        promises.push(
          new Promise((resolve, reject) => {
            if (client.websites && client.websites.length > 0) {
              const clientPromises = [];
              client.websites.forEach((website) => {
                clientPromises.push(
                  new Promise((res, rej) => {
                    return window.api.get(proxyUrl + website, {
                      params: { delvifyTagChecking: true },
                      verbose: true,
                      headers: { 'X-Requested-With': 'XMLHttpRequest' }
                    })
                        .then((result) => {
                          const installed = result.response.includes(`delvifyTagContainer${client.id}`);
                          const status = installed ? TAG_STATUS.INSTALLED : TAG_STATUS.UNINSTALLED;
                          return res(status);
                        })
                        .catch((e) => {
                          console.log(e);
                          const status = TAG_STATUS.UNINSTALLED;
                          return res(status);
                        })
                  })
                );
                return Promise.all(clientPromises)
                    .then((statuses) => {
                      client.status = statuses;
                      return resolve(client);
                    })
              });
            } else {
              client.status = [];
              return resolve(client);
            }
          })
        );
    });
    Promise.all(promises)
        .then((clients) => {
          setClients(clients);
        });
  }, [data]);

  const onSubmitNewClient = useCallback((values, errors) => {
    setNewClientLoading(true);
    window.api.post('/client', { name: values.name })
        .then((result) => {
          setNewClientLoading(false);
          let temp = window._.clone(clients);
          temp = [clientMapper(result), ...temp];
          setClients(temp);
        })
        .catch(() => {
          setNewClientLoading(false);
        });
  }, [clients]);

  const onKeywordChange = useCallback((e) => {
    e.preventDefault();
    setKeyword(e.target.value);
  }, []);

  const onRowClick = useCallback((client) => {
    store.dispatch(push(`/tags/${client.id}`));
  }, []);

  const { form: formNewClient } = useForm({ onSubmit: onSubmitNewClient });
  return (
    <>
      <div className="wrapper light">
        <div className="p-3">
          <Row className="align-items-center">
            <Col>
              <Form>
                <FormGroup>
                  <InputGroup
                      className={
                        "no-border input-lg" +
                        (searchFocus ? " input-group-focus" : "")
                      }
                  >
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="now-ui-icons ui-1_zoom-bold"/>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                        placeholder="Search"
                        name="keyword"
                        autoComplete="keyword"
                        type="text"
                        onFocus={() => setSearchFocus(true)}
                        onBlur={() => setSearchFocus(false)}
                        onChange={onKeywordChange}
                    />
                  </InputGroup>
                </FormGroup>
              </Form>
            </Col>
            <Col className="d-flex flex-column" md={3}>
              <Form className="d-flex flex-row" onSubmit={formNewClient.handleSubmit}>
                <FormGroup className="mb-0 mr-2">
                  <InputGroup className="no-border mb-0">
                    <Input
                        placeholder="New Client Name"
                        name="name"
                        type="text"
                        onChange={formNewClient.handleChange}
                    />
                  </InputGroup>
                </FormGroup>
                <Button
                    className="btn-round m-0"
                    color="info"
                    type="submit"
                    disabled={newClientLoading}
                >
                  { newClientLoading ? <i className="fas fa-spinner fa-spin"/> : <i className="fas fa-plus"/> }
                </Button>
              </Form>
            </Col>
          </Row>

          <Table hover={!loading && !error} borderless className={ !loading && !error ? "clickable" : "" }>
            <thead>
            <tr>
              <th width="40%">Clients</th>
              <th width="20%">Create Date</th>
              <th width="10%">No. of Tags</th>
              <th width="10%">Status</th>
            </tr>
            </thead>
            <tbody>
            {
              loading ?
                <tr>
                  <td colSpan={3} align="center"><i className="fas fa-spinner fa-spin"/></td>
                </tr> :
              error ?
                <tr>
                  <td colSpan={3} align="center" className="text-danger">{ error }</td>
                </tr> :
              clients.map((client, index) => {
                    return (
                        <tr key={`client_${index}`} onClick={() => {onRowClick(client)}}>
                          <td>{client.name}</td>
                          <td>{moment(client.createdAt).format("DD MMM YYYY")}</td>
                          <td>{client.tags.length}</td>
                          <td className="d-flex flex-row">{ !client.status ? <i className="fa fa-spinner fa-spin"/> :
                              client.status.length <= 0 ? <span>NO WEBSITE</span> :
                                  client.status.map((status, index) => {
                                    return (<div key={`status_${client.id}_${index}`} className="mr-1">
                                      {
                                        status === TAG_STATUS.INSTALLED ?
                                            <i className="fas fa-check text-success" title="Installed"/> : status === TAG_STATUS.LOADING ?
                                            <i className="fa fa-spinner fa-spin"/> : <i className="fas fa-times text-danger" title="Uninstalled"/>
                                      }
                                    </div>);
                              })}
                          </td>
                        </tr>
                    );
              })
            }
            </tbody>
          </Table>
          <Pagination page={page} totalPage={totalPage} goToPage={goToPage}/>
        </div>
      </div>
    </>
  );
};

export default Index;
