type TestProp = {
  name: string;
}

export type ConfigEntries = {
  dateformat: string,
  timesheet_folder: string,
  timesheet_file_prefix: string,
  timesheet_file_dateformat: string,
  timesheet_filename: string,
  backup_folder: string,
  template_folder: string,
  template_filename: string,
  locale: Locales,
}

export type Locales = 'en' | 'pt-BR';
export type MonthNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

type ValidationResult = {
  valid: boolean
  message: string
}
