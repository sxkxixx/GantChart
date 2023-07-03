export function TaskConverter() {
    const fullDtoToSerializable = (dto) => {
        return {
            id: dto.task_id,
            author: {
                id: dto.responsible_id,
                name: dto.responsible_first_name,
                surname: dto.responsible_last_name,
                patronymic: dto.responsible_patronymic
            },
            responsible: {
                id: dto.responsible_id,
                name: dto.responsible_first_name,
                surname: dto.responsible_last_name,
                patronymic: dto.responsible_patronymic
            },
            checkList: dto.stages.map((s) => ({
                id: s.id,
                isCompleted: !!s.is_ready,
                title: s.description
            })),
            contractors: [],
            deadline: SqlDateConverter.toJs(dto.deadline).getMilliseconds(),
            description: dto.description,
            parentTask: {
                id: dto.parent_id
            },
            plannedDates: {
                begin: SqlDateConverter.toJs(dto.planned_start_date).getMilliseconds(),
                end: SqlDateConverter.toJs(dto.planned_final_date).getMilliseconds()
            },
            project: {
                id: dto.project_id,
                name: dto.project_name
            },
            tag: {
                id: dto.team_id,
                tag: dto.team_tag
            },
            status: {
                id: dto.status_id,
                name: dto.status_name
            },
            title: dto.task_name,
            wastedTime: SqlDateConverter.toJs(dto.responsible_time_spent).getMilliseconds(),
            isOnKanban: !!dto.is_on_kanban,
            comments: dto.comments.map((comment) => ({
                author: {
                    id: comment.author_id,
                    name: comment.author_first_name,
                    surname: comment.author_last_name,
                    patronymic: comment.author_patronymic
                },
                content: comment.content,
                id: comment.id,
                time: comment.created_at ? SqlDateConverter.toJs(comment.created_at).getMilliseconds() : undefined // позже напишу selector или hook
            }))
        };
    };

    const fullModelToDto = (task) => {
        return {
            task_id: task.id,
            task_name: task.title,
            description: task.description,
            deadline: SqlDateConverter.toSql(task.deadline),
            is_on_kanban: task.isOnKanban ? 1 : 0,
            project_id: task.project.id,
            project_name: task.project.name,
            status_id: task.status.id,
            status_name: task.status.name,
            responsible_id: task.responsible.id,
            responsible_first_name: task.responsible.name,
            responsible_last_name: task.responsible.surname,
            responsible_patronymic: task.responsible.patronymic,
            responsible_time_spent: SqlDateConverter.toSql(task.wastedTime),
            team_id: task.tag?.id,
            team_tag: task.tag?.tag,
            planned_start_date: SqlDateConverter.toSql(task.plannedDates.begin),
            planned_final_date: SqlDateConverter.toSql(task.plannedDates.end),
            stages: task.checkList?.map((stage) => {
            if (stage.id) {
                return {
                    id: stage.id,
                    description: stage.title,
                    is_ready: stage.isCompleted ? 1 : 0
                };
            }

            return {
                description: stage.title,
                is_ready: stage.isCompleted ? 1 : 0
            };
        }),
            comments: task.comments?.map((comment) => ({
            id: comment.id,
            content: comment.content,
            author_id: comment.author.id,
            author_first_name: comment.author.name,
            author_last_name: comment.author.surname,
            author_patronymic: comment.author.patronymic
        }))
    };
    };
}
