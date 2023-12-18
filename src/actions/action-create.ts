import { createTimesheetByDate } from "../lib/timesheet";

export function today(){
  const today = new Date();

  try {
    createTimesheetByDate(today);
  }
  catch(err){
    if(err instanceof Error){
      console.error(err.message);
    }
  }
}

export function day(){
  console.log('create day');
}

export function tomorrow(){
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  try {
    createTimesheetByDate(tomorrow);
  }
  catch(err){
    if(err instanceof Error){
      console.error(err.message);
    }
  }
}

export function monday(){
  console.log('create monday');
}

export function week(){
  console.log('create monday');
}

export function month(){
  console.log('create monday');
}
