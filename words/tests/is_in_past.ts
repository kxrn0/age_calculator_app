import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const today = dayjs();
const yesterday = dayjs("2025/11/01", "YYYY/MM/DD", true);

console.log(today.isAfter(yesterday));
