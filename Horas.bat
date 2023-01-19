@ECHO OFF
@REM Author: daviinacio
@REM Date:   28/03/2022
@REM 
chcp 65001 >NUL

set scripts_path=Scripts

if "%1"=="calcular" (
  if "%2"=="" (
    %scripts_path%\CalculaHoras help
  ) else (
    cls
    %scripts_path%\CalculaHoras %2 %3 %4
  )

) else if "%1"=="criar" (
  if "%2"=="" (
    %scripts_path%\CreateHorario help
  ) else (
    cls
    %scripts_path%\CreateHorario %2 %3 %4
  )

) else if "%1"=="help" (
  call :help

) else if "%1"=="ajuda" (
  call :help

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
