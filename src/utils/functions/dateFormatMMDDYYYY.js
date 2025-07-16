export function dateFormatMMDDYYYY(dateStr) {
    if (!dateStr || dateStr === "" || dateStr === "Invalid Date") return null;
    const date = new Date(dateStr);
    if (isNaN(date)) return null;

    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
}
