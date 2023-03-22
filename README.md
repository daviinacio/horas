# Task Time Manager
A simple CLI app to manage local daily tasks notation files. Check the [Change Log](https://github.com/daviinacio/task-time-manager/blob/main/CHANGELOG.md) to know what is new.

### Features
- Calculate spend time on tasks
- Create task file based on template
- Calculate partial registered
- Calculate spend time on a specific task `new`

## Getting Started
This is the basics about how to use it.

### Installation
- Download the [latest release](https://github.com/daviinacio/task-time-manager/archive/main.zip);
- Extract the files;
- Open the CMD on "task-time-manager-main" folder;
- Use `horas ajuda` to learn how to use.
  - Create help `horas ajuda criar`
  - Calculate help`horas ajuda calcular`

### Basic Commands
> Almost all commands are in Portuguese. It'll be translated soon.

- Create a task file for today:
```CMD
horas criar hoje
```

- Calc tasks time from today
```
horas calcular hoje
```

- Calc tasks time from current month
```
horas calcular mes
```

- Calc specific task time in current month `new`
```
horas calcular mes atual "<task-description>"
```

## Contribution
For any contribution, send me a [pull request](https://github.com/daviinacio/task-time-manager/pulls).

## Environment
This project was made to run on windows CMD (on vscode terminal).
