import { config } from "./config.js"
import type { Locales, MonthNumber } from "./types.js"

export const app = {
  name: 'horas'
}

type MonthFolderType = {
  [key in Locales]: {
    [key in MonthNumber]: string
  }
}

export const month_folder_name: MonthFolderType = {
  'pt-BR': {
    1: "01_janeiro",
    2: "02_fevereiro",
    3: "03_marco",
    4: "04_abril",
    5: "05_maio",
    6: "06_junho",
    7: "07_julho",
    8: "08_agosto",
    9: "09_setembro",
    10: "10_outubro",
    11: "11_novembro",
    12: "12_dezembro",
  },
  'en': {
    1: "01_January",
    2: "02_February",
    3: "03_March",
    4: "04_April",
    5: "05_May",
    6: "06_June",
    7: "07_July",
    8: "08_August",
    9: "09_September",
    10: "10_October",
    11: "11_November",
    12: "12_December",
  }
}

export function getMonthFolderName(month: MonthNumber){
  const currentLocale = config.get('locale') as Locales;
  return month_folder_name[currentLocale][month];
}

export const month_name: MonthFolderType = {
  'pt-BR': {
    1: "Janeiro",
    2: "Fevereiro",
    3: "Marco",
    4: "Abril",
    5: "Maio",
    6: "Junho",
    7: "Julho",
    8: "Agosto",
    9: "Setembro",
    10: "Outubro",
    11: "Novembro",
    12: "Dezembro",
  },
  'en': {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December",
  }
}

export function getMonthName(month: MonthNumber){
  const currentLocale = config.get('locale') as Locales;
  return month_name[currentLocale][month];
}
