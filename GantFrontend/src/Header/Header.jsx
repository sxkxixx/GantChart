import React, { useState } from 'react';
import s from './Header.module.css';
import { useNavigate } from 'react-router-dom';
import {useRecoilState} from "recoil";
import {timerState} from "../store/atom";

const Header = () => {
    const [showTaskInfo, setShowTaskInfo] = useState(false);
    const [activeCategory, setActiveCategory] = useState('kanban');
    const [timer, setTimer] = useRecoilState(timerState);

    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const seconds = (totalSeconds % 60).toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    const startTimer = () => {
        if (!timer.isRunning) {
            const timerId = setInterval(() => {
                setTimer((prevTimer) => ({
                    ...prevTimer,
                    time: prevTimer.time + 1,
                }));
            }, 1000);

            setTimer((prevTimer) => ({
                ...prevTimer,
                isRunning: true,
                timerId,
            }));
        }
    };

    const stopTimer = () => {
        if (timer.isRunning) {
            clearInterval(timer.timerId);
            setTimer((prevTimer) => ({
                ...prevTimer,
                isRunning: false,
            }));
        }
    };

    const resetTimer = () => {
        clearInterval(timer.timerId);
        setTimer({
            time: 0,
            isRunning: false,
            timerId: null,
        });
    };

    const handleTaskClick = () => {
        setShowTaskInfo(!showTaskInfo);
    };

    const navigate = useNavigate();

    const handleCategoryClick = (category) => {
        setActiveCategory(category);
        if (category === 'kanban') {
            navigate('/kanban');
        } else if (category === 'gantt') {
            navigate('/gantt');
        }
    };

    return (
        <div className={s.container}>
            <div className={s.left}>
                <p className={s.logo}>
                    <h1 style={{ fontSize: '24px', display: 'flex', flexDirection: 'row' }}>Л.К. Стажера</h1>
                </p>
                <button className={s.profile}> Личный кабинет</button>
                <div className={s.category}>
                    <button
                        className={activeCategory === 'kanban' ? s.activeCategory : s.disableCategory}
                        onClick={() => handleCategoryClick('kanban')}
                    >
                        Канбан
                    </button>
                    <button
                        className={activeCategory === 'gantt' ? s.activeCategory : s.disableCategory}
                        onClick={() => handleCategoryClick('gantt')}
                    >
                        Гант
                    </button>
                </div>
            </div>
            <div className={s.right}>
                <div className={s.time}>
                    <button onClick={handleTaskClick}>Название задачи</button>
                    {showTaskInfo && (
                        <div className={s.taskInfo}>
                            <div className={s.taskInfo_left}>
                                <span>Название задачи</span>
                                <button>Информация о задаче</button>
                            </div>
                            <div className={s.taskInfo_right}>
                <span>
                  <p>{formatTime(timer.time)}</p>
                </span>
                                <div className={s.taskInfo_time}>
                                    <button onClick={timer.isRunning ? stopTimer : startTimer}  className={s.play}>
                                        {timer.isRunning ? 'О' : 'В'}
                                    </button>
                                    <button className={s.save}>Сохранить</button>
                                    <button onClick={resetTimer} className={s.trash}>
                                        С
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    <span>
            <p>{formatTime(timer.time)}</p>
          </span>
                </div>
                <button className={s.exit}>Выход</button>
            </div>
        </div>
    );
};

export default Header;
