# 📖 Plano de Leitura Bíblica

App web **somente front-end** para acompanhar um plano de leitura da Bíblia,
marcando os capítulos lidos. Todo o progresso fica salvo no `localStorage` do
navegador — não há backend nem login.

## Funcionalidades

- **Plano de Êxodo** (40 capítulos).
- **Capítulos por dia** configurável: os capítulos são agrupados em blocos
  (ex.: 3 por dia → "Êxodo 1–3", "Êxodo 4–6"...). Cada dia tem um checkbox; o
  estado fica indeterminado quando só parte dos capítulos do dia foi lida.
- **Marcar capítulos lidos** com checkbox; barra de progresso e contagem.
- **Config → Dias para pular**: escolha os dias da semana (ex.: domingo) que o
  cronograma deve ignorar. Os dias são reagendados automaticamente para as
  próximas datas válidas.
- **Data de início** e **capítulos por dia** ajustáveis por plano.
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
