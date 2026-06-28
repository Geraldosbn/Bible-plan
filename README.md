# 📖 Plano de Leitura Bíblica

App web **somente front-end** para acompanhar um plano de leitura da Bíblia,
marcando os capítulos lidos. Todo o progresso fica salvo no `localStorage` do
navegador — não há backend nem login.

## Funcionalidades

- **Plano de Êxodo**, 1 capítulo por dia (40 dias).
- **Marcar capítulos lidos** com checkbox; barra de progresso e contagem.
- **Config → Dias para pular**: escolha os dias da semana (ex.: domingo) que o
  cronograma deve ignorar. Os capítulos são reagendados automaticamente para os
  próximos dias válidos.
- **Data de início** ajustável por plano.
- **Flag "Ativo"**: apenas um plano fica ativo por vez (estrutura já preparada
  para múltiplos planos no futuro).
- **Zerar progresso** de um plano.
- Marcação de dia **"hoje"** e **"atrasado"** no cronograma.

## Stack

- React 18 + TypeScript
- Vite
- CSS puro (sem libs de UI)

## Como rodar

```bash
npm install
npm run dev      # ambiente de desenvolvimento
npm run build    # build de produção (type-check + bundle em dist/)
npm run preview  # serve o build de produção localmente
```

## Estrutura

```
src/
  types.ts            # modelos de dados (ReadingPlan, Settings, Progress)
  data/plans.ts       # plano padrão (Êxodo) e helpers de data
  schedule.ts         # cálculo do cronograma pulando dias da semana
  storage.ts          # leitura/escrita no localStorage
  useAppState.ts      # hook de estado com persistência automática
  components/
    PlanView.tsx      # aba "Plano" — lista de dias e checkboxes
    ConfigView.tsx    # aba "Config" — dias pulados, planos, data de início
  App.tsx             # navegação entre abas
```

## Dados no navegador

Tudo é persistido sob a chave `bible-plan:v1` no `localStorage`. Limpar os dados
do site no navegador zera o progresso.
