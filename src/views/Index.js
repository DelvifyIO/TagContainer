import React, { useState, useEffect, useCallback } from "react";
import {Form, InputGroupAddon, InputGroupText, Table} from "reactstrap";
import FormGroup from "reactstrap/es/FormGroup";
import InputGroup from "reactstrap/es/InputGroup";
import Input from "reactstrap/es/Input";
import Button from "reactstrap/es/Button";
import moment from "moment";

import {useDataFetch, useForm} from "../hooks";
import {clientMapper} from "../utils/mappers";
import Pagination from "../components/Pagination";

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
    setClients(data);
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
    window.location.href = `/tags/${client.id}`;
  }, []);

  const { form: formNewClient } = useForm({ onSubmit: onSubmitNewClient });

  return (
    <>
      <div className="wrapper light">
        <div className="p-3">
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
          <Table hover={!loading && !error} borderless className={ !loading && !error ? "clickable" : "" }>
            <thead>
            <tr>
              <th width="50%">Clients</th>
              <th width="20%">Create Date</th>
              <th className="d-flex flex-column align-items-end">
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
              </th>
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
              clients.map((client, index) =>
                <tr key={`client_${index}`} onClick={() => {onRowClick(client)}}>
                  <td>{client.name}</td>
                  <td colSpan={2}>{moment(client.createdAt).format("DD MMM YYYY")}</td>
                </tr>
              )
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
