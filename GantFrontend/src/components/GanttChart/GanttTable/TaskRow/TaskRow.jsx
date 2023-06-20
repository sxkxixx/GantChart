import React, {useState} from 'react';
import styled from 'styled-components';
import {ReactComponent as Add} from '../../../../assets/img/addButton.svg'
import {ReactComponent as Path} from '../../../../assets/img/path.svg'
import {ReactComponent as Vector} from '../../../../assets/img/vector.svg'
import Check from '../../../../assets/img/check.svg'
import Modal from "../../../TaskForm/Modal/Modal";
import {kanbanView} from "../../../../services/task";
import {useRecoilState, useRecoilValue} from "recoil";
import {tasksState} from "../../../../store/atom";

const StyledTaskRow = styled.tr`
  display: block;
  height: 42px;
  & td {
    display: flex;
    justify-content: space-between;
    height: 100%;
    padding: 0;
  }
`;

const Title = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
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
  align-items: center;
  justify-content: center;
  width: 120px;
  gap: 15px;
  height: 100%;
  
  button{
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease-in-out;
  }

  button:hover{
    transform: scale(1.2);
  }

  button svg {
    width: 22px;
    height: 22px;
  }

  input[type="checkbox"] {
    appearance: none;
    width: 18px;
    height: 18px;
    border: 2px solid #AFBAC3;
    border-radius: 5px;
    transition: all 0.2s ease-in-out;
  }

  input[type="checkbox"]:checked {
    border: transparent;
  }

  input[type="checkbox"]:checked::before {
    padding: 0 2px;
    content: url(${Check});
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    color: #fff;
    background-color: #56C568;
    background-position: center;
    transition: all 0.2s ease-in-out;
  }
  
  input[type="checkbox"]:hover {
    border-color: #56C568;
  }

  input[type="checkbox"]:hover:checked {
    background-color: #56C568;
  }

  input[type="checkbox"]:hover:checked::before {
    transform: scale(1.2);
  }

  input[type="checkbox"]:hover:not(:checked) {
    transform: scale(1.2);
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
    const parentId = task.id || null
    const isCollapsed = collapsedTasks.includes(task.id);
    const [formType, setFormType] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [tasks, setTasks] = useRecoilState(tasksState);


    const openForm = (type) => {
        setFormType(type);
        setShowModal(true);
    };

    const toggleKanbanView = async (id, isOnKanban) => {
        try {
            await kanbanView(id);
            const updatedTasks = tasks.map((task) =>
                task.id === id ? {...task, is_on_kanban: !isOnKanban} : task
            );
            setTasks(updatedTasks);
        } catch (error) {
            console.log(error);
        }
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
                        {!hasChildren && <input type="checkbox"
                                                checked={task.is_on_kanban}
                                                onChange={() => toggleKanbanView(task.id, task.is_on_kanban)}
                        />}
                        <Buttons>
                            <button onClick={()=>openForm('create')}><Add/></button>
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
            <Modal parent={parentId} showModal={showModal} setShowModal={setShowModal} formType={formType} setFormType={setFormType}/>
        </>
    );
};

export default TaskRow;
