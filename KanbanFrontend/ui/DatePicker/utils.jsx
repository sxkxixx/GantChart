export function getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

export function getPreviousYear(month, year) {
    return month === 1 ? year - 1 : year;
}

export function getPreviousMonth(month) {
    return month === 1 ? 12 : month - 1;
}

export function getNextYear(month, year) {
    return month === 12 ? year + 1 : year;
}

export function getNextMonth(month) {
    return month === 12 ? 1 : month + 1;
}

const months = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
];

export function getMonth(month) {
    return months[month - 1];
}

function padStart(arr, currentMonth, currentYear) {
    const copy = [...arr];
    let daysInPreviousMonth =
        currentMonth === 0 ? getDaysInMonth(12, currentYear - 1) : getDaysInMonth(currentMonth - 1, currentYear);

    while (copy[0].getDay() !== 1) {
        const previousYear = getPreviousYear(currentMonth - 1, currentYear);
        const previousMonth = getPreviousMonth(currentMonth - 1);
        copy.unshift(new Date(previousYear, previousMonth, daysInPreviousMonth--));
    }

    return copy;
}

function padEnd(arr, currentMonth, currentYear) {
    const copy = [...arr];

    let counter = 1;
    const daysInFiveLines = 7 * 5;
    const daysInSixLines = 7 * 6;
    if (copy.length > daysInFiveLines) {
        while (copy.length < daysInSixLines) {
            const nextYear = getNextYear(currentMonth - 1, currentYear);
            const nextMonth = getNextMonth(currentMonth - 1);
            copy.push(new Date(nextYear, nextMonth, counter++));
        }
        return copy;
    }

    while (copy.length < daysInFiveLines) {
        const nextYear = getNextYear(currentMonth - 1, currentYear);
        const nextMonth = getNextMonth(currentMonth - 1);
        copy.push(new Date(nextYear, nextMonth, counter++));
    }

    return copy;
}

export function fillByDate(currentMonth, currentYear) {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);

    const daysInCurrentMonth = Array.from({ length: daysInMonth }).map(
        (_, i) => new Date(currentYear, currentMonth - 1, i + 1)
    );

    const filledInStart = padStart(daysInCurrentMonth, currentMonth, currentYear);
    const filledInEnd = padEnd(filledInStart, currentMonth, currentYear);

    return filledInEnd;
}

export function getDate(date) {
    const noNullableDate = date ? date : new Date();
    return {
        day: noNullableDate.getDay(),
        month: noNullableDate.getMonth() + 1,
        year: noNullableDate.getFullYear(),
    };
}
