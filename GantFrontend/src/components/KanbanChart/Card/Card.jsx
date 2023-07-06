import React from 'react';

const Card = ({
                  items,
                  key,
                  board,
                  dragOverHandler,
                  dragStartHandler,
                  className
              }) => {
    return (
        <>
            <div
                className={className}
                key={key}
                draggable={"true"}
                onDragOver={(e) => dragOverHandler(e)}
                onDragStart={(e) => dragStartHandler(e, board, items)}
            >
                {items.name}
            </div>
        </>
    );
};

export default Card;
