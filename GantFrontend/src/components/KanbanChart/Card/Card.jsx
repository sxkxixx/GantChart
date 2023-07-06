import React from 'react';
import s from './Card.module.css'
import {ReactComponent as User} from "../../../assets/img/User.svg";
import {ReactComponent as Cal} from "../../../assets/img/calendar.svg";

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
               <span className={s.title}>{items.name}</span>
                <span className={s.project}>{items.project}</span>
                <span className={s.team}>#{items.team}</span>
                <span className={s.user}><User/>{items.user}</span>
                <span className={s.deadline}><Cal/>{items.deadline}</span>
            </div>
        </>
    );
};

export default Card;
