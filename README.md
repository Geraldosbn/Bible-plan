# 📖 Plano de Leitura Bíblica

App web **somente front-end** para acompanhar um plano de leitura da Bíblia,
marcando as leituras feitas. Todo o progresso fica salvo no `localStorage` do
navegador — não há backend nem login.

## Funcionalidades

- **Plano de Gálatas**: cronograma de 14 leituras por passagens (seções
  temáticas padrão), cada uma com um tema (ex.: `Gálatas 5:1–15 — Liberdade em
  Cristo`).
- **Marcar leituras** com checkbox; barra de progresso e contagem.
- **Config → Dias para pular**: escolha os dias da semana (ex.: domingo) que o
  cronograma deve ignorar. As leituras são reagendadas automaticamente para as
  próximas datas válidas.
- **Data de início** ajustável por plano.
- **Flag "Ativo"**: apenas um plano fica ativo por vez.

Dois tipos de plano são suportados na arquitetura: por **passagens** (lista fixa
de leituras, como Tiago) e por **capítulos** (N capítulos por dia). Para planos
por capítulo há também o controle de "capítulos por dia".
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
