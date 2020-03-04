import React, { useCallback, useState } from "react";
// reactstrap components
import {Button, Col, Form, FormFeedback, FormGroup, FormText, Input, Modal} from "reactstrap";
import PropTypes from "prop-types";
import Label from "reactstrap/es/Label";
import ConfirmModal from "./ConfirmModal";

// core components

const EditClientModal = (props) => {
    const { toggleModal, isOpen, initialValues, form, onRemove } = props;
    const [isConfirmRemoveOpen, setIsConfirmRemoveOpen] = useState(false);

    const toggleConfirmRemoveModal = useCallback(() => {
        setIsConfirmRemoveOpen(!isConfirmRemoveOpen);
    }, [isConfirmRemoveOpen]);

    const showRemoveClientHandler = useCallback(() => {
        toggleConfirmRemoveModal();
        toggleModal();
    }, []);

    return (
        <>
            <Modal toggle={toggleModal} isOpen={isOpen} className="modal-lg">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLiveLabel">
                        Edit Client
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
                            <Label htmlFor="clientName" sm="4">
                                Client Name:
                            </Label>
                            <Col>
                                <FormGroup>
                                    <Input
                                        className="w-100"
                                        id="clientName"
                                        defaultValue={initialValues.name}
                                        name="name"
                                        type="text"
                                        onChange={form.handleChange}
                                        invalid={!!form.errors.name}
                                    />
                                    <FormFeedback>{form.errors.name}</FormFeedback>
                                </FormGroup>
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Label htmlFor="clientWebsite" sm="4">
                                Client Website:
                            </Label>
                            <Col>
                                <Input
                                    className="w-100"
                                    id="clientWebsite"
                                    defaultValue={initialValues.website}
                                    name="website"
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
                        onClick={showRemoveClientHandler}
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

            <ConfirmModal
                isOpen={isConfirmRemoveOpen}
                toggleModal={toggleConfirmRemoveModal}
                heading={`Are you sure to remove ${initialValues.name}?`}
                onConfirm={onRemove}
            />
        </>
    );
};


EditClientModal.propTypes = {
    toggleModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    initialValues: PropTypes.shape({
        name: PropTypes.string,
        website: PropTypes.string,
    }),
    form: PropTypes.shape({
        handleChange: PropTypes.func,
        handleSubmit: PropTypes.func,
    }),
    onRemove: PropTypes.func,
};

EditClientModal.defaultProps = {
    toggleModal: () => {},
    isOpen: false,
    initialValues: {},
    form: {},
    onRemove: () => {},
};

export default EditClientModal;