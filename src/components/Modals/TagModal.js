import React, { useCallback, useState } from "react";
// reactstrap components
import {Button, Col, Form, FormFeedback, FormGroup, FormText, Input, InputGroupAddon, Modal} from "reactstrap";
import PropTypes from "prop-types";
import Label from "reactstrap/es/Label";
import {useForm} from "../../hooks";
import InputGroup from "reactstrap/es/InputGroup";
import InputGroupText from "reactstrap/es/InputGroupText";
import {getUrlWithSlash} from "../../utils/stringHelper";
import ConfirmModal from "./ConfirmModal";
import Row from "reactstrap/es/Row";

// core components

const TagModal = (props) => {
    const { toggleModal, isOpen, tag, form, onRemove } = props;
    const initialValues = tag || {};
    const [isConfirmRemoveOpen, setIsConfirmRemoveOpen] = useState(false);

    const toggleConfirmRemoveModal = useCallback(() => {
        setIsConfirmRemoveOpen(!isConfirmRemoveOpen);
    }, [isConfirmRemoveOpen]);

    const showRemoveTagHandler = useCallback(() => {
        toggleConfirmRemoveModal();
    }, []);
    return (
        <>
            <Modal toggle={() => { toggleModal(); }} isOpen={isOpen} className="modal-lg">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLiveLabel">
                        { tag ? 'Edit Tag' : 'New Tag' }
                    </h5>
                    <button
                        aria-label="Close"
                        className="close"
                        type="button"
                        onClick={() => { toggleModal(); }}
                    >
                        <span aria-hidden={true}>×</span>
                    </button>
                </div>

                <Form onSubmit={form.handleSubmit}>
                <div className="modal-body">
                        <FormGroup className="row">
                            <Label htmlFor="path" sm="4">
                                Name:
                            </Label>
                            <Col>
                                <Input
                                    id="name"
                                    defaultValue={initialValues.name}
                                    name="name"
                                    type="text"
                                    onChange={form.handleChange}
                                    invalid={!!form.errors.name}
                                />
                                <FormFeedback>{form.errors.name}</FormFeedback>
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Label htmlFor="path" sm="4">
                                Url:
                            </Label>
                            <Col>
                                <FormGroup>
                                    <Input
                                        id="path"
                                        defaultValue={initialValues.path}
                                        name="path"
                                        type="text"
                                        onChange={form.handleChange}
                                        invalid={!!form.errors.path}
                                    />
                                    <FormFeedback>{form.errors.path}</FormFeedback>
                                </FormGroup>
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Label htmlFor="script" sm="4">
                                JavaScript:
                            </Label>
                            <Col>
                                <Input
                                    className="text-monospace"
                                    id="script"
                                    defaultValue={initialValues.script}
                                    name="script"
                                    type="textarea"
                                    rows={7}
                                    onChange={form.handleChange}
                                    invalid={!!form.errors.script}
                                />
                                <FormFeedback>{form.errors.script}</FormFeedback>
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Label htmlFor="path" sm="4">
                                Delay:
                            </Label>
                            <Col>
                                <Input
                                    id="delay"
                                    defaultValue={initialValues.delay}
                                    name="delay"
                                    type="select"
                                    onChange={form.handleChange}
                                    invalid={!!form.errors.delay}
                                    data-single={true}
                                >
                                    <option value={0}>0s</option>
                                    <option value={5}>5s</option>
                                    <option value={10}>10s</option>
                                    <option value={15}>15s</option>
                                    <option value={20}>20s</option>
                                    <option value={25}>25s</option>
                                    <option value={30}>30s</option>
                                </Input>
                                <FormFeedback>{form.errors.delay}</FormFeedback>
                            </Col>
                        </FormGroup>
                </div>
                <div className="modal-footer">
                    {
                        tag && <Button
                            color="danger"
                            type="button"
                            onClick={showRemoveTagHandler}
                        >
                            Remove Tag
                        </Button>
                    }
                        <Button
                            className="ml-auto"
                            color="primary"
                            type="submit"
                            disabled={!window._.isEmpty(form.errors)}
                    >
                        Save changes
                    </Button>
                </div>

                </Form>
            </Modal>

            <ConfirmModal
                isOpen={isConfirmRemoveOpen}
                toggleModal={toggleConfirmRemoveModal}
                heading={`Are you sure to remove this tag?`}
                onConfirm={onRemove}
            />
        </>
    );
};


TagModal.propTypes = {
    toggleModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    tag: PropTypes.shape({
        path: PropTypes.string,
        script: PropTypes.string,
    }),
    form: PropTypes.shape({
        handleChange: PropTypes.func,
        handleSubmit: PropTypes.func,
    }),
    id: PropTypes.string,
    website: PropTypes.string,
    onRemove: PropTypes.func,
};

TagModal.defaultProps = {
    toggleModal: () => {},
    isOpen: false,
    tag: null,
    form: {},
    id: null,
    website: null,
    onRemove: () => {},
};

export default TagModal;