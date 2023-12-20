import { utils } from "../utils";

export function today(){
  console.log('calculate today');
}

export function yesterday(){
  console.log('calculate yesterday ');
}

export function day(dateText: string){
  const day = utils.format.dateTimezone(
    new Date(`${dateText}`)
  );

  if(Number.isNaN(day.getTime())){
    throw new Error('Data informada é inválida.');
  }

  console.log('calculate day');
}

export function month(monthShift = 0){
  const date = new Date();
  date.setDate(1);
  date.setMonth(date.getMonth() - (monthShift));

  console.log('calculate month', monthShift, {
    month: date.getMonth() + 1,
    year: date.getFullYear()
  });
}
