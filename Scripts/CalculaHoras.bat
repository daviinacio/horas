@ECHO OFF
@REM Author: daviinacio
@REM Date:   22/03/2022
@REM Automatização para calculo de horas
chcp 65001 >NUL

@REM ______________________ FEATURE FLAGS ______________________
@REM Holydays are not consedered as workingdays
set "feature_flag_holyday=true"
@REM Just consider registered days on total time
set "feature_flag_registed_day_time=true"
@REM Consider partial registered minutes on daily total
set "feature_flag_partial_registered_time=true"


@REM ______________________ DEFINITIONS ______________________
set root_path=.
set template_path=%root_path%\Horario_Template.md
set file_prefix=Horario_

set /a work_minutes_per_day= 8 * 60

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
if "%1"=="hoje" (
  call :today

) else if "%1"=="ontem" (
  call :yesterday

) else if "%1"=="dia" (
  call :day %2

) else if "%1"=="mes" (
  if "%2"=="passado" (
    call :month 1, %3
    EXIT /B 0
    
  ) else if "%2"=="retrasado" (
    call :month 2, %3
    EXIT /B 0

  ) else if "%2"=="atual" (
    call :month 0, %3
    EXIT /B 0

  )

  call :month %2, %4

) else if "%1"=="ajuda" (
  call :help

) else if "%1"=="help" (
  call :help

) else if "%1"=="" (
  call :today
  pause
  
) else (
  echo Parâmetro inválido
)
EXIT /B 0


@REM ______________________ INTERFACE FUNCTIONS ______________________
:today
  call :calculate_current_day

  if errorlevel 1 (
    echo Não existe controle de horas para esse hoje
  )
EXIT /B 0


:yesterday
  call :subtract_day 1
  call :calculate_current_day

  @REM Use case: there's no hours for sunday, try saturday
  if errorlevel 1 (
    call :subtract_day 1
    call :calculate_current_day
  )

  @REM Use case: there's no hours for saturday, try friday
  if errorlevel 1 (
    call :subtract_day 1
    call :calculate_current_day
  )

  if errorlevel 1 (
    echo Não existe controle de horas para esse dia
  )
EXIT /B 0


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

  call :calculate_current_day

  if errorlevel 1 (
    echo Não existe controle de horas para o dia %day%/%month%/%year%
  )
EXIT /B 0


:month
  set "line_filter=%~2"
  set /a filter_search_minutes = 0
  if defined line_filter (
    echo Searching for: "%line_filter%"
    echo.
  )
  
  call :subtract_month %~1 ^ 0

  if errorlevel 1 (
    echo Data resultante inválida
    EXIT /B 0
  )

  echo Mês: !month_name[%month%]!/%year%
  call :calculate_current_month

  if errorlevel 1 (
    echo As horas desse mês ainda não foram lançadas no DevOps
    EXIT /B 0
  )

  if defined line_filter (
    if %filter_search_minutes% == 0 (
      echo Nenhum registro encontrado durante a busca
      EXIT /B 0
    )
  )

  if defined line_filter (
    call :format_hours_and_minutes filter_search_hours, filter_search_minutes, true
  )

  if defined line_filter (
    call :print_single_line "Total de hora acumulada na busca: %filter_search_hours%h%filter_search_minutes%"
  )
  
EXIT /B 0

:help
  echo hoje ................ Horas de hoje
  echo ontem ............... Horas de ontem (ou sexta passada)
  echo dia {dd/MM/yyyy} .... Horas de um dia específico
  echo mes ................. Horas do mês atual
  echo mes atual ........... Horas do mês atual
  echo mes passado ......... Horas do mês passado (mês atual -1)
  echo mes retrasado ....... Horas do mês retrasado (mês atual -2)
  echo mes {n} ............. Horas de um mês anterior (mês atual -n)
  echo mes ? "termo busca" . Total horas busca. ?: (atual | passado | retrasado | {n})
  echo.
  echo ajuda/help........... Ajuda
EXIT /B 0


@REM ______________________ UTILS FUNCTIONS ______________________
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


@REM ______________________ CORE FUNCTIONS ______________________
:calculate_current_month
  @REM Month definitions
  set folder_path=%root_path%\%year%\!month_folder_name[%month%]!

  @REM Reset month properties
  set /a month_required_minutes = 0
  set /a month_registered_minutes = 0
  set /a month_balance_minutes = 0
  set /a month_working_days = 0

  @REM Iterate all files from a month folder
  for %%f in (%folder_path%\*) do (
    call :change_date_with_filename %%f
    if not errorlevel 1 (
      call :calculate_current_day %~1
    )
  )

  @REM Check if the current month have values
  if defined line_filter EXIT /B 0
  if %month_registered_minutes%==0 EXIT /B 1

  @REM Calculate the results
  set /a month_required_minutes = %month_working_days% * %work_minutes_per_day%
  set /a month_balance_minutes = %month_registered_minutes% - %month_required_minutes%

  @REM Format results
  call :format_hours_and_minutes month_registered_hours, month_registered_minutes, true
  call :format_hours_and_minutes month_required_hours, month_required_minutes, true
  call :format_hours_and_minutes month_balance_hours, month_balance_minutes, false, "+"

  @REM Show results
  call :print_single_line "Total de horas registradas no mês !month_name[%month%]!/%year%: %month_registered_hours%h%month_registered_minutes% / %month_required_hours%h%month_required_minutes% (%month_balance_hours%h%month_balance_minutes%)"
EXIT /B 0


:calculate_current_day
  @REM File definitions
  set folder_path=%root_path%\%year%\!month_folder_name[%month%]!
  set file_path=%file_prefix%%year%.%month%.%day%.md

  @REM Reset file properties
  set "file_props_text="
  set "file_props_day_registered=false"
  set "file_props_holiday=false"
  set /a partial_registered_minutes = 0
  set /a registered_minutes = 0
  set /a registered_extra_minutes = 0
  set /a day_tasks_all_count = 0
  set /a day_tasks_done_count = 0

  @REM Check if the current file exists
  if not exist %folder_path%\%file_path% EXIT /B 1

  @REM Iterate all lines from the file
  for /f "delims=" %%x in (%folder_path%\%file_path%) do (
    call :calculate_file_line "%%x" > NUL
  )

  set /a display_partial_registered_minutes = %partial_registered_minutes%
  call :format_hours_and_minutes display_partial_registered_hours, display_partial_registered_minutes

  @REM FEATURE FLAG: Just consider registered days on total
  if "%feature_flag_registed_day_time%"=="true" (
    @REM Consider the worked time on day in total count if day flagged as registed
    if "%file_props_day_registered%"=="true" (
      set /a month_registered_minutes += registered_minutes

    ) else (
      @REM FEATURE FLAG: Consider pending (@) of not registered days on total
      if "%feature_flag_partial_registered_time%"=="true" (
        set /a month_registered_minutes += partial_registered_minutes

        if %partial_registered_minutes% gtr 0 (
          set "file_props_text=%file_props_text% - [@:%display_partial_registered_hours%h%display_partial_registered_minutes%]"
        )
      )
    )
  ) else (
    @REM Always register all registered time on total
    set /a month_registered_minutes += registered_minutes
  )

  @REM FEATURE FLAG: Holydays are not consedered as workingdays
  if "%feature_flag_holyday%"=="true" (
    @REM Consider that day as a working day, not a holyday
    if "%file_props_holiday%"=="false" (
      set /a month_working_days += 1
    )
  ) else (
    @REM All days are working days
    set /a month_working_days += 1
  )

  @REM Filtered results
  if defined line_filter (
    if %registered_minutes% == 0 EXIT /B 0
    set /a filter_search_minutes += %registered_minutes%
  )
  
  @REM Format results
  call :format_hours_and_minutes registered_hours, registered_minutes
  if "%file_props_text%" == "" set "file_props_text= "

  if %partial_registered_minutes% gtr 0 (
    set "%file_props_text%="
  )
  
  @REM Show results
  call :print_single_line "Total de horas do dia %day%/%month%/%year%: %registered_hours%h%registered_minutes% - [%day_tasks_done_count%/%day_tasks_all_count%]%file_props_text%"
EXIT /B 0


:calculate_file_line
  set "line=%~1"

  if defined line_filter (
    if "%line:~5%" == " - %line_filter%" (
      echo found 30 > NUL
    ) else if "%line:~5%" == " - @%line_filter%" (
      echo found 30 > NUL
    ) else if "%line:~7%" == " - %line_filter%" (
      echo found 15 > NUL
    ) else if "%line:~7%" == " - @%line_filter%" (
      echo found 15 > NUL
    ) else (
      EXIT /B 0
    )
  )

  @REM File properties
  if "%line:~0,6%" == "- [x] " (
    if "%line:~6%" == "" EXIT /B 0
    set "file_props_text=%file_props_text% - %line:~6%"
    
    if "%line:~6,7%" == "Anotado" set "file_props_day_registered=true"
    if "%line:~6%" == "Feriado" set "file_props_holiday=true"
    if "%line:~6%" == "Facultativo" set "file_props_holiday=true"
    if "%line:~6%" == "Fim de semana" set "file_props_holiday=true"
    if "%line:~6%" == "Folga" set "file_props_holiday=true"

    EXIT /B 0
  )

  @REM Tasks
  if "%line:~1,3%" == ". [" (
    if "%line:~7%" == "" EXIT /B 0

    @REM if "%line:~4,3%" == " ] " (
    @REM   set /a day_tasks_all_count += 1
    @REM   echo  - Tarefa pendente: "%line:~7%"
    @REM )
    
    if "%line:~4,3%" == "x] " (
      set /a day_tasks_all_count += 1
      set /a day_tasks_done_count += 1
      echo  - Tarefa concluida: "%line:~7%"

    ) else if "%line:~4,3%" == "D] " (
      echo  - Tarefa delegada: "%line:~7%"

    ) else if "%line:~4,3%" == " ] " (
      set /a day_tasks_all_count += 1
      echo  - Tarefa pendente: "%line:~7%"
    ) 

    EXIT /B 0
  )

  @REM 30 minutes
  if "%line:~2,1%" == ":" (
    if "%line:~8,3%" == "OFF" EXIT /B 0
    if "%line:~8,1%" == "" EXIT /B 0

    if "%line:~8,3%" == "EXT" (
      set registered_extra_minutes += 30
      EXIT /B 0
    )

    set /a registered_minutes += 30

    if "%line:~8,1%" == "@" (
      set /a partial_registered_minutes += 30
      EXIT /B 0
    )
  )

  @REM 15 minutes
  if "%line:~4,1%" == ":" (
    if "%line:~10,3%" == "OFF" EXIT /B 0
    if "%line:~10,1%" == "" EXIT /B 0

    if "%line:~10,3%" == "EXT" (
      set registered_extra_minutes += 15
      EXIT /B 0
    )

    set /a registered_minutes += 15

    if "%line:~10,1%" == "@" (
      set /a partial_registered_minutes += 15
      EXIT /B 0
    )
  )
EXIT /B 0

:print_single_line
  @REM echo %day%/%month%/%year%
  set "print_text=%~1"
  set "print_text=!print_text:~0, %console_width%!"
  echo %print_text%
EXIT /B 0
