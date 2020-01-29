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
import Jumbotron from "reactstrap/es/Jumbotron";
import EditClientModal from "../components/Modals/EditClientModal";
import TagModal from "../components/Modals/TagModal";

const Tags = (props) => {

    const clientId = window._.get(props, ['match', 'params', 'clientId']);
    const [client, setClient] = useState({});
    const [editButton, setEditButton] = useState(false);
    const [isEditClientModalOpen, setIsEditClientModalOpen] = useState(false);
    const [isTagModalOpen, setIsTagModalOpen] = useState(false);
    const [tags, setTags] = useState([]);

    const validatorEditClient = useCallback((name, value) => {
        switch (name) {
            case 'name':
                return window._.isEmpty(value) ? 'Required' : null;
        }
    }, []);

    useEffect(() => {
        window.api.get(`/client/${clientId}`)
            .then((result) => {
                const client = clientMapper(result);
                setClient(client);
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    const showEditButton = useCallback(() => {
        setEditButton(true);
    }, []);

    const hideEditButton = useCallback(() => {
        setEditButton(false);
    }, []);

    const toggleEditClientModal = useCallback(() => {
        setIsEditClientModalOpen(!isEditClientModalOpen);
    }, [isEditClientModalOpen]);

    const toggleTagModal = useCallback(() => {
        setIsTagModalOpen(!isTagModalOpen);
    }, [isTagModalOpen]);


    const onSubmitEditClient = useCallback((values, error) => {
        window.api.patch(`/client/${clientId}`, values)
            .then((result) => {
                setClient(clientMapper(result));
            })
            .catch((err) => {
                console.log(err);
            });
    }, [isEditClientModalOpen]);

    const { form: formEditClient } = useForm({ onSubmit: onSubmitEditClient, validator: validatorEditClient });
    const { form: formTag } = useForm({ onSubmit: onSubmitEditClient, validator: validatorEditClient });

    return (
        <>
            <div className="wrapper light">
                <div className="p-3">
                    <Jumbotron className="bg-light-transparent pt-3 pb-3" onMouseEnter={showEditButton} onMouseLeave={hideEditButton}>
                        <Row><Col md={2}>Client Name:</Col><Col className="font-weight-bold">{client.name}</Col></Row>
                        <Row><Col md={2}>Client Website:</Col><Col className="font-weight-bold"><a href={client.website} target="blank">{client.website}</a></Col></Row>
                        <Row><Col md={2}>Created Date:</Col><Col className="font-weight-bold">{moment(client.createdAt).format("DD MMM YYYY")}</Col></Row>
                        <Row>
                            <Col md={2}>JS Tag:</Col>
                            <Col>
                                <span className="text-dark bg-white p-1 text-monospace">{`<script src="http://delvify.io/tag_container/js/${client.id}/>`}</span>
                            </Col>
                        </Row>
                        {
                            editButton &&
                            <div className="position-relative">
                                <Button className="btn-round bg-white btn-icon position-absolute m-0" style={{ bottom: 0, right: 0 }} onClick={toggleEditClientModal}>
                                    <i className="fas fa-edit text-dark" />
                                </Button>
                            </div>

                        }
                    </Jumbotron>
                    <Button
                        className="float-right"
                        color="info"
                        type="submit"
                    >
                        <span><i className="fas fa-plus"/> New Tag</span>
                    </Button>
                </div>
            </div>
            <EditClientModal
                isOpen={isEditClientModalOpen}
                toggleModal={toggleEditClientModal}
                form={formEditClient}
                initialValues={{ name: client.name, website: client.website }}
            />
            <TagModal
                isOpen={isTagModalOpen}
                toggleModal={toggleTagModal}
                form={formEditClient}
                initialValues={{ name: client.name, website: client.website }}
            />
        </>
    );
};

export default Tags;
