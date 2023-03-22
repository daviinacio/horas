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

@REM ______________________ USER INTERFACE ______________________
if "%1"=="hoje" (
  call :today %2
  EXIT /B 0
)
if "%1"=="ontem" (
  call :yesterday %2
  EXIT /B 0

)
if "%1"=="dia" (
  call :day %2 %3
  EXIT /B 0
)
if "%1"=="mes" (
  if "%2"=="passado" (
    call :month 1, %3
    EXIT /B 0
    
  ) else if "%2"=="retrasado" (
    call :month 2, %3
    EXIT /B 0

  ) else if "%2"=="atual" (
    call :month 0, %3
    EXIT /B 0

  ) else (
    call :month %2, %4
  )
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
  call %scripts_path%\utils search_start "%~1"
  call :calculate_current_day

  if errorlevel 1 (
    echo Não existe controle de horas para esse hoje
  )

  call %scripts_path%\utils search_end
EXIT /B 0


:yesterday
  call %scripts_path%\utils search_start "%~1"
  call %scripts_path%\utils subtract_day 1
  call :calculate_current_day

  @REM Use case: there's no hours for sunday, try saturday
  if errorlevel 1 (
    call %scripts_path%\utils subtract_day 1
    call :calculate_current_day
  )

  @REM Use case: there's no hours for saturday, try friday
  if errorlevel 1 (
    call %scripts_path%\utils subtract_day 1
    call :calculate_current_day
  )

  if errorlevel 1 (
    echo Não existe controle de horas para esse dia
  )

  call %scripts_path%\utils search_end
EXIT /B 0


:day
  call %scripts_path%\utils change_date_with_date_string %~1
  call %scripts_path%\utils search_start "%~2"

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

  call %scripts_path%\utils search_end
EXIT /B 0


:month
  call %scripts_path%\utils subtract_month %~1 ^ 0
  call %scripts_path%\utils search_start "%~2"

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

  call %scripts_path%\utils search_end
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
  echo mes ? "termo busca" . Total horas busca. ?: (atual, passado, retrasado, {n})
  echo.
  echo ajuda/help........... Ajuda
EXIT /B 0

@REM ______________________ CORE FUNCTIONS ______________________
:calculate_current_month
  @REM Month definitions
  set folder_path=%records_path%\%year%\!month_folder_name[%month%]!

  @REM Reset month properties
  set /a month_required_minutes = 0
  set /a month_registered_minutes = 0
  set /a month_balance_minutes = 0
  set /a month_working_days = 0

  @REM Iterate all files from a month folder
  for %%f in (%folder_path%\*) do (
    call %scripts_path%\utils change_date_with_filename %%f
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
  call %scripts_path%\utils format_hours_and_minutes month_registered_hours, month_registered_minutes, true
  call %scripts_path%\utils format_hours_and_minutes month_required_hours, month_required_minutes, true
  call %scripts_path%\utils format_hours_and_minutes month_balance_hours, month_balance_minutes, false, "+"

  @REM Show results
  call %scripts_path%\utils print_single_line "Total de horas registradas no mês !month_name[%month%]!/%year%: %month_registered_hours%h%month_registered_minutes% / %month_required_hours%h%month_required_minutes% (%month_balance_hours%h%month_balance_minutes%)"
EXIT /B 0


:calculate_current_day
  @REM File definitions
  set folder_path=%records_path%\%year%\!month_folder_name[%month%]!
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
  call %scripts_path%\utils format_hours_and_minutes display_partial_registered_hours, display_partial_registered_minutes

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
  call %scripts_path%\utils format_hours_and_minutes registered_hours, registered_minutes
  if "%file_props_text%" == "" set "file_props_text= "

  if %partial_registered_minutes% gtr 0 (
    set "%file_props_text%="
  )
  
  @REM Show results
  call %scripts_path%\utils print_single_line "Total de horas do dia %day%/%month%/%year%: %registered_hours%h%registered_minutes% - [%day_tasks_done_count%/%day_tasks_all_count%]%file_props_text%"
EXIT /B 0


:calculate_file_line
  set "line=%~1"

  if defined line_filter (
    call %scripts_path%\utils string_contains "%line%" "%line_filter%"

    @REM Nothing found in this line 
    if errorlevel 1 (
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
