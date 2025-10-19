import dayjs from "dayjs";
import Duration from "dayjs/plugin/duration.js";

dayjs.extend(Duration);

const today = dayjs();
const yesterday = dayjs("1996/08/05", "YYYY/MM/DD", true);

console.log(dayjs.duration(today.diff(yesterday)).years());
