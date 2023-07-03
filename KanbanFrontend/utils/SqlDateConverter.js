class SqlDateConverter {
    static toJs(dateString) {
        const date = new Date(dateString);

        return date;
    }

    static toSql(date) {
        const newDate = new Date(date).toISOString().slice(0, 19).replace('T', ' ');

        return newDate;
    }
}
