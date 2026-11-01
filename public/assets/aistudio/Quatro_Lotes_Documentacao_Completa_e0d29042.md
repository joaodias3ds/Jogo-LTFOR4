# Quatro Lotes — Centro Empresarial

**Documento mestre de design e montagem · Versão 0.2 · 01/11/2026**

Projeto de jogo de gestão empresarial em pixel art 2D, com visão superior, interiores visíveis e simulação de pessoas, empresas, obras e veículos.

Este documento reúne as regras propostas para desenvolvimento. É uma especificação de projeto, não uma declaração de funcionalidades já implementadas. Valores de capacidade, duração, custos, quantidade de pessoas e pesos de avaliação são parâmetros iniciais de balanceamento. As decisões explícitas do jogador descritas aqui têm precedência sobre esses valores.

## Índice

1. Conceito, objetivos e decisões adotadas
2. Mundo, mapa e organização dos quatro lotes
3. Personagem do jogador, autoridade e reuniões
4. Infraestrutura comum e catálogo de ambientes
5. Obras, montagem, manutenção e organização
6. Lote de Educação
7. Lote de Logística
8. Lote de Comércio
9. Lote de Escritórios
10. Comunicação e serviços entre empresas
11. NPCs padrão e personagens com IA
12. Funcionários, tarefas, necessidades e circulação
13. Animações, estados visuais e direção de arte
14. Veículos, trânsito e equipamentos móveis
15. Tempo, calendário, economia e progressão
16. Interface centrada no mapa e ações
17. Eventos, ocorrências e consequências
18. Dados, salvamento e recuperação
19. Arquitetura da simulação e contratos de sistemas
20. Plano de montagem por etapas e critérios de aceite
21. Catálogo visual, personagens e prompts
22. Cenário completo de funcionamento e lista de validação

---

# Parte 1 — Conceito, objetivos e decisões adotadas

## 1.1. Visão do jogo

O jogador administra um complexo com quatro lotes especializados. Pode construir empresas próprias, alugar espaços a empresas de NPCs ou combinar os dois modelos. Seu personagem anda pelo mapa, visita os ambientes, conversa, participa de reuniões e acompanha o trabalho acontecendo.

O foco do jogador é administrativo: organizar, contratar, planejar, delegar, acompanhar e melhorar. Ajudar em uma tarefa é opcional; o funcionamento cotidiano precisa ser sustentado pela equipe.

| Lote | Atividade principal | Receitas |
|---|---|---|
| Educação | Escola, cursos, treinamentos e suporte educacional | Matrículas, mensalidades, treinamentos e aluguel de salas |
| Logística | Armazenamento, preparação e transporte | Armazenagem, separação, embalagem e entregas |
| Comércio | Exposição, venda de produtos e lojas | Vendas, encomendas, serviços associados e locação de lojas |
| Escritórios | Serviços profissionais, projetos e manutenção | Contratos, projetos, suporte, coworking e aluguel |

## 1.2. Pilares

- **Tudo tem representação no mundo:** pedidos geram pessoas, caixas, documentos, atividades ou veículos visíveis.
- **Organização tem consequência:** distâncias, filas, falta de materiais e salas mal distribuídas afetam resultados.
- **Boa apresentação tem valor:** limpeza, conservação, iluminação, acessibilidade, sinalização e decoração compõem a experiência.
- **Delegação real:** funcionários e gestores trabalham sem cliques individuais constantes.
- **Expansão por etapas:** começar pequeno deve ser viável; serviços externos suprem o que ainda não existe no complexo.
- **Causa compreensível:** toda interrupção precisa informar motivo, impacto e forma possível de resolver.
- **IA contextual:** alguns personagens conversam e formulam propostas com IA; os sistemas determinam regras e resultados.

## 1.3. O ciclo principal

Observar demanda → escolher investimento → construir e equipar → contratar e definir rotinas → abrir operação → acompanhar pessoas e indicadores → resolver problemas → melhorar e expandir.

## 1.4. Condições de sucesso

A campanha apresenta metas graduais de operação, organização, satisfação e sustentabilidade financeira. Não basta ter dinheiro: o complexo precisa funcionar de forma consistente. O modo livre permite continuar após as metas.

O jogador pode optar por recuperação financeira quando ficar sem caixa: pausar expansão, renegociar, vender bens, reduzir operação e buscar crédito do universo fictício do jogo. A campanha só termina por falência após um período de recuperação claramente informado.

## 1.5. Escopo e escolhas de base

- Modo individual, com salvamento local como base de implementação.
- Quatro lotes principais fixos; cada um contém setores, unidades, salas e empresas. A expressão “mais lotes” será atendida inicialmente com mais unidades internas e áreas de expansão. Um futuro mapa com novos terrenos é uma expansão separada.
- Visão superior ortogonal com faces frontais discretas, como na referência; sem projeção isométrica.
- Construção modular sobre grade; interiores sempre legíveis.
- Sem necessidade de IA conectada para jogar os sistemas essenciais.
- Uma obra de sala ou edifício tem sete dias de calendário de duração planejada; bloqueios podem atrasar. Não há conclusão instantânea na campanha.
- Todas as empresas compartilham o mesmo relógio e as mesmas regras de movimentação.

---

# Parte 2 — Mundo, mapa e organização dos quatro lotes

## 2.1. Composição inicial

Mapa inicial proposto: 256 × 192 células. Tile lógico: 32 × 32 pixels. Cada lote tem uma área útil inicial de até 72 × 56 células, ajustável no editor de mapa. Os números servem à montagem do primeiro cenário e devem ser validados com os trajetos e a densidade visual.

Educação e Escritórios ficam próximos da praça e dos acessos de pedestres. Comércio tem maior frente para a rua. Logística possui acesso de serviço e pátio separado para reduzir conflito entre cargas e visitantes.

## 2.2. Áreas comuns externas

| Área | Conteúdo | Regras |
|---|---|---|
| Entrada principal | Identificação, portaria e orientação | Recebe pedestres e visitantes |
| Acesso de serviço | Cancela, espera e sinalização | Prioridade para entregas e obras |
| Praça central | Bancos, árvores, iluminação e mapa | Descanso e encontro de personagens |
| Passeios | Caminhos e travessias | Devem conectar todas as entradas públicas |
| Estacionamento | Vagas comuns, acessíveis, motos e bicicletas | Reservas por uso e limite de ocupação |
| Pátio logístico | Espera de caminhões e manobras | Sem mesas ou atrações de pedestres |
| Central de resíduos | Coleta separada e acesso de serviço | Retirada programada |
| Canteiro temporário | Materiais, contêiner e equipamentos | Isolado durante as obras |
| Jardim e paisagismo | Árvores, canteiros e irrigação | Exige manutenção e não pode bloquear passagem |
| Ponto de transporte | Embarque e desembarque | Alimenta fluxo de clientes e alunos |

## 2.3. Hierarquia espacial

Complexo → lote → edifício → unidade empresarial → sala → posição de interação.

Uma empresa pode ocupar o lote inteiro ou apenas algumas unidades. Uma sala pode ser compartilhada por agenda, mas não pode ser locada com exclusividade a duas empresas no mesmo período.

## 2.4. Zonas e permissões

Zonas públicas, atendimento acompanhado, funcionários, técnicas, estoque, docas e obras. Cada porta pode definir grupos permitidos e horário. A restrição precisa ser visível no painel; pessoas impedidas procuram recepção ou geram uma solicitação, em vez de atravessar paredes.

## 2.5. Capacidade de mundo

Meta inicial de teste: 120 NPCs ativos, 12 veículos ativos e até 300 tarefas pendentes. Não é promessa de desempenho. O teste de carga deve definir os limites reais antes de ampliar público e mapa.

Visitantes ainda fora do mapa podem ser simulados de forma resumida. NPCs visíveis não desaparecem para resolver tarefas instantaneamente. Rotas externas possuem duração e estado mesmo quando o veículo está fora da área jogável.

---

# Parte 3 — Personagem do jogador, autoridade e reuniões

## 3.1. Ações no mundo

Caminhar, interagir com portas e pessoas, examinar objetos, abrir quadros, visitar obras, inspecionar salas, convocar gestores, aprovar solicitações, contratar serviços, mudar prioridades, verificar entregas e participar de reuniões.

Ao entrar numa empresa, aparece uma barra contextual: **Operação · Equipe · Organizar · Contratos · Solicitações · Relatórios**. Selecionar uma ação abre um painel lateral sem esconder o local.

## 3.2. Modos de controle

- **Personagem:** deslocamento e interação presencial.
- **Inspeção:** clicar em salas, pessoas e objetos para observar e emitir ordens.
- **Gestão:** relatórios e políticas globais.
- **Construção:** planta, orçamento, obra e mobiliário.

O acesso remoto mostra dados e permite ordens autorizadas. Reuniões formais continuam sendo eventos presenciais para decisões estratégicas e prestação de contas. Um gerente pode receber uma ordem digital sem o jogador precisar atravessar o mapa para cada tarefa.

## 3.3. Autoridade por modelo de empresa

| Modelo | O jogador controla | O gestor controla |
|---|---|---|
| Própria | Capital, contratação, preços, instalações, políticas e contratos | Rotina delegada e distribuição da equipe |
| Alugada | Imóvel, manutenção incluída, regras comuns e contrato de locação | Negócio, equipe, preços e operação interna |
| Mista | Cada unidade conforme propriedade e contrato | Somente o escopo concedido |

O proprietário não controla livremente empregados de um locatário. Pode conversar, negociar serviços e registrar ocorrências previstas no contrato.

## 3.4. Reuniões com relatório entregue pelo personagem

Estados: solicitada → proposta de horário → confirmada → preparação → deslocamento → aguardando participantes → em andamento → decisões registradas → encerrada.

1. Jogador ou gestor solicita reunião, escolhendo assunto, local e participantes.
2. Agenda verifica jornada, disponibilidade da sala e tempo de deslocamento.
3. O gestor prepara um resumo até o horário marcado.
4. O NPC carrega uma pasta ou tablet e caminha até a sala.
5. Ao sentar e iniciar a reunião, apresenta o relatório ao administrador.
6. O painel mostra fatos, propostas e decisões disponíveis.
7. Cada aprovação cria tarefas, contratos ou alterações de política validadas.
8. Uma ata registra responsáveis, custos aprovados e prazos.

Relatório: período analisado, caixa e compromissos autorizados, receitas, custos, capacidade, ocorrências, satisfação, decisões pendentes e até três propostas prioritárias.

Para locatários, o resumo inclui aluguel, solicitações, uso do imóvel e indicadores compartilhados por contrato; não revela automaticamente toda a contabilidade privada.

## 3.5. Ausência, atraso e autonomia

Após 15 minutos de jogo de tolerância, uma reunião pode ser remarcada. Participantes retornam ao trabalho. O relatório preparado permanece disponível, marcado como não apresentado.

O gestor possui limite de gasto por decisão e por período. Dentro dele, pode resolver rotinas permitidas. Fora dele, envia aprovação. Emergências seguem uma reserva configurada pelo jogador e sempre geram prestação de contas.

O gasto é reservado na aprovação, não na fala do NPC. Duas propostas não podem consumir o mesmo saldo.

---

# Parte 4 — Infraestrutura comum e catálogo de ambientes

## 4.1. Catálogo compartilhado

Dimensões abaixo são sugestões em células, com móveis de escala compatível. A capacidade final depende de posições acessíveis e equipamentos, não apenas da área.

| Ambiente | Base sugerida | Objetos e função | Dependências |
|---|---|---|---|
| Hall e entrada | 6 × 5 | Identificação, tapete, mapa e iluminação | Acesso público |
| Recepção | 8 × 6 | Balcão, estação, telefone e espera | Atendente e energia |
| Espera | 6 × 5 | Assentos, água e painel | Assentos acessíveis |
| Atendimento individual | 5 × 5 | Mesa, duas cadeiras e terminal | Profissional disponível |
| Administração | 6 × 6 | Estações, arquivo e quadro | Acesso restrito |
| Gerência | 5 × 5 | Mesa, armário e painel | Gestor designado |
| Reunião | 7 × 6 | Mesa, cadeiras e tela | Reserva e capacidade |
| RH e entrevista | 5 × 5 | Mesa e arquivos | Responsável pelo RH |
| Financeiro | 5 × 5 | Estações e arquivo seguro | Permissão financeira |
| Banheiro individual | 3 × 4 | Vaso, pia, espelho e lixeira | Água e esgoto |
| Banheiro acessível | 4 × 5 | Equipamentos e área livre | Rota acessível |
| Vestiário | 6 × 5 | Armários, bancos e lavatório | Água quando aplicável |
| Copa | 6 × 5 | Pia, geladeira, micro-ondas e mesa | Água e energia |
| Descanso | 6 × 5 | Sofá, assentos e iluminação | Lotação e pausas |
| Limpeza | 3 × 4 | Tanque, prateleira e carrinho | Material e funcionário |
| Almoxarifado | 5 × 5 | Prateleiras e identificação | Controle de retirada |
| Oficina de manutenção | 6 × 5 | Bancada, ferramentas e peças | Técnico habilitado no jogo |
| Sala de TI | 4 × 4 | Rede, equipamento e nobreak | Energia e ventilação |
| Área elétrica | 3 × 4 | Quadro e infraestrutura | Acesso de manutenção |
| Arquivo | 4 × 5 | Armários e catálogo | Permissão e organização |
| Impressão e apoio | 4 × 4 | Impressora, papel e bancada | Energia e consumíveis |
| Primeiros cuidados | 4 × 5 | Maca, cadeira e armário | Responsável designado |
| Segurança | 4 × 4 | Estação, rádio e monitor | Funcionário e energia |
| Resíduos | 4 × 5 | Recipientes e acesso de coleta | Retirada periódica |
| Estacionamento coberto | Por veículo | Vagas e identificação | Acesso de veículo |
| Bicicletário | Modular | Suportes e cobertura opcional | Acesso externo |
| Jardim de convivência | Modular | Bancos, plantas e luz | Conservação |

Instalações de segurança e acessibilidade são regras simplificadas do jogo, não projetos técnicos de edifícios reais.

## 4.2. Objetos transversais

Portas comuns e de serviço, divisórias, janelas, luminárias, tomadas representativas, ventiladores, climatizadores, bebedouros, relógios, extintores cenográficos funcionais no sistema, placas, mapas, câmeras, lixeiras, plantas, bancos, armários, roteadores, impressoras e quadros.

Cada objeto define preço, tamanho, rotação, durabilidade, consumo, manutenção, ruído, qualidade visual, pontos de interação e tags de compatibilidade com salas.

## 4.3. Serviços de suporte

Energia, água, internet, limpeza, manutenção, resíduos, segurança, acessibilidade e conforto térmico. O protótipo usa uma conexão por edifício e capacidade contratada; redes físicas detalhadas ficam para uma fase posterior.

Consumo deriva de ocupação e equipamentos em uso. Falta de capacidade gera aviso antes de interromper atividades; serviço interrompido afeta somente os sistemas dependentes.

## 4.4. Capacidade e avaliação

Capacidade de uma sala = menor limite entre posições utilizáveis, equipe, recursos e limite do tipo de ambiente. A capacidade do edifício também considera serviços de apoio.

Notas independentes de 0 a 100: apresentação, conforto, organização e eficiência. A apresentação combina limpeza 25%, conservação 20%, organização visual 20%, iluminação 15%, sinalização 10% e decoração 10%. Repetição decorativa tem ganho decrescente. Bloqueio de rota reduz organização e pode impedir a abertura.

---

# Parte 5 — Obras, montagem, manutenção e organização

## 5.1. Estados detalhados

Planejado → orçamento aprovado → materiais encomendados → aguardando início → em construção → vistoria → incompleto ou pronto → equipado → aguardando abertura → em funcionamento.

Estados laterais: obra suspensa, operação com problema, operação parcial, em manutenção, interditado e desativado. Um edifício pode estar parcialmente aberto, desde que a obra esteja isolada e não interrompa os acessos das salas ativas.

## 5.2. Sete dias de obra

Cada sala avulsa ou edifício contratado é um pacote de obra com sete dias de calendário planejados. Um prédio contratado como pacote inclui as salas especificadas: não soma sete dias de prédio mais sete por cada sala. Uma sala adicionada depois é um novo pacote.

Na condição normal, o pacote começa no início do dia D e termina no início de D+7. O trabalho visível ocorre nas jornadas diurnas; o avanço é planejado para sete dias, incluindo a vistoria. Contratações feitas após o início da jornada entram no próximo dia.

| Dia | Trabalho visível | Materiais e animações |
|---|---|---|
| 1 | Isolamento, descarga e preparação | Caminhão chega; equipe posiciona cones, cercas e materiais |
| 2 | Base e estrutura | Trabalhadores transportam e instalam elementos |
| 3 | Paredes e divisórias | Paredes surgem em trechos; ferramentas e carrinhos |
| 4 | Energia, rede e instalações | Técnicos trabalham nos pontos previstos |
| 5 | Piso, pintura e acabamento | Alterações graduais das superfícies |
| 6 | Portas e equipamentos fixos | Instalação, descarte de embalagens e ajustes |
| 7 | Testes, limpeza e vistoria | Equipe verifica requisitos; entrega no término do ciclo |

Não se aumenta o percentual só porque o relógio passou: é necessário cumprir os marcos. Materiais faltantes, equipe ausente ou acesso impedido suspendem o marco e deslocam a previsão. O painel mostra duração planejada, tempo transcorrido, causa da suspensão e nova previsão.

## 5.3. Equipe de obra

Encarregado, pedreiro, ajudante, eletricista, instalador, pintor, montador, técnico de rede e motorista de materiais. Uma empreiteira fornece o pacote; o jogador pode futuramente ter equipe própria. O tamanho da equipe varia com o pacote para manter o prazo normal de sete dias. A equipe não se teletransporta e precisa de acesso ao canteiro.

## 5.4. Materiais e pagamentos

O orçamento lista material, mão de obra, transporte e reserva. Proposta inicial: 30% ao contratar, 40% após instalações e 30% na entrega. Parcelas futuras aparecem como compromissos. Alterar o projeto após o início gera aditivo com diferença de custo e prazo exibida antes de aceitar.

Materiais têm estados encomendado, em trânsito, recebido, reservado, instalado e sobra. Uma unidade instalada não pode continuar disponível no depósito. Sobras voltam ao almoxarifado ou são vendidas conforme categoria.

## 5.5. Móveis e reformas

Comprar → receber → guardar → criar tarefa de montagem → transportar → instalar → testar → liberar. Objetos pequenos podem ser instalados rapidamente por equipe interna; uma reforma estrutural continua sendo pacote de sete dias. A duração aparece antes da aprovação.

Mover um objeto em uso cria pedido de liberação. A operação deve esvaziar ou redirecionar o posto antes da movimentação. Cancelar obra paga a parte já executada, devolve reservas não usadas e mantém a área segura.

## 5.6. Validações de construção

- Grade, limites do terreno, interseções e rotação.
- Porta conectada a circulação válida.
- Área livre de uso para cada equipamento.
- Percurso público e de serviço quando necessário.
- Nenhuma saída essencial bloqueada.
- Capacidade de infraestrutura.
- Separação de obra e operação.
- Saldo e compromissos futuros suficientes conforme política de caixa.

## 5.7. Manutenção

Condição de 0 a 100 cai por horas de uso e ambiente. Abaixo de 40, aumenta chance de falha; abaixo de 15, o equipamento fica indisponível. Inspeção preventiva gera tarefa, reserva peça e agenda parada. Reparar restitui condição conforme serviço; substituição troca o objeto e dá destino ao antigo.

O jogador escolhe manutenção interna ou prestador externo. Serviços de locação seguem a responsabilidade definida no contrato.

---

# Parte 6 — Lote de Educação

## 6.1. Unidades internas e modelos de negócio

Escola de cursos livres, reforço escolar, idiomas, informática, capacitação profissional, treinamento empresarial, aulas particulares, suporte educacional e locação de salas. A operação inicial escolhe poucos cursos; especializações exigem equipamentos e pessoas.

## 6.2. Catálogo de ambientes

| Unidade ou sala | Conteúdo | Operação e dependências |
|---|---|---|
| Secretaria acadêmica | Balcões, estações e arquivo | Cadastro, matrícula e documentos |
| Atendimento e orientação | Mesa e assentos | Conversa com aluno e responsável NPC |
| Sala comum pequena | 8 posições e quadro | Aula com professor e turma |
| Sala comum média | 16 posições e projetor | Maior turma; exige apoio proporcional |
| Sala de aula particular | 2–4 posições | Horários individuais |
| Laboratório de informática | 8–12 computadores | Energia, rede e suporte |
| Laboratório de práticas | Bancadas e materiais do curso | Atividade compatível e instrutor |
| Sala de idiomas | Equipamento de áudio e estações | Curso de idiomas |
| Sala de redação e leitura | Mesas, quadro e acervo | Correção e produção textual |
| Biblioteca | Estantes, mesas e catálogo | Empréstimo e estudo |
| Estudo silencioso | Mesas individuais | Controle de ruído e lotação |
| Monitoria | Mesas de grupo | Apoio em horários específicos |
| Coordenação | Estações e quadro de turmas | Planejamento e acompanhamento |
| Sala dos professores | Mesas, armários e apoio | Preparação e pausa |
| Suporte educacional | Bancada e atendimento | Ajuda com computadores e materiais |
| Produção de materiais | Impressora e bancada | Apostilas e atividades |
| Auditório | Palco, assentos e apresentação | Palestra e locação por agenda |
| Sala de treinamento | Mesas modulares e tela | Contratos de capacitação |
| Pátio de intervalo | Assentos e água | Convivência sem bloquear aulas |

Além dessas salas, implantar infraestrutura comum proporcional à ocupação.

## 6.3. Funcionários

| Cargo | Responsabilidade | Requisitos e substituição |
|---|---|---|
| Diretor | Estratégia e reuniões | Pode ser o jogador no início |
| Coordenador pedagógico | Qualidade e organização | Habilidade de gestão e ensino |
| Secretário | Cadastro, matrícula e documentos | Atendimento administrativo |
| Recepcionista | Triagem e espera | Atendimento |
| Professor por especialidade | Preparação, aula e avaliação | Disciplina compatível |
| Professor substituto | Cobrir ausências | Disponibilidade e disciplina |
| Instrutor de informática | Aulas práticas | Habilidade digital |
| Monitor | Apoio e dúvidas | Conhecimento do curso |
| Tutor | Acompanhamento individual | Capacidade limitada de alunos |
| Bibliotecário | Acervo e empréstimos | Organização |
| Técnico educacional | Equipamentos e suporte | Manutenção digital |
| Auxiliar de materiais | Impressão e kits | Produção e estoque |
| Comercial de matrículas | Interessados e propostas | Atendimento e vendas |
| Financeiro | Cobranças e acordos | Permissão financeira |
| Inspetor de circulação | Intervalos e orientação | Rotina e atendimento |
| Limpeza, manutenção e segurança | Serviços comuns | Equipe própria ou compartilhada |

Início enxuto: recepcionista/secretário, professor e limpeza parcial. Acúmulo de função usa a mesma jornada e reduz capacidade, sem criar trabalho simultâneo impossível.

## 6.4. Dados acadêmicos

Curso: disciplina, duração, pré-requisitos, materiais e preço. Turma: curso, capacidade, calendário, professor e sala. Aula: data, início, fim, conteúdo, recursos e presença. Matrícula: aluno, turma, contrato, pagamentos e situação.

## 6.5. Fluxo completo

Interesse → atendimento → proposta → matrícula → reserva de vaga → pagamento ou acordo → agenda → preparação → chegada → aula → avaliação → acompanhamento → renovação ou conclusão.

Antes da aula, o sistema verifica sala, assentos, professor, materiais e condição dos equipamentos. Sem professor, procura substituto habilitado. Sem solução, oferece reposição e informa os envolvidos; não cobra uma aula cancelada como realizada.

## 6.6. Aprendizagem e satisfação

Ganho de aprendizagem por aula depende de presença, habilidade docente, preparação, material, conforto e tamanho da turma. Resultado fica limitado à escala do curso. Ausências não geram aprendizagem presencial. Aprendizagem e satisfação são indicadores separados.

Ruído, atraso e falta de equipamento afetam satisfação. Melhorias não recuperam automaticamente todas as perdas anteriores; a reputação se ajusta ao histórico.

## 6.7. Quadros e eventos

Quadros de horários, ocupação, faltas, aprendizagem, materiais, atendimento e financeiro. Alertas: conflito de agenda, professor ausente, turma sem procura, equipamento indisponível, atraso de apostilas e excesso de fila.

Locação de sala exige agenda, intervalo de preparação, responsável externo e regras de entrega. Aluguel não cria uma turma própria automaticamente.

## 6.8. Progressão

Nível 1: duas salas e secretaria. Nível 2: informática, monitoria e mais turnos. Nível 3: biblioteca e treinamento empresarial. Nível 4: auditório, especializações e gestão delegada. Desbloqueios dependem de demanda, qualidade e investimento, sem impedir melhorias cosméticas antes disso.

---

# Parte 7 — Lote de Logística

## 7.1. Unidades internas

Armazém geral, preparação de pedidos, distribuição local, transporte empresarial, operação de encomendas do comércio, armazenamento contratado e devoluções. Área de temperatura controlada é expansão com custo e regras próprios.

## 7.2. Ambientes

| Unidade ou sala | Conteúdo | Função |
|---|---|---|
| Portaria operacional | Cancela, rádio e terminal | Agendamento e acesso |
| Pátio de espera | Vagas de veículo | Evitar bloqueio de docas |
| Doca de recebimento | Plataforma e carrinhos | Descarregar |
| Conferência | Bancada, leitor e balança | Validar quantidade e condição |
| Armazém leve | Estantes e posições | Caixas pequenas |
| Porta-paletes | Estruturas e corredores largos | Cargas compatíveis |
| Alto valor | Área restrita e controle | Produtos com exigência especial |
| Controle térmico | Estantes e climatização | Expansão para itens compatíveis |
| Separação | Carrinhos e pontos de coleta | Reunir pedidos |
| Embalagem | Bancada, embalagens e etiquetas | Preparar volumes |
| Consolidação | Baias por pedido ou rota | Impedir mistura de cargas |
| Expedição | Doca e zona de carregamento | Despachar |
| Devoluções | Bancadas e posições | Inspeção e destino |
| Quarentena | Área isolada | Avarias ou divergências |
| Central de rotas | Estações e painel | Acompanhar entregas |
| Administração de contratos | Escritório e arquivo | Clientes e cobrança |
| Garagem | Vagas e inspeção | Guarda e preparação |
| Oficina | Ferramentas e peças | Manutenção |
| Carregamento ou abastecimento | Ponto compatível | Energia ou combustível abstrato |

## 7.3. Equipe

Gerente de operação, supervisor de turno, assistente de agendamento, porteiro, conferente, estoquista, operador de empilhadeira, separador, embalador, expedidor, motorista por categoria, entregador de moto, ajudante de carga, planejador de rotas, analista de estoque, atendente de ocorrências, mecânico, comprador de suprimentos e equipe comum.

Operador de equipamento e motorista precisam da habilitação fictícia correspondente. Capacidade de carga e velocidade de serviço dependem da equipe e dos recursos, não de uma animação genérica.

## 7.4. Fluxos de entrada e saída

Entrada: aviso de chegada → agendamento → portaria → vaga ou doca → descarga → conferência → aceite parcial ou total → endereçamento → armazenagem.

Saída: pedido aceito → reserva de itens → separação → conferência → embalagem → consolidação → reserva de veículo e motorista → carregamento → rota → entrega → confirmação → cobrança.

Devolução: autorização → transporte de retorno → recebimento → inspeção → estoque liberado, reparo, devolução ao fornecedor ou descarte.

## 7.5. Regras de estoque

Cada lote de produto guarda dono, SKU, quantidade, condição, posição, entrada, custo e validade quando aplicável. Mercadoria de clientes não se torna patrimônio do armazém. A logística recebe taxas, não o valor integral dos produtos armazenados.

Disponível = saldo físico − reservas − quarentena. Reservas possuem identificador e liberação por cancelamento. Itens com validade usam a primeira validade disponível; sem validade, usam ordem de entrada como padrão.

Produtos não podem ocupar posições incompatíveis em peso, volume ou condição. Separação incorreta gera retrabalho antes de expedir quando detectada; se sair, gera ocorrência posterior.

## 7.6. Rotas

Pedido define destino, janela de atendimento, peso e volume. Planejamento agrupa pedidos compatíveis, respeita jornada e capacidade. A previsão considera carregamento, deslocamento, paradas e retorno.

Um veículo fora do mapa continua numa rota registrada, com horário de chegada e eventos possíveis. Não se cobra entrega antes da confirmação prevista no contrato.

## 7.7. Quadros e indicadores

Docas, estoque, separação, expedição, rotas, frota, devoluções e contratos. Indicadores: pontualidade, divergência, avaria, utilização de posições, pedidos por hora de trabalho e custo por entrega. Sempre apresentar período e denominador.

## 7.8. Progressão

Pequeno depósito com van → armazém endereçado e caminhão leve → múltiplas rotas e contratos → docas adicionais e especialização. Novas docas exigem acesso físico de veículos.

---

# Parte 8 — Lote de Comércio

## 8.1. Unidades internas

Papelaria e materiais educacionais, informática, acessórios, produtos personalizados, utilidades e showroom empresarial. As unidades podem ser próprias, alugadas ou operar como lojas independentes dentro de uma galeria.

## 8.2. Ambientes

| Unidade ou sala | Conteúdo | Função |
|---|---|---|
| Vitrine | Expositores e luz | Atrair público interessado |
| Salão de vendas | Gôndolas, ilhas e circulação | Exposição por categoria |
| Atendimento consultivo | Balcão e mostruário | Explicar produtos |
| Demonstração | Bancada e equipamento | Testar itens compatíveis |
| Caixa | Terminal e balcão | Finalizar pagamento |
| Retirada | Estantes de reserva | Entregar encomendas |
| Estoque | Posições identificadas | Reposição |
| Recebimento | Bancada e entrada de serviço | Conferir compras |
| Trocas | Balcão e área de análise | Pós-venda |
| Assistência | Bancada e ferramentas | Serviço contratado de manutenção |
| Personalização | Bancada e máquina de produção | Encomendas compatíveis |
| Compras e precificação | Escritório e painel | Planejar reposição e margem |
| Administração | Estações e arquivo | Finanças e equipe |
| Loja locável pequena | Salão e infraestrutura | Um locatário |
| Loja locável média | Salão, apoio e estoque | Operação maior |
| Quiosque | Exposição e caixa | Operação compacta |

## 8.3. Equipe

Gerente, supervisor de loja, vendedor, consultor de produtos, caixa, repositor, estoquista, conferente, comprador, analista de preços, atendente de retirada, atendente de trocas, técnico de assistência, operador de personalização, vitrinista, segurança e serviços comuns.

## 8.4. Jornada do consumidor

Chegar → identificar categoria → procurar → comparar → pedir ajuda opcional → reservar item → entrar na fila → pagar → receber → sair. Pode abandonar em qualquer etapa por falta de produto, preço incompatível ou espera excessiva.

Cada cliente possui intenção, orçamento, categorias de interesse, preferência de qualidade, paciência e restrições de horário. A loja não converte todos os visitantes automaticamente.

## 8.5. Produtos e dinheiro

Estados: encomendado, em trânsito, depósito, exposição, reservado, vendido, devolvido e avariado. O caixa confirma a venda e baixa o estoque numa única transação. Pagamento recusado ou abandono libera reserva.

Compra de estoque reduz caixa e aumenta ativo de estoque. O custo entra no resultado quando o produto é vendido ou perdido. Descontos têm limite por cargo; venda abaixo do limite pede aprovação.

## 8.6. Personalização e assistência

Pedido personalizado define especificação, insumos, prazo, preço e aceite. A produção gera tarefas e consumo de material. Assistência recebe o item do cliente, realiza diagnóstico, apresenta orçamento e só executa o serviço autorizado.

## 8.7. Quadros e progressão

Vendas, margem, reposição, compras, pedidos, assistência, filas e locações. Evolução: uma loja → duas categorias → encomendas e entrega → galeria com lojas e serviços. Campanhas devem considerar capacidade para não atrair uma fila impossível de atender.

---

# Parte 9 — Lote de Escritórios

## 9.1. Unidades internas

Desenvolvimento de sistemas, design, marketing, consultoria, serviços administrativos, suporte técnico, manutenção de equipamentos, coworking e salas empresariais alugadas.

## 9.2. Ambientes

| Unidade ou sala | Conteúdo | Função |
|---|---|---|
| Recepção empresarial | Balcão e espera | Visitantes e agenda |
| Coworking aberto | Mesas e pontos de trabalho | Aluguel por turno ou período |
| Escritório privativo | Estações e armários | Empresa própria ou locatário |
| Reunião pequena | 4–6 lugares | Atendimento e alinhamento |
| Reunião grande | 8–12 lugares e tela | Reuniões de gestão |
| Sala de projetos | Estações e quadro | Trabalho de equipe |
| Criação e design | Equipamentos de produção | Serviços visuais |
| Estúdio de conteúdo | Câmera cenográfica, luz e mesa | Produção por tarefa |
| Desenvolvimento | Estações e painel | Projetos de software abstratos |
| Qualidade | Estações de revisão | Verificar entregas |
| Suporte | Atendimento e bancada | Chamados de TI |
| Oficina técnica | Ferramentas e peças | Diagnóstico e reparo |
| Estoque de peças | Prateleiras | Materiais de manutenção |
| Comercial | Estações e atendimento | Propostas e contratos |
| RH | Sala de entrevista | Contratação e treinamento |
| Financeiro | Estações e arquivo | Contas e relatórios |
| Sala de diretoria | Mesa e quadro | Administração |
| Treinamento | Mesas e tela | Capacitação e locação |
| Cabine silenciosa | Mesa e isolamento | Chamadas e foco |
| Apoio de impressão | Equipamentos e insumos | Produção administrativa |

## 9.3. Equipe

Diretor de unidade, gerente de projetos, líder técnico, desenvolvedor, designer, redator, analista de marketing, consultor, assistente administrativo, analista de qualidade, técnico de suporte, técnico de manutenção, analista de infraestrutura, comercial, recepcionista, financeiro, RH, gestor de coworking e serviços comuns.

## 9.4. Projetos

Demanda → levantamento → proposta → negociação → contrato → planejamento → execução → revisão → entrega → aceite → cobrança e suporte.

Cada tarefa tem especialidade, esforço, recursos e dependências. Trabalho paralelo só ocorre em tarefas independentes. Colocar dois profissionais na mesma tarefa não dobra automaticamente a velocidade; existe limite de colaboração.

Mudança de escopo gera aditivo. Retrabalho interno consome capacidade; ajustes previstos no contrato seguem o limite acordado. O jogador deve ver o motivo do atraso, não apenas um percentual parado.

## 9.5. Suporte e manutenção

Chamado registra solicitante, objeto, sintoma, prioridade e prazo. Triagem → diagnóstico → peça ou configuração → autorização quando necessária → reparo → teste → aceite. Retorno do mesmo defeito pode reabrir chamado sem nova cobrança conforme garantia fictícia do contrato.

## 9.6. Coworking e locação

Reserva define posições, período, serviços e preço. Impedir sobreposição. Um locatário de sala inteira pode nomear seu próprio gerente e solicitar reunião com o administrador. Desocupação exige aviso, inspeção, devolução de acesso e fechamento do contrato.

## 9.7. Indicadores

Prazo, esforço vendido e realizado, retrabalho, satisfação, ocupação, disponibilidade de equipamentos, chamados e receita recorrente. Locação e serviços próprios têm resultados separados e consolidação no complexo.

---

# Parte 10 — Comunicação e serviços entre empresas

## 10.1. Central de solicitações

Empresas podem conversar, solicitar orçamento, comprar, contratar, reservar, entregar e confirmar serviços. Toda comunicação com consequência operacional vira um registro estruturado.

Pedido: origem, destino, solicitante, categoria, descrição, quantidade, prioridade, prazo, orçamento, contrato, estado e histórico.

Estados: rascunho → enviado → recebido → em análise → proposta → aguardando aprovação → aprovado → programado → em execução → entregue → conferido → concluído. Saídas: recusado, cancelado e em disputa.

## 10.2. Formas visuais

Telefone na estação, mensagem no terminal, rádio operacional, documento levado por assistente e conversa presencial. O canal muda a apresentação e o tempo de contato, mas mantém o mesmo pedido como fonte de verdade.

## 10.3. Exemplos de cooperação

| Solicitante | Prestador | Solicitação | Resultado visível |
|---|---|---|---|
| Educação | Comércio | Apostilas e papel | Caixas recebidas e armazenadas |
| Educação | Escritórios | Conserto do laboratório | Técnico visita os computadores |
| Comércio | Logística | Entregas das encomendas | Coleta, carregamento e veículo saindo |
| Escritórios | Educação | Treinamento da equipe | Funcionários comparecem à aula |
| Logística | Escritórios | Suporte da central de rotas | Chamado e visita técnica |
| Todos | Administração | Ampliação de espaço | Reunião, aprovação e obra |

## 10.4. Contratos e autonomia

Gestores podem aceitar pedidos dentro da capacidade, margem e limite financeiro autorizados. Se excederem limite, pedem aprovação ou propõem prazo alternativo. O prestador pode recusar; uma empresa do jogador não tem capacidade infinita.

Ordens recorrentes incluem frequência, teto de gasto e revisão. Se faltar caixa ou estoque, geram exceção e não entram em repetição infinita.

## 10.5. Contabilidade interna

Empresas próprias mantêm centros de resultado separados. Transferência entre elas gera débito e crédito vinculados, sem criar receita externa no consolidado. Contratos com locatários independentes são transações externas ao grupo do jogador.

O sistema usa identificador único da transação para impedir dupla cobrança ou confirmação duplicada.

## 10.6. Dependências e conflitos

Uma tarefa de manutenção não pode esperar indefinidamente por uma compra que depende da aprovação dessa mesma tarefa. Pedidos bloqueados mostram a cadeia e oferecem compra externa, adiantamento autorizado ou cancelamento. Prazos de contratos dependentes precisam ser recalculados ao receber atraso confirmado.

---

# Parte 11 — NPCs padrão e personagens com IA

## 11.1. Camadas de comportamento

1. Agenda e permissões definem onde a pessoa pode estar.
2. Necessidades e prioridades definem o que precisa fazer.
3. Sistema de tarefas reserva trabalho e recursos.
4. Navegação leva ao ponto de interação.
5. Animação representa a execução.
6. IA opcional formula diálogo e propostas em eventos selecionados.

Nenhuma resposta de linguagem substitui validação dos sistemas.

## 11.2. Perfis

Visitante, aluno, responsável, cliente, locatário, fornecedor, funcionário, gestor, técnico externo, trabalhador de obra, motorista e administrador. Personalidade varia em sociabilidade, paciência, organização, ambição e tolerância a risco, sem vincular características de trabalho à aparência.

## 11.3. Personagens que podem usar IA

| Perfil | Gatilho | Pode propor | Não pode alterar diretamente |
|---|---|---|---|
| Diretor educacional | Revisão semanal | Cursos, vagas e treinamento | Notas, pagamentos e capacidade |
| Supervisor logístico | Gargalo ou reunião | Turnos, prioridades e frota | Estoque e entregas concluídas |
| Gerente comercial | Revisão de vendas | Campanha, compra e preços | Caixa e itens sem autorização |
| Gestor de projetos | Atraso ou nova demanda | Escopo, equipe e prazo | Tarefas concluídas sem execução |
| Locatário | Renovação ou problema | Contrato e melhoria | Propriedade do imóvel |
| Cliente especial | Encomenda ou projeto | Preferências e negociação | Orçamento além do seu limite |
| Funcionário selecionado | Desenvolvimento de carreira | Treinamento e condições | Salário e contrato sem aceite |
| Encarregado de obra | Bloqueio relevante | Aditivo ou remanejamento | Prazo sem motivo registrado |

## 11.4. Contexto e memória

Enviar somente cargo, personalidade resumida, fatos relevantes, indicadores autorizados, limite de negociação e últimas interações pertinentes. Memória guarda compromissos e decisões como dados; um resumo textual auxilia conversa, mas não vira saldo ou contrato.

Proposta de limite: 12 interações recentes e um resumo de até 1.500 caracteres por personagem. Orçamento inicial: até 20 solicitações de IA por dia de jogo, configurável. Priorizar reuniões e negociações; diálogos comuns usam biblioteca local.

## 11.5. Saída estruturada

```json
{
  "npc_id": "npc_gestor_01",
  "event_id": "evt_reuniao_001",
  "speech": "O atendimento ficou mais lento neste período.",
  "proposal": {
    "type": "request_hire",
    "role_id": "receptionist",
    "quantity": 1,
    "reason_code": "queue_capacity"
  },
  "requires_player_approval": true
}
```

O validador rejeita tipos desconhecidos, referências inexistentes, limites excedidos e conclusões incompatíveis com os fatos. Custos são consultados no catálogo atual pelo sistema. A IA não escolhe o salário final por texto livre.

## 11.6. Indisponibilidade e segurança operacional

Enquanto aguarda resposta, o personagem executa animação de conversa ou consulta. Após dez segundos reais, utiliza uma resposta padrão sem interromper a simulação. Respostas atrasadas são descartadas se o evento já foi encerrado. Não enviar chaves ou credenciais ao cliente de jogo; a integração conectada deve usar serviço intermediário.

O modo sem IA preserva todo o ciclo de contratação, operação, eventos e reuniões com modelos de texto. Limites e uso ficam visíveis nas configurações.

---

# Parte 12 — Funcionários, tarefas, necessidades e circulação

## 12.1. Cadastro e contratação

Funcionário: identificação, aparência, cargo, empresa, contrato, salário, jornada, habilidade, experiência, energia, satisfação, treinamento e permissões. Aparência não define produtividade.

Abrir vaga → receber candidatos → entrevista opcional → proposta → aceite → data de início → integração → alocação. Candidatos podem ter disponibilidade e pretensão diferentes. A contratação reserva custo de admissão e cria compromisso salarial.

## 12.2. Jornada e necessidades

Funcionários chegam antes do turno com margem configurável, guardam pertences, assumem posto, fazem pausas e encerram o trabalho. Energia, alimentação, banheiro e conforto afetam disposição. Pausas são escalonadas para evitar que todos abandonem os caixas ou a recepção juntos.

Necessidade crítica interrompe uma tarefa somente num ponto seguro. Um motorista não abandona o veículo em movimento; um conferente conclui ou registra o volume em mãos antes de sair.

## 12.3. Fila de tarefas

Campos: ID, tipo, origem, alvo, posição, prioridade, prazo, estimativa, habilidade, materiais, recursos exclusivos, pré-requisitos, responsável, progresso, estado e motivo de bloqueio.

Estados: criada, aguardando dependência, pronta, reservada, deslocamento, executando, pausada, bloqueada, concluída, cancelada e falha.

Seleção proposta: prioridade ponderada + urgência + adequação de habilidade − deslocamento − custo de interrupção. Tarefas antigas ganham prioridade gradualmente para não ficarem esquecidas. A política usa pesos por setor e permite ordem manual com justificativa.

## 12.4. Reservas e consistência

Reservar atomicamente funcionário, equipamento, ponto de interação e materiais. Se qualquer dependência falhar, desfazer a reserva parcial. Reservas recebem prazo de renovação; cancelamento, desligamento ou falha libera recursos.

Uma pessoa não executa duas tarefas físicas simultâneas. Tarefas administrativas passivas podem aguardar resposta enquanto a pessoa faz outra atividade, mas registram que estão em espera.

## 12.5. Circulação

Grade de navegação com custos por terreno, portas, permissões e congestionamento. Caminho é recalculado quando a geometria ou o destino muda, sem recalcular para cada personagem a cada quadro.

Corredores principais devem permitir ultrapassagem. NPCs cedem passagem em portas e filas. Posições de interação são reservadas; uma pessoa espera numa posição livre, sem sobrepor outra.

Sem caminho: tentar rota alternativa → aguardar curto intervalo → gerar ocorrência localizada → devolver tarefa à fila se necessário. Nunca teleportar para esconder o problema.

## 12.6. Filas

Fila possui serviço, capacidade, pontos de espera, atendentes e regra de prioridade. Uma senha é vinculada ao cliente. Abandono remove a senha, libera reservas e registra motivo. Atendimento começa apenas quando cliente e atendente estão disponíveis.

## 12.7. Treinamento e carreira

Treinar consome horário e pode contratar Educação. Experiência vem de tarefas compatíveis concluídas, com limite de ganho por período. Promoção altera responsabilidades e salário mediante aprovação. Mudança de cargo pode exigir integração e não transfere habilidades automaticamente.

## 12.8. Afastamento e desligamento

Ausência reabre tarefas não executadas e solicita substituição. Desligamento agenda transição, remove permissões, libera recursos e encerra compromissos conforme regras simplificadas do jogo. O histórico permanece nos relatórios.

---

# Parte 13 — Animações, estados visuais e direção de arte

## 13.1. Padrão artístico

Pixel art coerente, cores legíveis, sombras simples, contorno moderado e interiores claros. Célula de 32 px; personagem base de 32 × 48 px, com variações controladas. Importar sem suavização e renderizar em escala inteira sempre que possível.

Direções iniciais: norte, sul, leste e oeste. Não espelhar automaticamente uniformes com elementos assimétricos. Cabeça e corpo não mudam de tamanho entre ações.

## 13.2. Máquina de animação

Locomoção e ação têm estados separados. Ordem de controle: impedimento ou segurança → ação física em execução → deslocamento → espera → ocioso. Uma animação de conversar não pode sobrepor a pose de carregar uma caixa com as duas mãos sem variante específica.

| Estado | Quadros propostos | Taxa visual | Evento funcional |
|---|---:|---:|---|
| Parado | 4 | 4–6 fps | Nenhum |
| Caminhar | 8 por direção | 8–10 fps | Passos opcionais |
| Sentar e levantar | 4 cada | 8 fps | Ocupação do assento |
| Digitar | 6 | 6–8 fps | Progresso pela simulação |
| Conversar | 4 | 5–7 fps | Exibir fala |
| Pegar ou colocar | 6 | 8 fps | Transferência validada no marco |
| Carregar e andar | 8 por direção | 8 fps | Item ligado ao personagem |
| Escrever no quadro | 6 | 6 fps | Alteração visual do quadro |
| Limpar | 6–8 | 7 fps | Progresso de limpeza |
| Reparar ou construir | 8 | 8 fps | Marco de serviço |
| Esperar em fila | 4 | 4 fps | Paciência pela simulação |
| Usar cadeira de rodas | 8 por direção | 8 fps | Deslocamento compatível |

As taxas são referências de arte, não a frequência de atualização da economia. Em aceleração, ações podem abreviar transições visuais, mas conservam os eventos funcionais.

## 13.3. Ações por profissão

Professor escreve, aponta e acompanha; aluno anota e usa computador; recepção digita e entrega documento; estoque pega, carrega e guarda; embalagem fecha e etiqueta; motorista inspeciona e entra no veículo; vendedor apresenta; caixa registra e entrega; técnico examina e usa ferramentas; limpeza varre, passa pano e recolhe; construtor transporta, instala e pinta; gestor consulta pasta, apresenta relatório e assina decisão.

## 13.4. Sincronização com objetos

Pegar caixa: aproximar → reservar caixa e espaço → iniciar gesto → anexar caixa no marco → concluir → atualizar tarefa. Colocar caixa faz o inverso. Se a animação for interrompida antes do marco, o item permanece na origem; depois, fica com o portador até a recuperação.

Ao salvar no meio da ação, registrar fase e portador. Carregar não cria uma segunda caixa e não conclui a operação duas vezes.

## 13.5. Camadas visuais

Piso → marcas do chão → sombras → partes inferiores de objetos → pessoas e volumes ordenados pela posição dos pés → partes superiores → cobertura opcional → ícones e interface.

Objetos altos podem ficar parcialmente transparentes quando ocultam o jogador. Parede frontal recebe recorte visual; colisão continua ativa. Ícones indicam fome, espera, bloqueio, ordem recebida e problema, com opção de ocultar.

## 13.6. Variedade de personagens

Misturar tons de pele, idades adultas, formatos de corpo, cabelos lisos, ondulados, cacheados e crespos, acessórios e roupas. Incluir pessoas com deficiência com animações e rotas compatíveis. Alunos jovens usam modelos apropriados e funções de estudo; tarefas de trabalho são de personagens adultos.

Módulos de aparência: corpo, cabelo, roupa, acessório e equipamento. Uniforme identifica empresa e cargo sem eliminar individualidade. Pelo menos seis variações por grupo principal antes da versão de conteúdo ampliado.

## 13.7. Sons e feedback

Passos discretos, portas, teclado, caixa, veículos e ferramentas. Som varia por distância e limite de vozes; dezenas de computadores não devem gerar ruído acumulado excessivo. Eventos críticos possuem sinal visual e sonoro configurável.

---

# Parte 14 — Veículos, trânsito e equipamentos móveis

## 14.1. Catálogo inicial proposto

Capacidades abaixo pertencem ao balanceamento do jogo. “UC” é unidade abstrata de volume; peso e volume são validados separadamente. Dimensões são pegadas lógicas aproximadas em células.

| ID | Veículo | Pegada | Carga ou pessoas | Função e equipe |
|---|---|---|---|---|
| V01 | Bicicleta de entrega | 1 × 2 | 15 kg / 1 UC | Pequenos pedidos; entregador |
| V02 | Moto com baú | 1 × 2 | 35 kg / 2 UC | Entrega rápida; motociclista |
| V03 | Carro compacto | 2 × 3 | 4 pessoas ou 80 kg / 3 UC | Visitas e pequenas coletas |
| V04 | Picape utilitária | 2 × 4 | 600 kg / 8 UC | Ferramentas e materiais leves |
| V05 | Furgão pequeno | 2 × 4 | 700 kg / 14 UC | Distribuição local |
| V06 | Furgão grande | 2 × 5 | 1.300 kg / 24 UC | Mais volumes por rota |
| V07 | Mini caminhão baú | 2 × 5 | 2.500 kg / 40 UC | Abastecimento e entregas |
| V08 | Caminhão baú médio | 3 × 7 | 6.000 kg / 80 UC | Distribuição empresarial |
| V09 | Carreta com baú | 3 × 12 | 20.000 kg / 200 UC | Transferência de grande porte |
| V10 | Micro-ônibus | 2 × 6 | 18 passageiros | Transporte contratado |
| V11 | Ônibus escolar | 3 × 8 | 36 passageiros | Rotas educacionais |
| V12 | Van de manutenção | 2 × 4 | 600 kg / 10 UC | Peças, ferramentas e técnico |
| V13 | Caminhão de materiais | 3 × 7 | 6.000 kg / 70 UC | Abastecer obras |
| V14 | Caminhão betoneira | 3 × 7 | Serviço por etapa | Pacote de obra compatível |
| V15 | Empilhadeira | 2 × 2 | 1.500 kg por movimento | Operador; circulação interna |
| V16 | Paleteira manual | 1 × 2 | 700 kg por movimento | Movimentação no piso |

Veículos maiores são conteúdo de expansão. O mapa inicial precisa comprovar espaço de manobra antes de liberar a carreta.

## 14.2. Dados e estados

Veículo guarda proprietário, modelo, placa fictícia, condição, capacidade, carga, motorista, rota, localização, consumo e próxima manutenção.

Estados: estacionado → reservado → inspeção → carregando ou embarcando → saindo → em rota → atendendo parada → retornando → descarregando → disponível. Estados alternativos: aguardando acesso, abastecendo, em manutenção, avariado e fora de serviço.

## 14.3. Regras físicas

Rede viária separada da navegação de pessoas. Faixas e interseções usam reservas de trecho para evitar colisões. Curvas consideram comprimento do veículo; caminhos estreitos são recusados. Ré em doca ocorre apenas com trecho reservado. A primeira versão usa faixas pré-definidas, sem física livre de direção.

Pedestres têm prioridade nas travessias sinalizadas. Veículos aguardam espaço antes de entrar no mapa; nunca aparecem sobre outro veículo. Vagas e docas são recursos exclusivos.

## 14.4. Carga e passageiros

Validar simultaneamente peso, volume, compatibilidade e quantidade de assentos. Passageiros não compartilham compartimento de carga. Carregar exige equipe, ponto de acesso e pedido liberado. Uma caixa carregada pertence à carga do veículo até a confirmação de descarga.

## 14.5. Custos e aquisição

Compra, aluguel por período ou contratação externa por serviço. Custo inclui aquisição ou diária, operação, motorista e manutenção. Veículo parado continua tendo custos fixos aplicáveis, mas não consome combustível de deslocamento.

## 14.6. Arte dos veículos

Produzir cada modelo separadamente com quatro direções e vistas coerentes. Variantes: parado, rodando, portas abertas, avariado e carga quando visível. Base modular de cores permite identificar empresas. A prancha gerada nesta entrega é referência visual, não um atlas pronto para importar.

---

# Parte 15 — Tempo, calendário, economia e progressão

## 15.1. Ritmo deliberadamente lento

Velocidade padrão: **1 segundo real = 10 segundos de jogo**. Um dia completo dura 144 minutos reais; um expediente de oito horas dura 48 minutos reais. Uma semana contínua equivale a 16 horas e 48 minutos reais na velocidade normal. O jogo não exige manter a sessão aberta: o estado pode ser salvo e retomado.

Velocidades: pausa, 1×, 2× e 4×. Em 4×, um expediente de oito horas dura 12 minutos reais. O padrão permanece em 1×. O jogador pode avançar períodos ociosos por comando explícito; o jogo informa quanto tempo será avançado e interrupções relevantes fazem o avanço parar.

Não há progresso com o jogo fechado na primeira versão. Não usar o relógio do computador para concluir obras ou cobrar salários offline.

## 15.2. Relógio apresentado

Barra superior: dia da semana, data, hora, velocidade, período do dia e próximo compromisso. Obras exibem “Dia 3 de 7 — instalações previstas amanhã”. Reuniões mostram hora e local; tarefas mostram prazo absoluto e tempo restante.

Dia e noite alteram luz e fluxo. Calendário organiza jornadas, aulas, manutenção, entregas, vencimentos e eventos. A data inicial é configurável e não depende de estar sincronizada com a data real.

## 15.3. Durações internas de referência

| Atividade | Duração de jogo proposta |
|---|---|
| Atendimento simples | 3–8 minutos |
| Compra no caixa | 2–5 minutos |
| Conferência de um pequeno recebimento | 15–30 minutos |
| Separação de um pedido pequeno | 8–20 minutos |
| Aula | 50–90 minutos |
| Reunião de gestão | 30–60 minutos |
| Diagnóstico técnico | 20–60 minutos |
| Limpeza de uma sala comum | 10–25 minutos |
| Montagem de móvel | 30–120 minutos |
| Obra de sala ou edifício | 7 dias planejados |

Deslocamento é somado ao serviço. Durações variam por tamanho, habilidade e recursos; a interface mostra a estimativa antes de contratar ou agendar.

## 15.4. Caixa e resultado

Manter caixa, contas a receber, contas a pagar, estoque, ativos, dívidas e resultado por competência simplificada. Painéis apresentam caixa disponível agora e projeção dos próximos 7 e 30 dias.

Receita prevista não é dinheiro disponível. Empréstimo aumenta caixa e dívida, não lucro. Transferência interna não aumenta lucro consolidado. Depósito caução de aluguel fica separado do valor disponível para operação conforme regra contratual.

## 15.5. Frequências de cobrança

Vendas: no pagamento. Entregas: por confirmação ou fechamento contratado. Mensalidades: vencimento por contrato. Aluguéis: mensais. Salários: provisionados diariamente e pagos na data definida. Energia e água: acumuladas por uso e faturadas no ciclo. Nenhuma cobrança mensal se repete a cada dia por erro de relógio.

## 15.6. Demanda e preços

Demanda depende de público do entorno, preço relativo, reputação, disponibilidade e divulgação. A população potencial é finita por período. Promoções deslocam demanda e margem; não criam compradores ilimitados.

Parâmetros iniciais de cenário: capital de 200.000 créditos fictícios; uma operação pequena consome até 60% em implantação; preservar projeção de três meses de custos essenciais como orientação do tutorial. O balanceamento final exige simulações, especialmente por causa das obras longas.

## 15.7. Reputação e progressão

Reputação por empresa e do complexo, atualizada pelo histórico de experiências externas. Uma falha reduz confiança de forma proporcional; várias boas operações recuperam gradualmente.

Marcos: primeira empresa aberta, primeiro contrato cumprido, primeiro locatário, primeira reunião com decisões executadas, dois lotes sustentáveis e quatro lotes coordenados. O modo livre permite ignorar objetivos sem bloquear sistemas básicos.

---

# Parte 16 — Interface centrada no mapa e ações

## 16.1. Princípio

O mapa permanece como área principal. Painéis laterais ocupam no máximo cerca de um terço da largura em desktop e podem ser recolhidos. Janelas amplas são reservadas a construção detalhada e relatórios selecionados.

## 16.2. Distribuição

- Topo: caixa, data, hora, velocidade, alertas e próximo compromisso.
- Lateral esquerda: lotes, construção, equipe, contratos, solicitações e finanças.
- Lateral direita: contexto da seleção, ações e histórico breve.
- Rodapé: personagem, tarefa selecionada e atalhos.
- Minimap opcional: acesso rápido e ícones de ocorrências.

## 16.3. Ações contextuais

| Seleção | Ações principais |
|---|---|
| Sala | Inspecionar, organizar, equipar, reservar, reformar, abrir ou fechar |
| Funcionário | Conversar, atribuir, priorizar, treinar, jornada e contrato |
| Gestor | Reunir, solicitar resumo, definir autonomia e avaliar propostas |
| Cliente | Ver necessidade, atender e consultar ocorrência |
| Objeto | Usar, mover, reparar, substituir e vender |
| Veículo | Reservar, carregar, enviar, inspecionar e manter |
| Obra | Ver cronograma, materiais, equipe, bloqueios e aditivos |
| Lote | Operação, unidades, locação, infraestrutura e resultado |

## 16.4. Camadas de leitura

Ocupação, filas, acessos, energia, internet, limpeza, ruído, manutenção, estoque, tarefas e apresentação. Uma camada por vez evita poluição. Problemas possuem ícone e rótulo, sem depender apenas de cor.

## 16.5. Alertas acionáveis

Exemplo: “Laboratório parado: computador de rede indisponível. 8 alunos afetados. Ações: chamar técnico, trocar sala, adiar.” Clicar centraliza o mapa e seleciona o elemento. Alertas iguais são agrupados; não repetir notificações a cada atualização.

## 16.6. Controles e acessibilidade

Teclado ou clique para caminhar, arraste para câmera, roda para zoom, espaço para pausa e tecla de interação configurável. Evitar ação destrutiva no mesmo clique de seleção. Escalas de interface, tamanho de texto, contraste, redução de movimento e remapeamento de teclas.

Projeto inicial para desktop, com adaptação futura a toque. A documentação não pressupõe que todos os painéis complexos já sejam adequados a celular.

---

# Parte 17 — Eventos, ocorrências e consequências

## 17.1. Catálogo

| Evento | Gatilho | Escolhas | Consequência rastreável |
|---|---|---|---|
| Professor ausente | Falta registrada | Substituir ou repor | Agenda e satisfação |
| Curso procurado | Demanda acumulada | Abrir turma ou lista de espera | Receita e capacidade |
| Laboratório indisponível | Falha de infraestrutura | Reparar, remanejar ou adiar | Chamado e atraso |
| Recebimento divergente | Conferência | Aceite parcial ou recusa | Estoque e fornecedor |
| Veículo avariado | Uso e condição | Reparar, alugar ou reagendar | Custos e prazo |
| Pico de pedidos | Contrato ou campanha | Aceitar parcialmente ou ampliar | Fila e margem |
| Produto em falta | Demanda supera reposição | Comprar, substituir ou perder venda | Conversão e estoque |
| Cliente especial | Reputação e oportunidade | Negociar encomenda | Contrato estruturado |
| Troca de produto | Pós-venda | Inspecionar e aplicar política | Estoque e caixa |
| Mudança de escopo | Cliente de projeto | Aditivo ou recusa | Prazo e preço |
| Equipamento quebra | Condição e uso | Reparo ou substituição | Disponibilidade |
| Locatário pede expansão | Ocupação e satisfação | Ofertar sala ou negociar | Locação e obra |
| Renovação de aluguel | Prazo contratual | Renovar ou encerrar | Receita futura |
| Atraso de material | Fornecedor | Esperar ou buscar alternativa | Cronograma da obra |
| Equipe sobrecarregada | Carga prolongada | Contratar, treinar ou reduzir demanda | Satisfação e capacidade |
| Solicitação de treinamento | Habilidade necessária | Aprovar ou adiar | Agenda e evolução |
| Queda de internet | Infraestrutura | Suporte ou contingência | Serviços dependentes |
| Acúmulo de resíduos | Coleta insuficiente | Contratar coleta ou reorganizar | Limpeza e satisfação |
| Reunião perdida | Participante ausente | Remarcar ou ler resumo | Agenda e pendências |
| Falta de caixa projetada | Projeção negativa | Reduzir, negociar ou financiar | Compromissos e dívida |

## 17.2. Regras de geração

Eventos operacionais derivam do estado real do mundo. Oportunidades usam sorteio ponderado pela reputação e capacidade. Uma mesma falha não gera infinitos eventos independentes: reusa a ocorrência até a resolução.

Eventos têm intervalo mínimo por categoria, teto de crises simultâneas e proteção inicial do tutorial. Consequências graves precisam de sinais prévios, salvo cenários especiais explicitamente escolhidos.

## 17.3. Registro e resolução

Toda ocorrência registra causa, local, pessoas afetadas, estado, responsável, custo e resolução. Encerrar exige verificar a condição resolvida, não apenas fechar a janela. Reincidência relaciona o novo caso ao anterior.

---

# Parte 18 — Dados, salvamento e recuperação

## 18.1. Entidades principais

| Entidade | Campos essenciais |
|---|---|
| World | ID, seed, versão, relógio e calendário |
| Lot | Limites, proprietário, acessos e infraestrutura |
| Building | Geometria, conexão, condição e estado |
| Business | Dono, unidades, caixa, políticas e reputação |
| Room | Tipo, grade, objetos, capacidade e agenda |
| Object | Tipo, posição, direção, condição e interações |
| NPC | Perfil, aparência, atributos, posição e agenda |
| Employment | Empresa, cargo, salário, jornada e permissões |
| Task | Estado, progresso, responsável, alvos e dependências |
| Reservation | Recurso, titular, prazo e motivo |
| ItemBatch | Produto, dono, quantidade, condição e localização |
| Order | Linhas, reservas, preço, prazo e estado |
| Vehicle | Modelo, condição, carga, motorista e rota |
| Route | Paradas, trajetos, previsão e confirmação |
| Contract | Partes, escopo, valores, vencimentos e regras |
| Construction | Pacote, marcos, materiais, equipe e previsão |
| Meeting | Agenda, participantes, relatório e decisões |
| LedgerEntry | Lançamentos vinculados e data |
| Incident | Causa, impacto, ação e encerramento |
| DialogueMemory | Fatos autorizados, resumo e últimas interações |

## 18.2. Regras de identidade

IDs únicos e estáveis. Referências usam ID, nunca nome exibido. Dinheiro em inteiros da menor unidade monetária. Quantidades fracionárias usam precisão definida por categoria. Horários usam segundos de jogo desde o início, com conversão para calendário.

## 18.3. Exemplo resumido

```json
{
  "schema_version": 2,
  "game_version": "prototype-0.1",
  "world_id": "world_001",
  "seed": 10422,
  "clock": {"game_seconds": 289200, "speed": 1, "paused": false},
  "player": {"npc_id": "npc_player", "selected_lot_id": "lot_education"},
  "businesses": [{"id": "biz_01", "lot_id": "lot_education", "cash_minor": 12000000}],
  "construction_projects": [{
    "id": "build_01",
    "package_type": "room",
    "planned_duration_seconds": 604800,
    "status": "in_progress",
    "current_milestone": "walls",
    "blocked_reason": null
  }],
  "tasks": [],
  "reservations": [],
  "ledger": [],
  "scheduled_events": []
}
```

Exemplo ilustrativo, não esquema completo de produção. Coleções restantes precisam ser serializadas pelo sistema correspondente.

## 18.4. Política de salvamento

Salvamento manual a qualquer momento seguro, automático a cada cinco minutos reais e antes de decisões de grande impacto. Manter três autosaves rotativos, último save válido e cópia anterior ao migrar versões.

Escrever primeiro em arquivo temporário, validar integridade e só então substituir o save atual. Usar checksum para detectar corrupção; checksum não substitui autorização nem proteção criptográfica.

## 18.5. Consistência e recuperação

Capturar o mundo num limite de atualização, sem metade de uma venda ou transferência. Guardar estado do gerador aleatório, filas de eventos, ações em andamento, proprietários das cargas e reservas.

Ao carregar: validar versão → migrar cópia → reconstruir índices e navegação → verificar referências → liberar reservas órfãs → restaurar tarefas → retomar relógio. Não executar novamente lançamentos já registrados.

Se uma referência de objeto não essencial faltar, gerar recuperação explícita. Falha estrutural exige oferecer o último save válido, sem sobrescrever o arquivo problemático.

## 18.6. IA e salvamento

Salvar diálogo concluído e proposta validada. Não salvar credenciais. Requisição pendente é cancelada no encerramento; ao carregar, o evento volta ao modo de resposta local ou pode ser retomado por nova solicitação com identificador distinto.

---

# Parte 19 — Arquitetura da simulação e contratos de sistemas

## 19.1. Organização independente da ferramenta

Separar simulação, apresentação e interface. A escolha de engine permanece aberta; todas as regras anteriores devem ser implementáveis sem depender de imagens geradas ou de um serviço de IA.

Módulos: relógio, mapa, construção, infraestrutura, pessoas, navegação, tarefas, empresas, educação, estoque, vendas, logística, projetos, contratos, finanças, comunicação, eventos, IA, interface e persistência.

## 19.2. Frequência proposta

Renderização na taxa suportada pelo dispositivo. Simulação em passo fixo de 0,1 segundo real; em 1×, cada passo avança um segundo de jogo. Eventos de calendário são processados quando o relógio cruza seu instante. Ao acelerar, usar subpassos ou processamento de eventos equivalente, sem pular vencimentos.

Navegação e redistribuição de tarefas são atualizadas por evento e em lotes. Avaliações pesadas de indicadores são periódicas; estoque e pagamentos mudam no momento exato da transação.

## 19.3. Ordem de atualização

Aplicar comandos validados → avançar relógio → disparar eventos de agenda → atualizar disponibilidades → reservar tarefas e recursos → mover agentes → processar marcos de ações → registrar transações → atualizar ocorrências e indicadores → produzir estado visual.

## 19.4. Eventos internos

Exemplos: RoomReady, ConstructionBlocked, EmployeeShiftStarted, TaskCompleted, StockReserved, SaleConfirmed, ShipmentDelivered, MeetingStarted, ProposalApproved e PaymentPosted.

Cada evento relevante tem ID, origem e instante. Consumidores devem ser idempotentes: receber duas vezes SaleConfirmed não registra duas vendas.

## 19.5. Invariantes

- Quantidade física e reservas nunca ficam negativas.
- Um recurso exclusivo tem no máximo um titular ativo.
- Dinheiro só muda por lançamento identificado.
- Capacidade de sala e veículo não é excedida silenciosamente.
- Pessoa não trabalha em dois locais simultaneamente.
- Uma tarefa concluída não consome materiais novamente ao carregar.
- IA não escreve diretamente no estado do mundo.
- Alteração de geometria invalida caminhos afetados.
- Empresas alugadas respeitam limites de controle do proprietário.

## 19.6. Estrutura sugerida do projeto

| Pasta | Conteúdo |
|---|---|
| docs/ | Documento mestre, decisões e critérios |
| data/catalogs/ | Salas, objetos, cargos, cursos e veículos |
| data/scenarios/ | Mapa inicial e parâmetros de campanha |
| simulation/core/ | Relógio, eventos, IDs e reservas |
| simulation/systems/ | Sistemas de negócio |
| presentation/ | Câmera, animações e feedback |
| ui/ | Painéis e ações contextuais |
| assets/concepts/ | Referências visuais aprovadas |
| assets/sprites/ | Sprites e atlas finais |
| assets/audio/ | Sons e música |
| saves/ | Salvamentos de desenvolvimento |
| tests/ | Testes de regras e cenários |

Catálogos devem permitir balanceamento por dados, sem alterar código para mudar cada preço ou duração.

---

# Parte 20 — Plano de montagem por etapas e critérios de aceite

Cada etapa termina com uma versão jogável e verificável. Não há cronograma real prometido; estimar esforço somente após escolher ferramenta e equipe.

| Etapa | Montagem | Depende de | Aceite obrigatório |
|---|---|---|---|
| 00 | Estrutura de projeto e catálogos | Documento aprovado | Carregar cenário mínimo e parâmetros |
| 01 | Mapa, câmera, seleção e personagem | 00 | Caminhar, aproximar e inspecionar sem atravessar paredes |
| 02 | Relógio e calendário lento | 01 | Pausa e velocidades preservam eventos e duração |
| 03 | Grade, salas, portas e objetos | 01 | Colisão, rotação e validação de acesso |
| 04 | Pessoas, filas e navegação | 03 | Pessoas chegam, esperam, usam e saem sem sobreposição persistente |
| 05 | Tarefas, recursos e jornadas | 02, 04 | Sem dupla reserva; pausas e substituição funcionam |
| 06 | Obras de sete dias | 03, 05 | Materiais chegam, marcos avançam e bloqueios atrasam entrega |
| 07 | Estoque e finanças | 05 | Reservas, compras e lançamentos consistentes |
| 08 | Comércio completo inicial | 07 | Receber, expor, atender, vender e fechar caixa |
| 09 | Administração e reuniões | 05, 07 | Gestor caminha, entrega relatório e decisões criam tarefas |
| 10 | Educação | 09 | Matrícula, agenda, aula, ausência e cobrança |
| 11 | Frota e logística | 07 | Carregar, rotear, entregar e devolver sem duplicação |
| 12 | Escritórios e manutenção | 09 | Projetos, chamados, revisão e aceite |
| 13 | Locação e autonomia | 09, 12 | Empresa independente ocupa, paga e solicita melhorias |
| 14 | Serviços entre lotes | 10–13 | Pedido completo entre empresas com contabilidade consolidada |
| 15 | IA contextual opcional | 09, 14 | Proposta validada e fallback sem conexão |
| 16 | Arte e animações ampliadas | Vertical inicial funcional | Todas as ações essenciais têm leitura visual |
| 17 | Eventos e balanceamento | Sistemas completos | Crises têm causa, resposta e recuperação |
| 18 | Persistência e carga final | Implementada desde 02, ampliada em cada etapa | Salvar e carregar qualquer operação sem corrupção |
| 19 | Acabamento e experiência | 17, 18 | Tutorial, acessibilidade e metas de desempenho verificadas |

## 20.1. Primeira fatia jogável

Um lote comercial pequeno, recepção opcional, estoque, caixa, banheiro e apoio; três funcionários; dez clientes; um fornecedor; uma van externa; uma obra visível; finanças; relógio e save.

O jogador consegue abrir a empresa, atender, lucrar ou perder dinheiro por causas observáveis, corrigir um problema e retomar o mesmo estado após carregar.

## 20.2. Montagem de conteúdo por lote

1. Delimitar área e acessos.
2. Colocar infraestrutura mínima.
3. Criar salas e posições de interação.
4. Associar objetos obrigatórios e opcionais.
5. Criar cargos e jornadas.
6. Inserir fluxo operacional mínimo.
7. Adicionar contratos e dinheiro.
8. Exibir quadros e indicadores.
9. Adicionar falhas e recuperação.
10. Ampliar arte e variações somente após o fluxo funcionar.

## 20.3. Testes essenciais

Regras unitárias: estoque, reservas, dinheiro, capacidade, agenda e duração. Integração: venda completa, aula cancelada, entrega devolvida, obra bloqueada, locação e reunião. Persistência: salvar durante transporte, pagamento, reunião e montagem. Teste de carga: público, tarefas, veículos e mudança simultânea de geometria.

Critério de desempenho inicial: pelo menos 30 fps no dispositivo de referência a definir, com a carga declarada. Registrar tempo de atualização da simulação e picos; só ampliar o mapa depois de medir.

## 20.4. Itens de expansão

Novos terrenos fora dos quatro lotes, múltiplos andares, tráfego urbano livre, multiplayer, frota controlável manualmente, clima complexo e progresso offline. Não são pré-requisitos para a campanha base.

---

# Parte 21 — Catálogo visual, personagens e prompts

## 21.1. Imagens desta entrega

Quatro pranchas conceituais são geradas separadamente e apresentadas na conversa:

1. Visão geral dos quatro lotes, acessos e obra.
2. Personagens variados por função.
3. Ambientes internos de Educação, Logística, Comércio e Escritórios.
4. Frota e equipamentos de obra e movimentação.

São referências de direção artística. Não são sprites recortados nem animações prontas. Este MD é autossuficiente em regras; as pranchas são entregues como imagens separadas e não dependem de caminhos locais temporários dentro do documento.

## 21.2. Personagens nomeados para a primeira produção

| ID | Nome fictício | Função | Aparência e identificação |
|---|---|---|---|
| P01 | Alex | Administrador personalizável | Roupa casual profissional; visual editável |
| P02 | Helena | Diretora educacional | Mulher negra, cabelo crespo curto, pasta |
| P03 | Roberto | Professor | Homem mais velho, cabelos grisalhos, óculos |
| P04 | Camila | Instrutora digital | Mulher parda, cabelo cacheado, roupa azul |
| P05 | Davi | Aluno adulto | Homem negro, mochila e camiseta verde |
| P06 | Luiza | Aluna adulta | Mulher branca, cabelo curto, caderno |
| P07 | Márcia | Secretária | Mulher de meia-idade, crachá e uniforme |
| P08 | André | Monitor | Homem pardo, cabelo ondulado, prancheta |
| P09 | Sandra | Supervisora logística | Mulher negra, colete e rádio |
| P10 | Paulo | Conferente | Homem branco, barba, leitor de mão |
| P11 | Aline | Estoquista | Mulher parda, coque e luvas |
| P12 | Miguel | Separador | Homem negro, uniforme e carrinho |
| P13 | Joana | Motorista | Mulher de meia-idade, boné e chave |
| P14 | Sérgio | Operador de empilhadeira | Homem pardo, colete e capacete |
| P15 | Renata | Gerente comercial | Mulher branca, cabelo ruivo, tablet |
| P16 | Bruno | Vendedor | Homem negro, camisa da loja |
| P17 | Patrícia | Caixa | Mulher parda, cabelo trançado e crachá |
| P18 | Thiago | Técnico de assistência | Homem branco, cabelo longo preso, ferramentas |
| P19 | Beatriz | Gestora de projetos | Mulher negra, óculos e notebook |
| P20 | Felipe | Designer | Homem pardo, roupa casual e fone |
| P21 | Elisa | Desenvolvedora | Mulher branca, cadeira de rodas e roupa violeta |
| P22 | Marcos | Técnico de manutenção | Homem mais velho, uniforme cinza e maleta |
| P23 | Rosa | Limpeza | Mulher negra, uniforme e carrinho |
| P24 | Antônio | Encarregado de obra | Homem pardo, capacete e planta |

Nomes e aparência são exemplos fictícios. As pranchas mostram diversidade e funções, sem obrigar correspondência exata de cada pixel a estes nomes. A produção final precisa associar cada sprite ao seu ID.

## 21.3. Pacotes de arte a produzir

| Pacote | Conteúdo | Entrega de produção |
|---|---|---|
| A — Terreno | Grama, ruas, calçadas, jardins e cercas | Tiles contínuos e variações |
| B — Construção | Paredes, pisos, portas, janelas e obra | Tiles e estágios de sete dias |
| C — Educação | Mesas, quadros, biblioteca e informática | Objetos com estados de uso |
| D — Logística | Docas, estantes, caixas e embalagem | Objetos e volumes transportáveis |
| E — Comércio | Expositores, vitrines, caixas e estoque | Estados vazio, cheio e uso |
| F — Escritórios | Estações, reunião, suporte e oficina | Objetos em funcionamento |
| G — Pessoas | Personagens e uniformes | Direções e ações por função |
| H — Frota | V01 a V16 | Cada veículo separado e orientações |
| I — Interface | Ícones, alertas e botões | Arquivos consistentes de interface |

## 21.4. Convenção de nomes

Personagem: `npc_<id>_<acao>_<direcao>_<quadro>.png`.

Objeto: `obj_<tipo>_<estado>_<direcao>.png`.

Veículo: `veh_<id>_<estado>_<direcao>.png`.

Cada atlas de produção acompanha metadados de dimensões, pivô, colisão e pontos de interação. Imagens conceituais não devem ser importadas como atlas sem recorte e conferência.

## 21.5. Prompts das pranchas

Método: geração de imagens integrada, sem CLI externa. Prompts de direção artística usados nesta entrega:

### Prancha 1 — Complexo

“Wide detailed concept art of a Brazilian business management video game, crisp pixel art, orthographic top down with visible front faces like classic top-down RPG, NOT isometric. Four roofless lots on one map: education classrooms and computer lab top left, logistics warehouse loading docks top right, retail stores bottom left, coworking offices meeting rooms bottom right. Trees paths parking street crosswalks. Diverse tiny NPCs visibly working. One fenced construction site with builders and materials. Coherent scale, attractive readable floorplans, bright restrained palette. No text, no interface, no logos. Landscape image.”

### Prancha 2 — Pessoas

“Character design reference sheet for same top down pixel art Brazilian business management game. 24 distinct full body pixel characters on clean warm light background in evenly spaced 6 by 4 grid. Each clearly separated. Varied men and women, young adults middle aged seniors, light brown dark skin, different hair textures, glasses, one wheelchair user. Roles visually distinct: administrator, teacher, student, receptionist, warehouse worker with box, driver, cashier, cleaner, construction worker hardhat, technician tools, security, manager and office professionals. Consistent 32x48 pixel inspired proportions enlarged with crisp nearest neighbor pixels, top down RPG three quarter frontal, NOT isometric, no portraits no text no labels. Each character unique outfit and silhouette.”

### Prancha 3 — Interiores

“Four panel detailed environment concept sheet, crisp pixel art top down RPG business game, non-isometric roofless interiors. Upper left educational center classroom computer lab reception. Upper right logistics receiving warehouse shelves packing and dispatch. Lower left retail shop display shelves checkout customer service stockroom. Lower right offices coworking meeting room technical repair workshop. Clear doors navigable corridors wheelchair access furniture consistent scale. Diverse characters performing jobs in all four scenes. Thin neutral panel gutters, no labels no text no UI. Beautiful practical rooms no roofs.”

### Prancha 4 — Veículos

“Pixel art top down RPG game asset reference sheet on warm light neutral background, crisp hard pixel edges, NOT isometric. Neat separated grid of 16 different vehicles and equipment, coherent art style and relative believable scale: delivery bicycle, delivery motorbike, compact business car, pickup, small cargo van, large cargo van, mini box truck, medium box truck, semi truck trailer, school minibus, school bus, maintenance utility van with ladder, flatbed building materials truck, concrete mixer truck, forklift, manual pallet jack. All vehicles full and separated, same three-quarter top down north facing orientation, no people no text no logos no brand names. Small supporting crates cones and pallets beside last row. Designed as attractive game concept catalogue, not technical sprite atlas.”

## 21.6. Prompt para cada personagem separadamente

Substituir apenas os campos entre colchetes:

> Crie uma prancha de referência de um único personagem para o jogo Quatro Lotes. Pixel art nítida, visão superior de RPG 2D, sem projeção isométrica. Personagem [ID, nome, aparência e cargo]. Mantenha exatamente a mesma identidade, roupas, proporções e acessórios em todas as poses. Mostre quatro orientações: frente, costas, esquerda e direita, bem separadas. Inclua três poses de função: [ações da profissão]. Fundo neutro, sem cenário, sem textos, sem logotipos. Proporção visual compatível com personagem-base de 32 × 48 pixels ampliado sem suavização. Esta imagem é referência para produção de sprites, não um atlas técnico final.

## 21.7. Prompt para cada veículo separadamente

> Crie uma prancha de referência do veículo [ID e modelo] para jogo de gestão em pixel art 2D. Visão superior de RPG, sem isometria, proporções coerentes e pixels nítidos. Mostre o mesmo veículo em quatro orientações, cada uma separada e completa. Acrescente uma vista com portas de carga abertas quando aplicável. Sem marcas, letras, pessoas ou cenário. Fundo neutro. Preserve cor, carroceria, rodas e escala entre vistas. Respeite o uso [função]. Referência artística para posterior recorte e animação.

## 21.8. Google Flow — cenas de referência por parte

Vídeos servem como referência de movimento e apresentação; não substituem sprites e lógica.

**A — Visão geral:** câmera fixa em visão superior de jogo pixel art 2D, quatro lotes sem teto, pessoas trabalhando, veículos em vias próprias, árvore e praça. Sem zoom, cortes, texto ou transformação de arquitetura. Manter posições dos objetos e proporções.

**B — Educação:** professor entra pela porta, caminha até o quadro, alunos entram e ocupam lugares, aula começa. Nenhum personagem atravessa mesa ou parede. Câmera fixa, pixel art, objetos estáveis.

**C — Logística:** conferente recebe caixa, estoquista leva ao endereço, separador coleta outra caixa, embalador fecha pedido e motorista carrega van. Mostrar etapas claras sem fazer a mesma caixa aparecer em dois lugares.

**D — Comércio:** cliente entra, examina prateleira, vendedor atende, cliente segue ao caixa e sai com sacola. Caixa e fila permanecem no mesmo lugar, sem personagens surgindo ou desaparecendo.

**E — Escritórios:** equipe trabalha, gestor pega pasta, caminha até sala de reunião, senta e apresenta relatório ao administrador. Outras pessoas continuam suas tarefas. Arquitetura estável e câmera fixa.

**F — Obra:** sequência conceitual de sete fases no mesmo enquadramento: isolamento, base, paredes, instalações, acabamento, montagem e vistoria. Mostrar trabalhadores, entregas e materiais. Usar transições temporais claras; não apresentar como construção instantânea do jogo.

---

# Parte 22 — Cenário completo de funcionamento e lista de validação

## 22.1. Exemplo de um dia

07h00: equipe de limpeza chega; obras iniciam a jornada. 07h30: gestores conferem pendências e materiais. 08h00: lojas e escritórios abrem; secretaria recebe matrículas. 08h30: uma turma entra em aula. 09h00: caminhão externo descarrega materiais da obra. 10h00: Comércio solicita uma entrega à Logística. 10h30: pedido aprovado, separado e reservado para a van. 11h00: técnico dos Escritórios atende o laboratório de Educação. 12h00: pausas escalonadas. 14h00: gerente apresenta relatório presencial ao jogador. 14h45: decisão de contratação gera vaga; aprovação de compra reserva caixa. 16h00: van retorna e entrega comprovantes. 18h00: parte das empresas encerra; cursos noturnos continuam conforme agenda. 22h00: fechamento das operações, limpeza, conciliação e resumo do dia.

O horário é exemplo de cenário. Cada negócio pode ter jornada própria. Custo e disponibilidade acompanham as jornadas efetivas.

## 22.2. Checklist funcional para implementação

- [ ] Os quatro lotes e áreas comuns possuem acessos válidos.
- [ ] Salas mostram requisitos faltantes e capacidade real.
- [ ] Obras duram sete dias planejados, com equipe, materiais e marcos visíveis.
- [ ] Bloqueios atrasam a previsão com causa identificável.
- [ ] Funcionários trabalham, pausam, retornam e deixam o turno.
- [ ] Pessoas não ocupam o mesmo posto nem atravessam paredes.
- [ ] Mercadoria muda de localização sem duplicação.
- [ ] Veículos respeitam capacidade, doca, jornada e rota.
- [ ] Empresas solicitam e entregam serviços entre si.
- [ ] Gestores levam resumos às reuniões e decisões geram registros.
- [ ] Locatários preservam autonomia de operação.
- [ ] Relógio lento, calendário e vencimentos permanecem coerentes.
- [ ] Caixa e resultado estão separados e consolidados corretamente.
- [ ] IA só produz propostas validadas e tem alternativa local.
- [ ] O mapa permanece visível durante ações frequentes.
- [ ] Salvar e carregar preserva operações em andamento.
- [ ] Todos os indicadores mostram período e causa dos problemas.
- [ ] Personagens e veículos possuem leitura visual e diversidade.

## 22.3. Próxima montagem concreta

Implementar primeiro a fatia comercial descrita na Parte 20, preservando desde o início relógio, tarefas, reservas e salvamento. Depois reutilizar esses sistemas nos outros três lotes. As imagens orientam a aparência; os critérios de aceite definem quando cada parte está pronta.

---

**Fim da versão 0.2.** Melhorias futuras devem registrar a versão alterada, a regra anterior e o comportamento final, mantendo este documento como referência única das decisões do projeto.
