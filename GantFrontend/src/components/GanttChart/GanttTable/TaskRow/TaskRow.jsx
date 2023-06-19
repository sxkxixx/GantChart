import React from 'react';
import styled from 'styled-components';
import {ReactComponent as Add} from '../../../../assets/img/addButton.svg'
import {ReactComponent as Path} from '../../../../assets/img/path.svg'
import {ReactComponent as Vector} from '../../../../assets/img/vector.svg'

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
                        {task.name}
                    </Title>
                    <Right>
                        {!hasChildren && <input type="checkbox" checked={task.completed} onChange={() => {}}/>}
                        <Buttons>
                            <button onClick={onAddButtonClick}><Add/></button>
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
