@ECHO OFF
@REM Author: daviinacio
@REM Date:   28/03/2022
chcp 65001 >NUL

@REM ______________________ DEFINITIONS ______________________
set root_path=.
set records_path=%root_path%
set scripts_path=%root_path%\Scripts
set file_prefix=Horario_
set template_path=%root_path%\Templates\CustomTemplate.md

if not exist %template_path% (
  set template_path=%root_path%\Templates\DefaultTemplate.md
)

set /a work_minutes_per_day= 8 * 60

@REM Date Format = dd/MM/yyyy
set year=%date:~6,4%
set month=%date:~3,2%
set day=%date:~0,2%

@REM Date Format = MM/dd/yyyy
@REM set year=%date:~6,4%
@REM set month=%date:~0,2%
@REM set day=%date:~3,2%

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

set month_name[01]=Janeiro
set month_name[02]=Fevereiro
set month_name[03]=Março
set month_name[04]=Abril
set month_name[05]=Maio
set month_name[06]=Junho
set month_name[07]=Julho
set month_name[08]=Agosto
set month_name[09]=Setembro
set month_name[10]=Outubro
set month_name[11]=Novembro
set month_name[12]=Dezembro

@REM ______________________ CONSOLE DEFINITIONS ______________________
for /f tokens^=2 %%w in ('mode con^|find "Col"')do set console_width=%%~w

@REM ______________________ USER INTERFACE ______________________
if "%1"=="calcular" (
  if "%2"=="" (
    %scripts_path%\Calculate.bat help
  ) else (
    cls
    %scripts_path%\Calculate.bat %2 %3 %4
  )

) else if "%1"=="criar" (
  if "%2"=="" (
    %scripts_path%\Create.bat help
  ) else (
    cls
    %scripts_path%\Create.bat %2 %3 %4
  )

) else if "%1"=="help" (
  call :help

) else if "%1"=="ajuda" (
  if "%2"=="criar" (
    %scripts_path%\Create.bat ajuda

  ) else if "%2"=="calcular" (
    %scripts_path%\Calculate.bat ajuda

  ) else (
    call :help
  )

) else if "%1"=="" (
  call :help

) else (
  echo Parâmetro inválido
)
EXIT /B 0

:help
  echo calcular ............ Comando de calculo de horas
  echo criar ............... Comando para criação de arquivo de horas 
  echo.
  echo ajuda/help........... Ajuda geral
  echo calcular help ....... Ajuda nos comandos de calculo
  echo criar help .......... Ajuda nos comandos de criação
EXIT /B 0
