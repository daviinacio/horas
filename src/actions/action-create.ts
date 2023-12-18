import type { Command } from "commander";
import { createTimesheetByDate } from "../lib/timesheet";
import { utils } from "../utils";

export function setup(program: Command){
  const create = program.command('criar')
    .description('Comando para criação de arquivo de horas');

  create.command('hoje')
    .description('Criar controle para hoje')
    .action(() => {
      const today = new Date();
      createTimesheetByDate(today);
    });

  create.command('amanha')
    .description('Criar controle para amanhã')
    .action(() => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      createTimesheetByDate(tomorrow);
    });

  create.command('segunda')
    .description('Criar controle para proxima segunda-feira')
    .action(() => {
      const today = new Date();
      const nextMonday = new Date(
        today.setDate(
          today.getDate() + ((7 - today.getDay() + 1) % 7 || 7),
        ),
      )
      createTimesheetByDate(nextMonday);
    });

  // create.command('dia')
  //   .description('Criar controle para um dia específico')
  //   .action(() => {
  //     const tomorrow = new Date();
  //     tomorrow.setDate(tomorrow.getDate() + 1);
  //     createTimesheetByDate(tomorrow);
  //   });
}

// export function today(){
//   const today = new Date();

//   try {
//     createTimesheetByDate(today);
//   }
//   catch(err){
//     if(err instanceof Error){
//       console.error(err.message);
//     }
//   }
// }

// export function day(){
//   console.log('create day');
// }

// export function tomorrow(){
//   const tomorrow = new Date();
//   tomorrow.setDate(tomorrow.getDate() + 1);

//   try {
//     createTimesheetByDate(tomorrow);
//   }
//   catch(err){
//     if(err instanceof Error){
//       console.error(err.message);
//     }
//   }
// }

// export function monday(){
//   console.log('create monday');
// }

// export function week(){
//   console.log('create monday');
// }

// export function month(){
//   console.log('create monday');
// }
