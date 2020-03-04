import React, { useCallback } from "react";
// reactstrap components
import {Button, Col, Form, FormFeedback, FormGroup, FormText, Input, Modal} from "reactstrap";
import PropTypes from "prop-types";
import Label from "reactstrap/es/Label";
import {useForm} from "../../hooks";
import InputGroup from "reactstrap/es/InputGroup";
import InputGroupText from "reactstrap/es/InputGroupText";

// core components

const ConfirmModal = (props) => {
    const { toggleModal, isOpen, heading, message, confirmLabel, onConfirm } = props;
    const confirmHandler = useCallback(() => {
        onConfirm();
        toggleModal();
    }, [toggleModal, onConfirm]);
    return (
        <>
            <Modal toggle={toggleModal} isOpen={isOpen} className="modal-xl">
                <div className="modal-header">
                    {
                        heading && <h5 className="modal-title" id="exampleModalLiveLabel">{ heading }</h5>
                    }
                    <button
                        aria-label="Close"
                        className="close"
                        type="button"
                        onClick={toggleModal}
                    >
                        <span aria-hidden={true}>×</span>
                    </button>
                </div>

                <div className="modal-body">
                    { message }
                </div>
                <div className="modal-footer">
                    <Button
                        type="button"
                        onClick={toggleModal}
                    >
                        Cancel
                    </Button>
                    <Button
                        color="primary"
                        onClick={confirmHandler}
                    >
                        { confirmLabel }
                    </Button>
                </div>
            </Modal>
        </>
    );
};


ConfirmModal.propTypes = {
    toggleModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    heading: PropTypes.string,
    message: PropTypes.string,
    onConfirm: PropTypes.func.isRequired,
    confirmLabel: PropTypes.string,
};

ConfirmModal.defaultProps = {
    toggleModal: () => {},
    isOpen: false,
    heading: null,
    message: null,
    onConfirm: () => {},
    confirmLabel: "Confirm",
};

export default ConfirmModal;