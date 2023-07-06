import { useOnClickOutside } from "@kanban/hooks/useOnClickOutside";
import { useEffect, useRef, useState } from "react";
import { ArrowIcon } from "../icons";
import { Text } from "../Text";
import * as S from "./DatePicker.styled";
import { DatePickerDropdown } from "./DatePickerDropdown";
import { getDate } from "./utils";

export function DatePicker(props) {
    const [open, setOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(getDate(props.value));
    const ref = useRef(null);
    useOnClickOutside(ref, closeDropdown);

    useEffect(() => {
        if (props.value) {
            setCurrentDate({
                day: props.value.getDate(),
                month: props.value.getMonth() + 1,
                year: props.value.getFullYear(),
            });
        }
    }, [props.value]);

    function closeDropdown() {
        setOpen(false);
    }

    function getViewDate() {
        return `${currentDate.day.toString().padStart(2, "0")}
        .${currentDate.month.toString().padStart(2, "0")}
        .${currentDate.year}`;
    }

    return (
        <S.Date ref={ref}>
            <div>
                <Text indent={1} type="body-5">
                    {props.label}
                </Text>
                <S.Field onClick={() => setOpen(!open)}>
                    {props.icon}
                    <Text style={{ flexGrow: 1 }} type="description-6">
                        {getViewDate()}
                    </Text>
                    <ArrowIcon style={{ transitionDuration: ".3s", transform: `rotate3d(1, 0, 0, ${open ? 180 : 0}deg)` }} />
                </S.Field>
            </div>
            {open && <DatePickerDropdown currentDate={currentDate} close={closeDropdown} onDateChange={setCurrentDate} />}
        </S.Date>
    );
}
