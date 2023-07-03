import { BaseStatuses } from "@kanban/data/Status";
import { useOnClickOutside } from "@kanban/hooks/useOnClickOutside";
import { kanbanApiContainer } from "@kanban/store/Api";
import { Button } from "@kanban/ui/Button";
import { CheckList } from "@kanban/ui/CheckList/CheckList";
import { DatePicker } from "@kanban/ui/DatePicker/DatePicker";
import { DateRange } from "@kanban/ui/DatePicker/DateRange";
import { Dropdown } from "@kanban/ui/Dropdown";
import { Text } from "@kanban/ui/Text";
import { TextArea } from "@kanban/ui/TextArea";
import { TextField } from "@kanban/ui/TextField";
import { BookmarkIcon, CalendarIcon, ClockIcon, PointsIcon } from "@kanban/ui/icons";
import { DropdownConverter } from "@kanban/utils/converters/DropdownConverter";
import { nameof } from "@kanban/utils/converters/nameof";
import { forwardRef, useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { useAppSelector } from "../../../../shared/src/store/Hooks";
import * as S from "./TaskCreate.styled";
export const TaskCreate = forwardRef(function TaskView(props, ref)
{
    const contentRef = useRef(null);
    useOnClickOutside(contentRef, props.onClose);
    const projects = kanbanApiContainer.useGetProjectsQuery().data;
    const tags = kanbanApiContainer.useGetTagsQuery().data;
    const users = kanbanApiContainer.useGetUsersQuery().data;

    const currentUser = useAppSelector(s => s.kanbanReducer.currentUser);
    const taskModel = {
        author: useAppSelector(state => state.kanbanReducer.currentUser),
        responsible: useAppSelector(state => state.kanbanReducer.currentUser),
        tag: tags?.[0],
        checkList: [],
        deadline: new Date(),
        isOnKanban: true,
        title: "Новая задача",
        description: "",
        project: useAppSelector(state => state.kanbanReducer.projectFilter) ?? projects?.[0],
        plannedDates: {
            begin: new Date(),
            end: new Date(),
        },
        status: BaseStatuses.ToWork,
        wastedTime: new Date(0),
    }

    const { control, getValues, reset } = useForm({ defaultValues: taskModel });
    useEffect(() => {reset(taskModel)}, [tags]);

    const handleSaveClick = () =>
    {
        props.onCreate(getValues());
    }

    return (
        <S.Wrapper ref={ref}>
            <S.Content ref={contentRef}>
                <S.Body>
                    <div>
                        <Controller
                            name={nameof("title")}
                            control={control}
                            render={
                                ({ field }) => <TextField
                                    onChange={field.onChange}
                                    value={field.value}
                                    placeholder="Название задачи"
                                    style={{ padding: 8, fontWeight: 500, fontSize: 20, lineHeight: "20px", marginBottom: 4 }}
                                />
                            }
                        />

                        <S.BaseTask>
                            Базовая задача: <span>Название задачи родителя</span>
                        </S.BaseTask>
                    </div>
                    <div>
                        <Controller
                            name={nameof("project")}
                            control={control}
                            render={
                                ({ field }) => <Dropdown
                                style={{ padding: "0 8px" }}
                                placeholder="Проект"
                                data={projects ?? []}
                                onSelect={field.onChange}
                                dataConverter={(item) => (
                                <DropdownConverter.Data.CreateTask>{item.name}</DropdownConverter.Data.CreateTask>
                    )}
                    idAccessor={(item) => item.id}
                    selectedConverter={(item) => <Text type="description-6">{item.name}</Text>}
                    placeholderConverter={(item) => <Text type="description-6">{item}</Text>}
                    selectedId={(field.value).id}
                    icon={<PointsIcon />}
                    />
                    }
                />

            </div>
            <div>
                <S.Inline>
                    <Controller
                        name={nameof("deadline")}
                        control={control}
                        render={
                            ({ field }) => <DatePicker label="Дедлайн" onChange={field.onChange} value={field.value} icon={<ClockIcon />} />
                        }
                    />

                    <div>
                        <Text indent={1} type="body-5">
                            Тег команды
                        </Text>
                        <Controller
                            name={nameof("tag")}
                            control={control}
                            render={
                                ({ field }) => <Dropdown
                                width={184}
                                data={tags ?? []}
                                dataConverter={(item) => (
                                <DropdownConverter.Data.CreateTask>{item.tag}</DropdownConverter.Data.CreateTask>
                    )}
                    idAccessor={(item) => item.id}
                    onSelect={field.onChange}
                    selectedConverter={(item) => <Text type="description-6">{item.tag}</Text>}
                    selectedId={(field?.value)?.id}
                    placeholder="Тег команды"
                    placeholderConverter={(item) => <Text type="description-6">{item}</Text>}
                    icon={<BookmarkIcon />}
                    />
                    }
                />

            </div>
            <Controller
                name={nameof("plannedDates")}
                control={control}
                render={
                    ({ field }) => <DateRange
                        from={(field.value).begin}
                        to={(field.value).end}
                        label="Планируемые сроки выполнения"
                        onChange={
                            (range) => field.onChange({
                                begin: range.from,
                                end: range.to
                            })
                        }
                        icon={<CalendarIcon />}
                    />
                }
            />

        </S.Inline>
</div>
    <Controller
        name={nameof("description")}
        control={control}
        render={
            ({ field }) => <TextArea onChange={field.onChange} value={field.value} placeholder="Описание" />
        }
    />

    <S.Inline>
        <div style={{ display: "flex", gap: 8 }}>
            <div style={{ display: "grid" }}>
                <Text indent={1} type="body-5">
                    Постановщик
                </Text>

                <Text type="description-7" style={{ display: "flex", justifySelf: "stretch" }}>
                    {`${currentUser.name} ${currentUser.surname}`}
                </Text>
            </div>
            <div>
                <Text indent={1} type="body-5">
                    Ответственный
                </Text>
                <Controller
                    name={nameof("responsible")}
                    control={control}
                    render={
                        ({ field }) => <Dropdown
                        data={users ?? []}
                        dataConverter={(item) => (
                        <DropdownConverter.Data.CreateTask>{`${item.name} ${item.surname}`}</DropdownConverter.Data.CreateTask>
            )}
            selectedId={(field.value).id}
            selectedConverter={(item) => (
            <DropdownConverter.Selected.CreateTask>{`${item.name} ${item.surname}`}</DropdownConverter.Selected.CreateTask>
            )}
            idAccessor={(item) => item.id}
            onSelect={field.onChange}
            placeholder="Не выбран"
            placeholderConverter={(item) => <Text type="description-4">{item}</Text>}
            />
            }
        />

    </div>
</div>
</S.Inline>
{/* <div>
                        <div style={{ display: "flex", gap: 8, marginBottom: 8, flexDirection: "column" }}>
                            <div style={{ display: "flex", gap: 8 }}>
                                <Text type="body-5">Исполнители</Text>
                                <PlusInsideBoxIcon
                                    onClick={() => setExecutors((prev) => [...prev, ""])}
                                    style={{ cursor: "pointer" }}
                                />
                            </div>
                            <div style={{ display: "flex", gap: 8, flexDirection: "column" }}>
                                {executors.map((x, i) => (
                                    <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                        <Dropdown
                                            data={["Иван", "Ксения", "Максим"]}
                                            dataConverter={(x) => (
                                                <DropdownConverter.Data.CreateTask>{x}</DropdownConverter.Data.CreateTask>
                                            )}
                                            selectedConverter={(x) => (
                                                <DropdownConverter.Selected.CreateTask>{x}</DropdownConverter.Selected.CreateTask>
                                            )}
                                            idAccessor={(x) => x}
                                            onSelect={(x) =>
                                            {
                                                const updated = [...executors];
                                                updated[i] = x;
                                                setExecutors(updated);
                                            }}
                                            placeholder="Исполнитель"
                                            placeholderConverter={(x) => <Text type="description-4">{x}</Text>}
                                            selectedId={x}
                                        />
                                        <CloseItem
                                            onClick={() =>
                                            {
                                                const updated = [...executors];
                                                updated.splice(i, 1);
                                                setExecutors(updated);
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div> */}
    <Controller
        name={nameof("checkList")}
        control={control}
        render={
            ({ field }) => <CheckList value={field.value} onChange={field.onChange} isReadonly={false} />
        }
    />
    <div>
        <S.TaskButtons>
            <Button onClick={handleSaveClick} variant="primary" style={{ padding: "0 16px" }}>
                Сохранить
            </Button>
            <Button onClick={props.onClose} variant="secondary" style={{ padding: "0 16px" }}>
                Отмена
            </Button>
        </S.TaskButtons>
    </div>
</S.Body>
</S.Content>
</S.Wrapper>
);
});
