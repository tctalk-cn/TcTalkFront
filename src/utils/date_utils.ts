import {format} from 'date-fns';

/**
 * 日期格式化工具
 * @param dateTimeStr 日期字符画
 * @param formatStr 格式化字符串
 */
export function formatDateTime(dateTimeStr: string, formatStr: string): string {
    const dateTime = new Date(dateTimeStr);
    return format(dateTime, formatStr);
}