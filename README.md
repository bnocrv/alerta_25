# Alerta 25 — Monitoramento Comunitário de Ocorrências Urbanas

![Status](https://img.shields.io/badge/status-prot%C3%B3tipo%20acad%C3%AAmico-blue)
![ODS 11](https://img.shields.io/badge/ODS-11%20Cidades%20Sustent%C3%A1veis-green)
![Frontend](https://img.shields.io/badge/frontend-HTML%20%7C%20CSS%20%7C%20JS-orange)
![Backend](https://img.shields.io/badge/backend-n%C3%A3o%20utilizado-lightgrey)

**Alerta 25** é um protótipo web acadêmico, sem backend, criado para simular uma plataforma de registro, acompanhamento e análise de ocorrências urbanas relacionadas à segurança pública na região da Avenida 25 de Agosto, com foco na Rua José Herdy, em Duque de Caxias - RJ.

O projeto foi desenvolvido para a disciplina **Tópicos Especiais**, dentro do tema **Soluções Digitais para Inovação e Cidades Sustentáveis**, alinhado à **ODS 11 — Cidades e Comunidades Sustentáveis**.

---

## Visão Geral

O sistema simula uma solução digital de monitoramento comunitário, permitindo que ocorrências urbanas sejam registradas, consultadas, filtradas e analisadas por meio de indicadores visuais.

Mesmo sem backend ou banco de dados real, o protótipo apresenta um fluxo completo:

**Login → Dashboard → Registro de ocorrência → Métrica diária → Mapa → Análise → Lista → Relatório**

---

## Objetivo

Criar um protótipo navegável e funcional para demonstrar como uma plataforma digital pode apoiar o acompanhamento comunitário de ocorrências urbanas, oferecendo:

- organização dos registros;
- visualização de métricas;
- consulta por filtros;
- análise visual da região;
- apoio à tomada de decisão local;
- demonstração alinhada à ODS 11.

---

## ODS Escolhida

### ODS 11 — Cidades e Comunidades Sustentáveis

O projeto se conecta à ODS 11 ao propor uma solução digital voltada para:

- melhoria da percepção de segurança urbana;
- uso de dados para leitura de problemas locais;
- apoio à gestão comunitária de espaços públicos;
- inovação em cidades sustentáveis;
- incentivo à participação social.

---

## Região Monitorada

O protótipo considera a região da:

**Rua José Herdy / Rua Professor José de Souza Herdy**  
**Bairro 25 de Agosto — Duque de Caxias - RJ**

Locais simulados utilizados:

- Rua José Herdy;
- Avenida 25 de Agosto;
- próximo à academia;
- próximo ao comércio local;
- próximo à instituição de ensino.

---

## Tecnologias Utilizadas

- **HTML5**
- **CSS3**
- **JavaScript puro**
- **localStorage**
- **OpenStreetMap**
- **Leaflet**

O projeto não utiliza:

- backend;
- banco de dados real;
- frameworks JavaScript;
- autenticação real;
- APIs privadas com chave.

---

## Login de Teste

| Campo | Valor |
|---|---|
| Usuário | `admin` |
| Senha | `123456` |

> O login é apenas simulado e hardcoded para fins acadêmicos.

---

## Funcionalidades

### Autenticação Simulada

- Tela de login.
- Validação hardcoded.
- Mensagem de erro para credenciais inválidas.
- Acesso ao dashboard após login correto.

### Dashboard Principal

- Nome e descrição do sistema.
- Cards com resumo das ocorrências.
- Indicador de risco da região.
- Atividade recente.
- Navegação rápida por abas.
- Modo apresentação para prints e PPT.

### Cards de Resumo

- Total de ocorrências.
- Ocorrências registradas hoje.
- Tipo de ocorrência mais comum.
- Última ocorrência registrada.

### Cadastro de Ocorrência

Campos disponíveis:

- título;
- tipo;
- prioridade;
- descrição;
- localização;
- data;
- hora.

O status inicial é definido automaticamente como **Registrada**.

### Consulta e Filtros

O sistema permite filtrar ocorrências por:

- busca textual;
- período;
- tipo;
- status.

Também há:

- contador de resultados;
- botão para limpar filtros;
- estado vazio personalizado.

### Gestão da Lista

- Visualização das ocorrências cadastradas.
- Alteração de status diretamente na lista.
- Modal de detalhes.
- Tags visuais para tipo, prioridade, status e localização.

### Mapa Interativo

O projeto utiliza **OpenStreetMap + Leaflet** para exibir um mapa real da região monitorada.

Recursos do mapa:

- marcadores simulados;
- pontos de referência;
- círculos de intensidade simulando calor;
- legenda visual;
- fallback caso o mapa não carregue.

### Análise Inteligente

O sistema gera automaticamente uma leitura dos dados simulados:

- maior concentração;
- tipo predominante;
- horário crítico;
- nível de atenção.

### Relatório do Projeto

Seção visual pronta para apresentação, contendo:

- resumo da solução;
- ODS escolhida;
- métrica principal;
- resumo analítico.

### Exportação e Reset

- Exportação dos dados em JSON.
- Confirmação antes da exportação.
- Reset dos dados simulados iniciais.
- Confirmação antes do reset.

---

## Métrica Principal

### Quantidade de ocorrências registradas por dia

**Cálculo:** total de registros de ocorrências realizados dentro de um período de 24 horas.

No dashboard, a métrica aparece como:

> Ocorrências registradas hoje: X

### Como a métrica é calculada

A aplicação conta todas as ocorrências cuja data é igual à data atual.

### Onde aparece

- Card principal do dashboard.
- Hero do dashboard.
- Seção **Métrica do Projeto**.
- Relatório do projeto.

### Fonte dos dados

- dados simulados iniciais;
- registros cadastrados no protótipo;
- armazenamento temporário via `localStorage`.

---

## Dados Simulados

O sistema inicia com ocorrências hardcoded contendo:

- `id`
- `title`
- `type`
- `priority`
- `description`
- `location`
- `date`
- `time`
- `status`
- coordenadas simuladas para o mapa

Tipos disponíveis:

- Assalto
- Furto
- Atividade suspeita
- Iluminação precária
- Outro

Status disponíveis:

- Registrada
- Em análise
- Resolvida

Prioridades disponíveis:

- Baixa
- Média
- Alta

---

## Como Executar Localmente

1. Baixe ou clone este projeto.
2. Abra o arquivo `index.html` em um navegador moderno.
3. Faça login com:
   - usuário: `admin`
   - senha: `123456`

O projeto funciona diretamente no navegador.

> Para carregar o mapa real, é necessário estar conectado à internet, pois o Leaflet e os tiles do OpenStreetMap são carregados por CDN.

---

## Demonstração do Fluxo

1. Abra o `index.html`.
2. Faça login com `admin` e `123456`.
3. Veja os cards do dashboard.
4. Confira o indicador de risco.
5. Registre uma nova ocorrência.
6. Observe a métrica diária ser atualizada.
7. Consulte o gráfico de ocorrências por tipo.
8. Veja o mapa interativo com marcadores e calor simulado.
9. Analise a leitura inteligente da região.
10. Use filtros por período, tipo e status.
11. Altere o status de uma ocorrência.
12. Abra os detalhes de uma ocorrência.
13. Exporte os dados em JSON.
14. Acesse o relatório visual.
15. Ative o modo apresentação para gerar prints.

---

## Estrutura de Arquivos

```text
alerta_25/
├── index.html
├── styles.css
├── script.js
└── README.md
```

---

## Observações Importantes

- Este projeto é um protótipo acadêmico.
- Os dados são simulados.
- O login não representa autenticação real.
- O armazenamento é temporário e local ao navegador.
- O mapa usa dados do OpenStreetMap via internet.
- Não há coleta real de dados sensíveis.

---

## Autoria

**© 2026 Bruno Carvalho**  
Projeto acadêmico — **Alerta 25**  
Disciplina: **Tópicos Especiais**  
Tema: **Soluções Digitais para Inovação e Cidades Sustentáveis**

