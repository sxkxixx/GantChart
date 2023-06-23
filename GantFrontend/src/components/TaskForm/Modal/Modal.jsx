import React from 'react';
import s from './Modal.module.css'
import {ReactComponent as Close} from '../../../assets/img/closeModal.svg'
import CreateForm from "../CreateForm/CreateForm";
import EditForm from "../EditForm/EditForm";
import ViewForm from "../ViewForm/ViewForm";

const Modal = ({parentId, showModal, setShowModal, formType, setFormType}) => {
    const closeForm = () =>{
        setFormType('')
        setShowModal(false)
    }

    return (
        <>
            {showModal ? (
                <div className={s.container} onClick={() => setShowModal(false)}>
                    <div className={s.modal} onClick={e => e.stopPropagation()}>
                        <button className={s.close} onClick={closeForm}><Close/></button>
                        {formType === 'create' && (<CreateForm setShowModal={setShowModal} parentId={parentId}/>)}
                        {formType === 'edit' && (<EditForm setShowModal={setShowModal} parentId={parentId}/>)}
                        {formType === 'view' && (<ViewForm setShowModal={setShowModal} parentId={parentId}/>)}
                    </div>
                </div>
            ) : null}
        </>
    );
};

export default Modal;
