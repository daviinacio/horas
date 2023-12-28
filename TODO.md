# Funcionalidades Mapeadas da versão anterior

**criar**
Automatiza a criação de time sheet a partir de um template.

- [x] Criar hoje
- [x] Criar em um dia específico
- [x] Criar amanhã
- [x] Criar segunda
- [x] Help

**calcular**
Calcula time sheets

- [x] Calcular hoje
- [x] Calcular ontem
- [x] Calcular um dia específico
- [x] Calcular mes atual
- [x] Calcular mes passado
- [x] Calcular mes retrasado
- [ ] Calcular com busca


# Funcionalidades extras
- [x] Atualizar (git)
- [x] Criar semana
  - [x] Atual
  - [x] Passada
  - [x] Retrasada
- [x] Criar mês
  - [x] Atual
  - [x] Passado
  - [x] Retrasado
- [x] Calcular semana
  - [x] Atual
  - [x] Passada
  - [x] Retrasada

## Ideias
Funcionar similar ao git.
Rodar de acordo com a pasta atual.
Guardar preferencias em pasta .horas

Commando `horas init`
  - Criar pasta .horas, config.json, e pasta Template

  **Vantagens**
  - Remove a necessidade de configurações globais;
  - Pode funcionar em mais de um contexto.

  **Desvantagens**
  - Necessidade de navegar até pasta para utilização.
    - (Contorno): Configurar um contexto padrão.

medir performance do calculo

horas config dateformat
horas criar template
horas usar template "nome template"
horas criar hoje --template "nome template"
horas calcular semana passada
horas buscar "texto da busca"
horas criar semana
horas calcular mes passado --busca "texto da busca"
horas criar hoje --continuar
  Cria novo mantendo tarefas pendentes do dia anterior


multi-lang
  function 'txt(<key>)' que busca de um object baseado na key e no locale configurado

  traduzir mensagens e comandos
