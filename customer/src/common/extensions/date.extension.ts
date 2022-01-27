import * as moment from "moment";

declare global {
    interface DateConstructor {
        nowUtc(): Date;
    }
}

Date.nowUtc = function (): Date {
    return moment().utc().toDate();
};

export { };