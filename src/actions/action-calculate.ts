import { utils } from "../utils.js";

export function today(search?: string){
  console.log('calculate today', search);
}

export function yesterday(search?: string){
  console.log('calculate yesterday', search);
}

export function day(dateText: string, search?: string){
  const day = utils.format.dateTimezone(
    new Date(`${dateText}`)
  );

  if(Number.isNaN(day.getTime())){
    throw new Error('Data informada é inválida.');
  }

  console.log('calculate day', search);
}

export function month(search?: string, monthShift = 0){
  const date = new Date();
  date.setDate(1);
  date.setMonth(date.getMonth() + (monthShift));

  console.log('calculate month', monthShift, {
    month: date.getMonth() + 1,
    year: date.getFullYear()
  }, search);
}
