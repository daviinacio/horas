# Horas
A simple CLI app to manage local daily tasks notation files. Check the [Change Log](https://github.com/daviinacio/horas/blob/node/CHANGELOG.md) to know what is new.

### Features
- Calculate spend time on tasks
- Create task file based on template
- Calculate partial registered
- Calculate spend time on a specific task `new`

## Getting Started
This is the basics about how to use it.

### Installation
- Install [NodeJS](https://nodejs.org/en/download/current);
- Use NPM to install `horas` globally:
  - Windows (cmd as administrator): `npm i -g horas`.
  - Linux or MacOS: `sudo npm i -g horas`.

### Basic Commands
> [Almost all commands are in Portuguese. It'll be translated soon](https://github.com/daviinacio/horas/issues/4).

- Create a task file for today:
```bash
horas criar hoje
```

- Calc tasks time from today
```bash
horas calcular hoje
```

- Calc tasks time from current month
```bash
horas calcular mes
```

- Calc specific task time in current month `new`
```bash
horas calcular mes atual "<task-description>"
```

- Any doubt? Use the help command
```bash
horas ajuda
```

## Contribution
For any contribution, send me a [pull request](https://github.com/daviinacio/horas/pulls).

## Environment
This project was made multi-platform.
