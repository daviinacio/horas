import * as utils from '../../utils/index.js';
import type { MonthNumber } from "../../types.js";
import { config } from "../../config.js";
import { getMonthFolderName } from "../../constants.js";

export function getYearPathByDate(date: Date): string {
  return `${config.get('timesheet_folder')}/${date.getFullYear()}`;
}

export function getMonthPathByDate(date: Date): string {
  return `${getYearPathByDate(date)}/${getMonthFolderName(date.getMonth() + 1 as MonthNumber)}`;
}

export function getTimesheetFilenameByDate(date: Date): string {
  return utils.date.format(date, config.get('timesheet_filename')) + '.md';
}

export function getTimesheetFilePathByDate(date: Date): string {
  return `${getMonthPathByDate(date)}/${getTimesheetFilenameByDate(date)}`;
}

export function getCurrentTemplatePath(): string {
  return `${config.get('template_folder')}/${config.get('template_filename')}`;
}
