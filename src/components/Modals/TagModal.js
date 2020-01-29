import React, { useCallback } from "react";
// reactstrap components
import {Button, Col, Form, FormFeedback, FormGroup, FormText, Input, Modal} from "reactstrap";
import PropTypes from "prop-types";
import Label from "reactstrap/es/Label";
import {useForm} from "../../hooks";
import InputGroup from "reactstrap/es/InputGroup";
import InputGroupText from "reactstrap/es/InputGroupText";

// core components

const TagModal = (props) => {
    const { toggleModal, isOpen, initialValues, form, id } = props;

    return (
        <>
            <Modal toggle={toggleModal} isOpen={isOpen} className="modal-lg">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLiveLabel">
                        { id ? 'Edit Client' : 'New Tag' }
                    </h5>
                    <button
                        aria-label="Close"
                        className="close"
                        type="button"
                        onClick={toggleModal}
                    >
                        <span aria-hidden={true}>×</span>
                    </button>
                </div>

                <Form onSubmit={form.handleSubmit}>
                <div className="modal-body">
                        <FormGroup className="row">
                            <Label htmlFor="path" sm="4">
                                Path:
                            </Label>
                            <Col>
                                <FormGroup>
                                    <Input
                                        className="w-100"
                                        id="path"
                                        defaultValue={initialValues.name}
                                        name="path"
                                        type="text"
                                        onChange={form.handleChange}
                                        invalid={!!form.errors.name}
                                    />
                                    <FormFeedback>{form.errors.name}</FormFeedback>
                                </FormGroup>
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Label htmlFor="script" sm="4">
                                JavaScript:
                            </Label>
                            <Col>
                                <Input
                                    className="w-100"
                                    id="script"
                                    defaultValue={initialValues.website}
                                    name="script"
                                    type="text"
                                    onChange={form.handleChange}
                                />
                            </Col>
                        </FormGroup>
                </div>
                <div className="modal-footer">
                    <Button
                        color="danger"
                        type="button"
                        onClick={toggleModal}
                    >
                        Remove Client
                    </Button>
                    <Button
                        color="primary"
                        type="submit"
                        onClick={toggleModal}
                        disabled={!window._.isEmpty(form.errors)}
                    >
                        Save changes
                    </Button>
                </div>

                </Form>
            </Modal>
        </>
    );
};


TagModal.propTypes = {
    toggleModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onSave: PropTypes.func.isRequired,
    initialValues: PropTypes.shape({
        name: PropTypes.string,
        website: PropTypes.string,
    }),
    form: PropTypes.shape({
        handleChange: PropTypes.func,
        handleSubmit: PropTypes.func,
    }),
    id: PropTypes.string,
};

TagModal.defaultProps = {
    toggleModal: () => {},
    isOpen: false,
    onSave: () => {},
    initialValues: {},
    form: {},
    id: null,
};

export default TagModal;