@ECHO OFF
@REM Author: daviinacio
@REM Date:   15/03/2023
@REM Módulo com funções utilitárias
shift & goto :%~1

@REM ______________________ UTILS FUNCTIONS ______________________
:search_start
  set "line_filter=%~1"
  set /a filter_search_minutes = 0
  if defined line_filter (
    echo Searching for: "%line_filter%"
    echo.
  )
EXIT /B 0

:search_end
  if defined line_filter (
    if %filter_search_minutes% == 0 (
      echo Nenhum registro encontrado durante a busca
      EXIT /B 0
    )
  )

  if defined line_filter (
    call %scripts_path%\utils format_hours_and_minutes filter_search_hours, filter_search_minutes, true
  )

  if defined line_filter (
    call :print_single_line "Total de hora acumulada na busca: %filter_search_hours%h%filter_search_minutes%"
  )
EXIT /B 0

:change_date_with_filename
  set "file_name=%~1"
  
  if x%file_name:Horario_=%==x%file_name% EXIT /B 1

  set year=%file_name:~-13,-9%
  set month=%file_name:~-8,-6%
  set day=%file_name:~-5,-3%

  call :validate_date
  if errorlevel 1 EXIT /B 1
EXIT /B 0

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

:subtract_day
  if "%day:~0,1%" == "0" set /a "day=%day:~1,1%"
  
  set /a day-=%~1%

  if %day% lss 1 (
    call :subtract_month 1
  )

  if %day% lss 1 (
    call :calc_last_day_of_month month_last_day
    set "day=%month_last_day%"
  )

  if %day% lss 10 set day=0%day%

  call :validate_date
  if errorlevel 1 EXIT /B 1
EXIT /B 0

:subtract_month
  if "%month:~0,1%" == "0" set /a "month=%month:~1,1%"

  set /a month-=%~1%
  set /a backing_years = ( ( %month% * - 1 ) / 12 ) + 1

  if %month% lss 1 set /a year -= %backing_years%
  if %month% lss 1 set /a month = ( 12 * %backing_years% ) + %month%
  if %month% lss 10 set month=0%month%
  
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

  call %scripts_path%\utils validate_date
  if errorlevel 1 EXIT /B 1
EXIT /B 0

:increment_month
  if "%month:~0,1%" == "0" set /a "month=%month:~1,1%"
  set /a month+=%~1%
  if %month% lss 10 set month=0%month%
  
  call %scripts_path%\utils validate_date
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

:format_hours_and_minutes
  set /a "hours=%~1"
  set /a "minutes=%~2"
  set /a %~1 = %~2 / 60
  set /a %~2 = %~2 - (%~1 * 60)
  if %minutes% lss 0 set /a %~2 = %~2 * -1

  @REM Pretty text decoration
  set /a "hours=%~1"
  set /a "minutes=%~2"
  set "occult_minutes_when_zero=%~3"
  set "positive_sign=%~4"

  if "%positive_sign%" == "" (
    if %hours% lss 10 set "%~1= %hours%"
  ) else (
    if %hours% gtr 0 set "%~1=%positive_sign%%hours%"
    @REM if %minutes% gtr 0 set "%~1=%positive_sign%%hours%"
  )
  
  if "%occult_minutes_when_zero%" == "true" (
    if %minutes% == 0 set "%~2="
  ) else (
    if %minutes% lss 10 set "%~2=0%minutes%"
  )
EXIT /B 0

:string_contains
  @REM https://stackoverflow.com/questions/7005951/batch-file-find-if-substring-is-in-string-not-in-a-file
  set "line=%~1"
  set "sentence=%~2"

  CALL SET "string_removed=%%line:%sentence%=%%"

  IF "x%string_removed%"=="x%line%" (
    EXIT /B 1
  )
EXIT /B 0

:print_single_line
  @REM echo %day%/%month%/%year%
  set "print_text=%~1"
  set "print_text=!print_text:~0, %console_width%!"
  echo %print_text%
EXIT /B 0
