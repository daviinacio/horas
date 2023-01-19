@ECHO OFF
@REM Author: daviinacio
@REM Date:   05/01/2022
@REM Automatização para criar arquivo de controle de horas
chcp 65001 >NUL

@REM ______________________ FEATURE FLAGS ______________________

@REM ______________________ DEFINITIONS ______________________
set root_path=.
set template_path=%root_path%\Horario_Template.md
set file_prefix=Horario_

@REM Date Format = dd/MM/yyyy
set year=%date:~6,4%
set month=%date:~3,2%
set day=%date:~0,2%

setlocal enabledelayedexpansion
set month_folder_name[01]=01_janeiro
set month_folder_name[02]=02_fevereiro
set month_folder_name[03]=03_marco
set month_folder_name[04]=04_abril
set month_folder_name[05]=05_maio
set month_folder_name[06]=06_junho
set month_folder_name[07]=07_julho
set month_folder_name[08]=08_agosto
set month_folder_name[09]=09_setembro
set month_folder_name[10]=10_outubro
set month_folder_name[11]=11_novembro
set month_folder_name[12]=12_dezembro

@REM ______________________ USER INTERFACE ______________________
if "%1" == "hoje" (
  call :create_file
  
) else if "%1"=="dia" (
  call :day %2

) else if "%1" == "amanha" (
  call :increment_day %2 ^ 1

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
  call :increment_day 3

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
  call :change_date_with_date_string %~1

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

@REM ______________________ UTILS FUNCTIONS ______________________
:change_date_with_date_string
  set "date_string=%~1"

  echo %date_string% | findstr /N /R /C:"[0-9][0-9]/[0-9][0-9]/[0-9][0-9][0-9][0-9]" >NUL
  if errorlevel 1 EXIT /B 2

  set day=%date_string:~0,2%
  set month=%date_string:~3,2%
  set year=%date_string:~6,4%

  call :validate_date
  if errorlevel 1 EXIT /B 1
EXIT /B 0

:increment_day
  echo %~1 | findstr /N /R /C:"[0-9]" >NUL
  if errorlevel 1 EXIT /B 2

  if "%day:~0,1%" == "0" set /a "day=%day:~1,1%"
  set /a day+=%~1%

  call :calc_last_day_of_month month_last_day

  set /a days_over_month_last_day=%day%-%month_last_day%

  if %days_over_month_last_day% gtr 0 (
    set /a day=%days_over_month_last_day%
    call :increment_month 1
  )

  if %day% lss 10 set "day=0%day%"

  call :validate_date
  if errorlevel 1 EXIT /B 1
EXIT /B 0

:increment_month
  if "%month:~0,1%" == "0" set /a "month=%month:~1,1%"
  set /a month+=%~1%
  if %month% lss 10 set month=0%month%
  
  call :validate_date
  if errorlevel 1 EXIT /B 1
EXIT /B 0

:calc_last_day_of_month
  set /a is_leap_year = %year%%%4
  if %is_leap_year%==0 (
    set "is_leap_year=true"
  ) else (
    set "is_leap_year=false"
  )

  if %month%==01 set "%~1=31"
  if %month%==02 (
    if "%is_leap_year%"=="true" set "%~1=29"
    if "%is_leap_year%"=="false" set "%~1=28"
  )
  if %month%==03 set "%~1=31"
  if %month%==04 set "%~1=30"
  if %month%==05 set "%~1=31"
  if %month%==06 set "%~1=30"
  if %month%==07 set "%~1=31"
  if %month%==08 set "%~1=31"
  if %month%==09 set "%~1=30"
  if %month%==10 set "%~1=31"
  if %month%==11 set "%~1=30"
  if %month%==12 set "%~1=31"
EXIT /B 0

:validate_date
  call :calc_last_day_of_month month_last_day
  if %day% lss 01 EXIT /B 1
  if %day% gtr %month_last_day% EXIT /B 1
  if %month% lss 01 EXIT /B 1
  if %month% gtr 12 EXIT /B 1
  if %year% lss 1900 EXIT /B 1
  if %year% gtr 2100 EXIT /B 1
EXIT /B 0

@REM ______________________ CORE FUNCTIONS ______________________
:create_file
  set folder_name=%root_path%\%year%\!month_folder_name[%month%]!
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
  echo Controle de horas criado com sucesso
EXIT /B 0
