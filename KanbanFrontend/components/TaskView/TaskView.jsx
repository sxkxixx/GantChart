import { forwardRef, useRef, useState } from "react";
import { useOnClickOutside } from "@kanban/hooks/useOnClickOutside";
import { TimerIcon } from "@kanban/ui/icons/Timer";
import { PointsIcon } from "@kanban/ui/icons/Points";
import * as S from "./TaskView.styled";
import { DateView } from "@kanban/ui/DatePicker/DateView";
import { BookmarkIcon, CalendarIcon, ClockIcon, PlayIcon, TrashIcon } from "@kanban/ui/icons";
import { Text } from "@kanban/ui/Text";
import { CheckboxGroup } from "@kanban/ui/Checkbox/CheckboxGroup";
import { Checkbox } from "@kanban/ui/Checkbox";
import { Button } from "@kanban/ui/Button";
import { TextField } from "@kanban/ui/TextField";
import { TaskViewComments } from "./TaskViewComments";
import { mockComments } from "@kanban/mock/MockComments";
import { CSSTransition } from "react-transition-group";
import { DateRangeView } from "@kanban/ui/DatePicker/DateRangeView";
import { TextView } from "@kanban/ui/TextArea/TextView";

export const TaskView = forwardRef(function TaskView(props, ref) {
    const contentRef = useRef(null);
    useOnClickOutside(contentRef, props.onClose);

    const [comment, setComment] = useState("");
    const [comments, setComments] = useState(mockComments);

    function onSendComment() {
        setComment("");
        setComments((prev) => [
            {
                name: "user01",
                text: comment,
                time: new Date(),
            },
            ...prev,
        ]);
    }

    return (
        <S.Wrapper ref={ref}>
            <S.Content ref={contentRef}>
                <S.Body>
                    <div>
                        <Text type="body-8" indent={1} style={{ padding: "8px 0" }}>
                            {props.task.title}
                        </Text>
                        <S.BaseTask>
                            Базовая задача: <span>Название задачи родителя</span>
                        </S.BaseTask>
                        <S.Status>Статус “{props.task.status.name}”</S.Status>
                    </div>
                    <div>
                        <Text indent={1} type="body-5">
                            Проект
                        </Text>
                        <S.Field width={184}>
                            <PointsIcon />
                            <Text type="description-6">{props.task.project.name}</Text>
                        </S.Field>
                    </div>
                    <S.Inline>
                        <DateView label="Дедлайн" value={new Date()} icon={<TimerIcon />} />
                        <div>
                            <Text indent={1} type="body-5">
                                Тег команды
                            </Text>
                            <S.Field width={184}>
                                <BookmarkIcon />
                                <Text type="description-6">{props.task.tag.tag}</Text>
                            </S.Field>
                        </div>
                        <DateRangeView
                            label="Планируемые сроки выполнения"
                            from={new Date()}
                            to={new Date()}
                            icon={<CalendarIcon />}
                        />
                    </S.Inline>
                    <TextView value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation" />
                    <div style={{ display: "flex", gap: 8 }}>
                        <div>
                            <Text indent={1} type="body-5">
                                Постановщик
                            </Text>
                            <Text type="description-7">{`${props.task.author.name} ${props.task.author.surname}`}</Text>
                        </div>
                        <div>
                            <Text indent={1} type="body-5">
                                Ответственный
                            </Text>
                            <S.Field>
                                <Text type="description-7">{`${props.task.author.name} ${props.task.author.surname}`}</Text>
                            </S.Field>
                        </div>
                    </div>
                    <div>
                        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                            <Text type="body-5">Исполнители</Text>
                        </div>
                        <div>
                            <Text type="description-7">{`${props.task.author.name} ${props.task.author.surname}`}</Text>
                        </div>
                    </div>
                    <div>
                        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                            <Text type="body-5">Чек лист</Text>
                        </div>
                        <CheckboxGroup onChange={console.log} readonly>
                            <Checkbox value="1 пункт" label="1 пункт" />
                            <Checkbox value="2 пункт" label="2 пункт" />
                            <Checkbox value="3 пункт" label="3 пункт" />
                            <Checkbox value="4 пункт" label="4 пункт" />
                        </CheckboxGroup>
                    </div>
                    <div>
                        <Text indent={2} type="body-5">
                            Таймер
                        </Text>
                        <S.TimerWrapper>
                            <S.Field width={118}>
                                <ClockIcon />
                                <Text type="body-1">100:60:60</Text>
                            </S.Field>
                            <S.TaskButtons>
                                <Button onClick={() => {}} variant="primary" style={{ padding: 8 }}>
                                    <PlayIcon />
                                </Button>
                                <Button onClick={() => {}} variant="primary" style={{ padding: "0 16px" }}>
                                    Сохранить
                                </Button>
                                <Button onClick={() => {}} variant="secondary" style={{ padding: 8 }}>
                                    <TrashIcon />
                                </Button>
                            </S.TaskButtons>
                        </S.TimerWrapper>
                    </div>
                    <div>
                        <Text indent={2} type="body-5">
                            Затраченное время
                        </Text>
                        <Text type="description-7">10:12:56 Иван Иванович Иванов</Text>
                    </div>
                    <div style={{ marginBottom: 48 }}>
                        <S.TaskButtons>
                            <Button onClick={props.onEdit} variant="primary" style={{ padding: "0 16px" }}>
                                Редактировать
                            </Button>
                            <Button onClick={() => {}} variant="danger" style={{ padding: "0 16px" }}>
                                Удалить задачу
                            </Button>
                            <Button onClick={() => {}} variant="secondary" style={{ padding: "0 16px" }}>
                                Убрать с канбан доски
                            </Button>
                        </S.TaskButtons>
                    </div>
                </S.Body>
                <S.Comments>
                    <TextField
                        onChange={setComment}
                        value={comment}
                        label="Комментарии"
                        placeholder="Введите комментарий..."
                        onKeyDown={(e) => e.key === "Enter" && onSendComment()}
                    />
                    <CSSTransition timeout={300} in={Boolean(comment)} unmountOnExit>
                        <S.AnimatedButton>
                            <Button variant="primary" onClick={onSendComment}>
                                Отправить
                            </Button>
                        </S.AnimatedButton>
                    </CSSTransition>
                    <TaskViewComments comments={props.task.comments} />
                </S.Comments>
            </S.Content>
        </S.Wrapper>
    );
});
