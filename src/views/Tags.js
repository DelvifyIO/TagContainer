import React, { useRef, useState, useEffect, useCallback } from "react";
import {Col, Form, InputGroupAddon, InputGroupText, Row, Table} from "reactstrap";
import FormGroup from "reactstrap/es/FormGroup";
import InputGroup from "reactstrap/es/InputGroup";
import Input from "reactstrap/es/Input";
import Button from "reactstrap/es/Button";
import moment from "moment";

import {useDataFetch, useForm} from "../hooks";
import {clientMapper, tagMapper} from "../utils/mappers";
import Pagination from "../components/Pagination";
import Jumbotron from "reactstrap/es/Jumbotron";
import EditClientModal from "../components/Modals/EditClientModal";
import TagModal from "../components/Modals/TagModal";
import {STATUS, TAG_STATUS} from "../utils/enums";
import {getUrlWithSlash} from "../utils/stringHelper";
import store from "../store";
import {push} from "react-router-redux";

const TagRow = (props) => {
    const { onClick, host, tag } = props;
    return (
        <Jumbotron
            className="pt-3 pb-3 mb-2 border-white border clickable script-tile flex-grow-1 ml-1 mr-1"
            style={{ breakInside: 'avoid' }}
            onClick={onClick}
        >
            <Row>
                <Col>
                    <span className="h6 text-underline text-uppercase">{ tag.name }</span>
                </Col>
            </Row>
            <Row>
                <Col md={2}>
                    <span className="h7 text-uppercase">Path</span><br/>
                    <a style={{ overflowWrap: 'break-word'}} href={`${getUrlWithSlash(host)}${tag.path}`} target="blank">{ `/${tag.path}` }</a>
                </Col>
                <Col md={2}>
                    <span className="h7 text-uppercase">Delay</span><br/>
                    <span>{ `${tag.delay}s` }</span>
                </Col>
                <Col>
                    <span className="h7 text-uppercase">Script</span><br/>
                    <span className="text-monospace" style={{ overflowWrap: 'break-word', whiteSpace: 'pre-wrap' }}>{ tag.script }</span>
                </Col>
            </Row>
        </Jumbotron>
    )
};

const Tags = (props) => {

    const clientId = window._.get(props, ['match', 'params', 'clientId']);
    const [client, setClient] = useState({});
    const [status, setStatus] = useState(TAG_STATUS.LOADING);
    const [editButton, setEditButton] = useState(false);
    const [isEditClientModalOpen, setIsEditClientModalOpen] = useState(false);
    const [isTagModalOpen, setIsTagModalOpen] = useState(false);
    const [tags, setTags] = useState([]);
    const [activeTag, setActiveTag] = useState(null);
    const [copyStatus, setCopyStatus] = useState(STATUS.IDLE);
    const scriptTagRef = useRef(null);

    const validatorEditClient = useCallback((name, value) => {
        switch (name) {
            case 'name':
                return window._.isEmpty(value) ? 'Required' : null;
        }
    }, []);

    const validatorTag = useCallback((name, value) => {
        switch (name) {
            case 'script':
                return window._.isEmpty(value) ? 'Required' : null;
        }
    }, []);

    useEffect(() => {
        let proxyUrl = 'https://cors-anywhere.herokuapp.com/';

        window.api.get(`/client/${clientId}`)
            .then((result) => {
                const client = clientMapper(result);
                setClient(client);
                if (client.website) {
                    window.api.get(proxyUrl + client.website, {
                        params: { delvifyTagChecking: true },
                        verbose: true,
                        headers: { 'X-Requested-With': 'XMLHttpRequest' }
                    })
                        .then((result) => {
                            const installed = result.response.includes(`delvifyTagContainer${client.id}`);
                            setStatus(installed ? TAG_STATUS.INSTALLED : TAG_STATUS.UNINSTALLED);
                        })
                        .catch((e) => {
                            console.log(e);
                            setStatus(TAG_STATUS.UNINSTALLED);
                        })
                } else {
                    setStatus(TAG_STATUS.NO_WEBSITE);
                }
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    useEffect(() => {
        window.api.get(`/tag/${clientId}`)
            .then((result) => {
                const tags = result.map(tagMapper);
                setTags(tags);
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

    const toggleTagModal = useCallback((tag = null) => {
        if (tag) {
            setActiveTag(tag);
        }
        if (isTagModalOpen) {
            setActiveTag(null);
        }
        setIsTagModalOpen(!isTagModalOpen);
    }, [isTagModalOpen]);

    const removeClientHandler = useCallback(() => {
        window.api.delete(`/client/${clientId}`)
            .then((result) => {
                store.dispatch(push('/'));
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    const removeTagHandler = useCallback(() => {
        window.api.delete(`/tag/${clientId}/${activeTag.id}`)
            .then((result) => {
                setTags(result.map(tagMapper));
            })
            .catch((e) => {
                console.log(e);
            });
        toggleTagModal();
    }, [activeTag]);

    const onSubmitEditClient = useCallback((values, error) => {
        window.api.patch(`/client/${clientId}`, values)
            .then((result) => {
                setClient(clientMapper(result));
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const onSubmitTag = useCallback((values, error) => {
        const action = activeTag ? window.api.patch(`/tag/${clientId}/${activeTag.id}`, values) :
            window.api.post(`/tag/${clientId}`, values);
        action
            .then((result) => {
                setTags(result.map(tagMapper));
                toggleTagModal();
            })
            .catch((err) => {
                console.log(err);
                toggleTagModal();
            });
    }, [activeTag]);

    const onCopyScriptClick = useCallback(() => {
        scriptTagRef.current.select();
        document.execCommand("copy");
        setCopyStatus(STATUS.SUCCESS);
    }, [scriptTagRef]);

    const { form: formEditClient } = useForm({ onSubmit: onSubmitEditClient, validator: validatorEditClient });
    const { form: formTag } = useForm({ onSubmit: onSubmitTag, validator: validatorTag });

    return (
        <>
            <div className="wrapper light">
                <div className="p-3">
                    <Jumbotron className="bg-light-transparent pt-3 pb-3" onMouseEnter={showEditButton} onMouseLeave={hideEditButton}>
                        {
                            editButton &&
                            <div className="position-relative" style={{ zIndex: 80 }}>
                                <Button className="btn-round bg-white btn-icon position-absolute m-0" style={{ top: 0, right: 0 }} onClick={toggleEditClientModal}>
                                    <i className="fas fa-edit text-dark" />
                                </Button>
                            </div>

                        }
                        <Row><Col md={2}>Client Name:</Col><Col className="font-weight-bold">{client.name}</Col></Row>
                        <Row><Col md={2}>Client Website:</Col><Col className="font-weight-bold"><a href={client.website} target="blank">{client.website}</a></Col></Row>
                        <Row><Col md={2}>Created Date:</Col><Col className="font-weight-bold">{moment(client.createdAt).format("DD MMM YYYY")}</Col></Row>
                        <Row>
                            <Col md={2}>JS Tag:</Col>
                            <Col className="d-flex">
                                <Form className="bg-white pt-2 pb-2 pl-3 pr-3 text-monospace script-tag w-100">
                                    <textarea
                                        onBlur={() => { setCopyStatus(STATUS.IDLE); }}
                                        readOnly
                                        rows={1}
                                        className="w-100 border-0 text-monospace text-dark p-0"
                                        style={{ resize: 'none' }}
                                        ref={scriptTagRef}
                                        value={`<script src="${getUrlWithSlash(process.env.REACT_APP_API_HOST)}script/${client.id}" id="delvifyTagContainer${client.id}"/>`}
                                    />
                                </Form>
                                <Button className="btn btn-icon m-0 bg-transparent script-copy-btn" onClick={onCopyScriptClick}>
                                    {
                                        copyStatus === STATUS.SUCCESS ? <i className="fas fa-clipboard-check"/> : <i className="far fa-clipboard"/>
                                    }
                                </Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={2}>Status:</Col>
                            <Col className="font-weight-bold">
                                <div className="mt-1">
                                    { status === TAG_STATUS.INSTALLED ?
                                        <i className="fas fa-check text-success" title="Installed"/> : status === TAG_STATUS.LOADING ?
                                            <i className="fa fa-spinner fa-spin"/> : status === TAG_STATUS.NO_WEBSITE ?
                                                <span>NO WEBSITE</span> : <i className="fas fa-times text-danger" title="Uninstalled"/> }
                                </div>
                            </Col>
                        </Row>
                    </Jumbotron>
                    <div className="d-flex flex-column">
                        <Button
                            className="align-self-end"
                            color="info"
                            onClick={() => { toggleTagModal(); }}
                        >
                            <span><i className="fas fa-plus"/> New Tag</span>
                        </Button>
                        <div style={{ columnCount: 2 }}>
                            {
                                tags.map((tag) => {
                                    const { id } = tag;
                                    return (
                                        <TagRow
                                            key={`tag_${id}`}
                                            host={client.website}
                                            tag={tag}
                                            onClick={() => { toggleTagModal(tag) }}
                                        />
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
            <EditClientModal
                isOpen={isEditClientModalOpen}
                toggleModal={toggleEditClientModal}
                form={formEditClient}
                initialValues={{ name: client.name, website: client.website }}
                onRemove={removeClientHandler}
            />
            <TagModal
                isOpen={isTagModalOpen}
                toggleModal={toggleTagModal}
                form={formTag}
                tag={activeTag}
                website={client.website}
                onRemove={removeTagHandler}
            />
        </>
    );
};

export default Tags;
