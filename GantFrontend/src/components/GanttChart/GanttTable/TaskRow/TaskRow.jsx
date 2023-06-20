import React, {useState} from 'react';
import styled from 'styled-components';
import {ReactComponent as Add} from '../../../../assets/img/addButton.svg'
import {ReactComponent as Path} from '../../../../assets/img/path.svg'
import {ReactComponent as Vector} from '../../../../assets/img/vector.svg'
import Modal from "../../../TaskForm/Modal/Modal";

const StyledTaskRow = styled.tr`
  & td {
    display: flex;
    justify-content: space-between;
    height: 42px;
    width: 100%;
  }
`;

const Title = styled.div`
  display: flex;
  flex-direction: row;
  padding-left: 8px;
`;

const CollapseButton = styled.span`
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Right = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  align-items: center;
  justify-content: center;

  input[type=checkbox] {
    position: relative;
    width: 16px;
    height: 16px;
    border: 2px solid #AFBAC3;
    border-radius: 5px;

    &:checked {
      background: #56C568;
      border-radius: 5px;
    }
  }
`;


const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 40px;
`;

const TaskRow = ({
                     task,
                     indentLevel = 0,
                     collapsedTasks = [],
                     toggleTaskCollapse,
                     onAddButtonClick,
                 }) => {
    const hasChildren = task.children && task.children.length > 0;

    const isCollapsed = collapsedTasks.includes(task.id);

    const [formType, setFormType] = useState('')
    const [showModal, setShowModal] = useState(false)

    const openForm = (type) => {
        setFormType(type);
        setShowModal(true);
    };

    return (
        <>
            <StyledTaskRow>
                <td style={{paddingLeft: `${indentLevel * 20}px`}}>
                    <Title>
                        {hasChildren && (
                            <CollapseButton onClick={() => toggleTaskCollapse(task.id)}>
                                {isCollapsed ? <Path /> : <Vector />}
                            </CollapseButton>
                        )}
                        <span style={{cursor: "pointer"}} onClick={()=>openForm('view')}>{task.name}</span>
                    </Title>
                    <Right>
                        {!hasChildren && <input type="checkbox" checked={task.is_on_kanban} onChange={() => {}}/>}
                        <Buttons>
                            <button onClick={()=>openForm('create')}><Add/></button>
                            <Modal showModal={showModal} setShowModal={setShowModal} formType={formType} setFormType={setFormType}/>
                        </Buttons>
                    </Right>
                </td>
            </StyledTaskRow>

            {hasChildren &&
                !isCollapsed &&
                task.children.map((childTask) => (
                    <TaskRow
                        key={childTask.id}
                        task={childTask}
                        indentLevel={indentLevel + 1}
                        collapsedTasks={collapsedTasks}
                        toggleTaskCollapse={toggleTaskCollapse}
                        onAddButtonClick={onAddButtonClick}
                    />
                ))}
        </>
    );
};

export default TaskRow;
