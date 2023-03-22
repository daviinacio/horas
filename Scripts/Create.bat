@ECHO OFF
@REM Author: daviinacio
@REM Date:   05/01/2022
@REM Automatização para criar arquivo de controle de horas
chcp 65001 >NUL

@REM ______________________ FEATURE FLAGS ______________________


@REM ______________________ USER INTERFACE ______________________
if "%1" == "hoje" (
  call :create_file
  
) else if "%1"=="dia" (
  call :day %2

) else if "%1" == "amanha" (
  call %scripts_path%\utils increment_day %2 ^ 1

  if errorlevel 2 (
    echo Parâmetro inválido
    EXIT /B 0
  )

  if errorlevel 1 (
    echo Data resultante inválida
    EXIT /B 0
  )

  call :create_file

) else if "%1" == "segunda" (
  call %scripts_path%\utils increment_day 3

  if errorlevel 2 (
    echo Parâmetro inválido
    EXIT /B 0
  )

  if errorlevel 1 (
    echo Data resultante inválida
    EXIT /B 0
  )

  call :create_file

) else if "%1"=="help" (
  call :help

) else if "%1"=="ajuda" (
  call :help

) else (
  echo Parâmetro inválido
)
EXIT /B 0

@REM ______________________ INTERFACE FUNCTIONS ______________________
:day
  call %scripts_path%\utils change_date_with_date_string %~1

  if errorlevel 2 (
    echo Digite uma data no formato dd/MM/yyyy
    EXIT /B 0
  )

  if errorlevel 1 (
    echo Data informada é inválida
    EXIT /B 0
  )

  call :create_file
EXIT /B 0

:help
  echo hoje ................ Criar controle para hoje
  echo amanha .............. Criar controle para amanhã
  echo amanha n ............ Criar controle para dia atual +n
  echo dia dd/MM/yyyy ...... Criar controle para um dia específico
  echo.
  echo ajuda/help........... Ajuda
EXIT /B 0

@REM ______________________ CORE FUNCTIONS ______________________
:create_file
  set folder_name=%records_path%\%year%\!month_folder_name[%month%]!
  set file_name=%file_prefix%%year%.%month%.%day%.md
  
  @REM DEBUG
  @REM echo %folder_name%\%file_name% & EXIT /B 0
  @REM echo %day%/%month%/%year% & EXIT /B 0
  @REM EXIT /B 0

  if not exist %year% (
    mkdir %year% >NUL
  )

  if not exist %folder_name% (
    mkdir %folder_name% >NUL
  )

  if not exist %template_path% (
    echo Arquivo template nao encontrado
    EXIT /B 0
  )

  if exist %folder_name%\%file_name% (
    echo Controle de horas ja criado para %day%/%month%/%year%
    EXIT /B 0
  )

  copy %template_path% %folder_name%\%file_name% >NUL
  echo Controle de horas criado com sucesso para o dia %day%/%month%/%year%
EXIT /B 0
