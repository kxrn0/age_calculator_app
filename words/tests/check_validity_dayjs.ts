import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";

dayjs.extend(customParseFormat);

const v1 = "2020/03/02";
const i1 = "2020/03/200";

console.log(dayjs(v1, "YYYY/MM/DD", true).isValid());
console.log(dayjs(i1, "YYYY/MM/DD", true).isValid());
