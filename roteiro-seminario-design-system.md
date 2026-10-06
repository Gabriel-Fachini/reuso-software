**Seminário: Design System como Estratégia de Reuso**   
**Disciplina:** Reuso de Software **Duração:** 60 minutos **Status:** Roteiro aprovado (versão para o grupo) 

**Objetivo do seminário** 

Mostrar que um Design System não é apenas uma questão visual, e sim uma **estratégia organizacional de reuso de software**. A apresentação conecta os conceitos da disciplina (níveis de reuso, caixa-preta e caixa-branca, bibliotecas de componentes, linhas de produto) a um caso real vivido no iFood e termina com uma reflexão sobre o papel do Design System no desenvolvimento com IA generativa. 

**Fio condutor** 

A apresentação gira em torno de uma pergunta feita logo na abertura: **"como ir rápido sem virar bagunça?"** 

O problema é apresentado de forma genérica no início. O case do iFood só é revelado no bloco 5, como resposta real a uma dor que a turma já conhece. **Não mencionar o iFood antes do bloco 5\.** 

**Visão geral dos blocos** 

| \#  | Bloco  | Tempo |
| :---- | :---- | :---- |
| 1  | Abertura: o dilema de toda empresa que cresce  | 4 min |
| 2  | O que é um Design System  | 6 min |
| 3  | Design System à luz do Reuso de Software  | 10 min |
| 4  | Anatomia de um Design System  | 8 min |
| 5  | Case iFood  | 12 min |
| 6  | Design System na era da GenAI  | 8 min |
| 7  | Demonstração prática  | 5 min |
| 8  | Desafios e limitações  | 3 min |
| 9  | Conclusão e perguntas  | 4 min |
|  | **Total**  | **60 min** |

[https\://create.kahoot.it/discover?language=en](https://create.kahoot.it/discover?language=en)

**1\. Abertura: o dilema de toda empresa que cresce (4 min)** 

**Objetivo:** apresentar o problema sem revelar a empresa. 

**Conteúdo:** \- Cenário genérico: uma empresa de tecnologia cresce, os times se multiplicam e cada squad tem autonomia para experimentar e entregar rápido. \- Consequência: o produto passa a ter vários tons do "mesmo" vermelho, botões de tamanhos diferentes e fluxos que se comportam de jeitos distintos. \- Pergunta à turma: **"como ir rápido sem virar bagunça?"** 

**Material de apoio:** slide com vários botões e campos de formulário lado a lado, todos supostamente da mesma empresa. Criar os exemplos do zero, sem usar telas reais de nenhuma empresa. 

**2\. O que é um Design System (6 min)** 

**Objetivo:** alinhar o vocabulário. 

**Conteúdo:** \- **Definição:** conjunto de padrões, componentes, tokens, documentação e governança que funciona como fonte  
única da verdade para design e desenvolvimento. \- **Diferenças importantes:** \- Style guide: regras visuais (cores, tipografia, tom de voz). \- Biblioteca de componentes: código reutilizável. \- Design System: engloba os dois e acrescenta governança, documentação e processo. \- **Referências:** Material Design (Google) e Atomic Design (Brad Frost). 

**3\. Design System à luz do Reuso de Software (10 min)** 

**Objetivo:** conectar o tema aos conceitos da disciplina. É o bloco que diferencia o seminário. 

**Conteúdo:** 

\- **O que é reusado:** artefatos em vários níveis de abstração (tokens, componentes, padrões de interação, documentação, código). 

\- **Tipos de reuso:** \- Caixa-preta: usar o componente pronto, sem alterar. \- Caixa-branca: estender ou customizar o componente. 

\- **Granularidade:** Atomic Design como modelo de composição (átomos → moléculas → organismos → templates → páginas). 

\- **Relação com outros conceitos da disciplina:** bibliotecas de componentes e linhas de produto de software (variabilidade por meio de temas e tokens). 

\- **Custo x benefício:** investimento inicial alto, com retorno que cresce conforme a escala. 

**4\. Anatomia de um Design System (8 min)** 

**Objetivo:** mostrar as partes que compõem um Design System na prática. 

**Conteúdo:** 

\- **Design tokens:** cores, tipografia e espaçamentos como variáveis agnósticas de plataforma. Um mesmo token pode gerar CSS, código Android e código iOS. 

\- **Componentes:** API bem definida (props), estados e acessibilidade. 

\- **Documentação:** uso, exemplos e boas/más práticas (ex.: Storybook). 

\- **Distribuição e versionamento:** pacotes npm e versionamento semântico. 

\- **Governança:** quem contribui, quem aprova e como um componente é depreciado. 

**5\. Case iFood (12 min) ⭐** 

**Objetivo:** mostrar uma resposta real ao problema da abertura. 

**Transição:** retomar a pergunta inicial: "lembram daquela empresa? Esse cenário aconteceu no iFood." 

**Conteúdo:** \- **O problema:** cultura fail-fast, com muitos times entregando em paralelo, e dificuldade de manter a consistência de design. \- **A solução organizacional:** força-tarefa unindo tech e design. Ponto a destacar: Design System é tanto um problema de pessoas e processos quanto de código. \- **A solução técnica:** Design System formalizado no Figma, com tokens e componentes diretamente vinculados a uma biblioteca React usada por todos os sistemas web. \- **Microfrontends:** a arquitetura em microfrontends deixava a camada de UI bem encapsulada. Os times continuaram autônomos para experimentar, mas sobre uma base comum. \- **Expansão:** a mesma abordagem foi adotada depois em Android e iOS, com os tokens funcionando como fonte da verdade multiplataforma. \- **Aprendizados:** o que funcionou e o que foi difícil (adoção, versionamento entre microfrontends, contribuição dos times). 

**Atenção:** se possível, incluir dados aproximados (número de componentes, times ou microfrontends consumindo a biblioteca, ganho de tempo na construção de telas). Não usar nenhuma informação confidencial do iFood. 

**6\. Design System na era da GenAI (8 min) ⭐** 

**Objetivo:** projetar o tema para o futuro do desenvolvimento de software. 

**Conteúdo:** 

\- **O novo cenário:** além de várias pessoas, agora há também agentes de IA gerando código e interfaces em paralelo. 

\- **O risco:** sem padrão, cada prompt gera um botão novo, e o produto vira um "monstro de Frankenstein".  

\- **O Design System como contexto e harness para a IA:** tokens e componentes funcionam como um vocabulário restrito. A IA passa a compor com peças existentes em vez de inventar peças novas. 

\- **Na prática:** \- documentação do Design System usada como contexto para assistentes de código; \- integração design-to-code a partir do Figma; \- regras de lint que barram estilos fora dos tokens. 

\- **Mensagem central:** um Design System bem definido permite código e design mais coesos e várias pessoas (e agentes) trabalhando no mesmo projeto sem perder a consistência. O reuso deixa de ser só entre pessoas e passa a incluir as máquinas. 

**7\. Demonstração prática (5 min)**  
**Objetivo:** tornar o reuso visível. 

**Opções (escolher uma):** 

\- **Opção A (simples):** alterar um token e mostrar a mudança se propagando por vários componentes (ex.: no Storybook). 

\- **Opção B (mais impactante):** pedir a um assistente de IA que gere a mesma tela duas vezes, primeiro sem contexto e depois com o Design System como referência, e comparar os resultados. 

**Atenção:** preparar a demo com antecedência e ter prints ou vídeo como plano B caso algo falhe ao vivo. 

**8\. Desafios e limitações (3 min)** 

**Conteúdo:** \- Adoção pelos times. \- Manutenção contínua (o Design System é um produto, não um projeto com fim). \- Rigidez que pode limitar a criatividade. \- Breaking changes e dependência entre times. \- Custo alto para empresas pequenas. 

**9\. Conclusão e perguntas (4 min)** 

**Conteúdo:** \- Voltar à pergunta da abertura: **dá para ir rápido sem virar bagunça, desde que o reuso seja uma estratégia, e não um acaso.** \- Recapitular em uma frase cada ideia central: Design System como reuso em vários níveis, o case iFood como prova prática e a GenAI como motivo para investir nisso agora. \- Abrir para perguntas. 

**Divisão de responsabilidades** 

[analiviamgarbin@usp.br](mailto:analiviamgarbin@usp.br)  
[brunobbreda3@usp.br](mailto:brunobbreda3@usp.br)  
[Gabriel Fernando Machado Fachini](mailto:gabriel_fachini@usp.br)  
@bueno  
@prato  
2 slides p/ pessoa

| Bloco  | Responsável  | Observações |
| :---- | :---- | :---- |
| 1\. Abertura |  |  |
| 2\. O que é um DS |  |  |
| 3\. DS e Reuso |  |  |
| 4\. Anatomia |  |  |
| 5\. Case iFood  |  | Idealmente quem viveu o case @prato |
| 6\. GenAI |  | [Gabriel Fernando Machado Fachini](mailto:gabriel_fachini@usp.br) |
| 7\. Demo |  |  |
| 8\. Desafios |  |  |
| 9\. Conclusão |  |  |

**Próximos passos** 

\[ \] Definir responsáveis por bloco 

\[ \] Detalhar o texto de apoio de cada bloco 

\[ \] Montar os slides 

\[ \] Escolher e preparar a demonstração (opção A ou B) 

\[ \] Levantar dados aproximados para o case iFood 

\[ \] Ensaio completo cronometrado