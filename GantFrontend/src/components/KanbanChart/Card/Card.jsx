import React from 'react';
import s from './Card.module.css'

const Card = ({ items,
                  key,
                  board,
                  dragOverHandler,
                  dragLeaveHandler,
                  dragStartHandler,
                  dragEndHandler,
                  dropHandler
}) => {

    return (
        <>
            <div
                className={s.item}
                key={key}
                draggable={"true"}
                onDragOver={(e) => dragOverHandler(e)}
                onDragLeave={(e) => dragLeaveHandler(e)}
                onDragStart={(e) => dragStartHandler(e, board, items)}
                onDragEnd={(e) => dragEndHandler(e)}
                onDrop={(e) => dropHandler(e, board, items)}
            >
                {items.name}
            </div>
        </>
    );
};


export default Card;
