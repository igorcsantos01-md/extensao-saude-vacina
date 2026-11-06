export interface AxisItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  hours: string;
}

export interface CertificateData {
  number: string;
  book: string;
  sheet: string;
  code: string;
  controlKey: string;
  sha256: string;
  recipientName: string;
  recipientRole: string;
  recipientCpf: string;
  recipientInstitution: string;
  title: string;
  modality: string;
  editalItem: string;
  period: string;
  issueDate: string;
  cityState: string;
  workloadHours: string;
  workloadNumeric: string;
  frontBodyParagraph1: string;
  frontBodyParagraph2: string;
  axes: AxisItem[];
}

export const CERTIFICATE_06_DATA: CertificateData = {
  number: '06',
  book: '02/2024',
  sheet: '34',
  code: 'EMS-EXT-2024-1106',
  controlKey: '1106-8492-3710-9C4A',
  sha256: '9c4a8f12e6b05d4918e3a7c62f5091b4e8d2c7a5f3019e6b4d280c3a70241106',
  recipientName: 'LUCAS GONÇALVES SILVEIRA',
  recipientRole: 'Médico',
  recipientCpf: '702.794.941-57',
  recipientInstitution: 'Centro Universitário de Anápolis (UNIFAN)',
  title:
    'Campanha Educativa Digital contra Arboviroses: Quiz Populacional sobre Prevenção da Dengue e Conscientização sobre a Vacina no SUS',
  modality: 'Campanha Educativa, de Vacinação e Coleta de Dados Populacionais',
  editalItem:
    'Item 08 – Atividades de Extensão: Campanhas educativas, de vacinação, coleta de dados populacionais e atividades comunitárias',
  period: '08 a 09 de novembro de 2024',
  issueDate: '14 de novembro de 2024',
  cityState: 'Goiânia - GO',
  workloadHours: '08 (oito) horas',
  workloadNumeric: '08h',
  frontBodyParagraph1:
    'participou de forma efetiva da Atividade de Extensão intitulada “Campanha Educativa Digital contra Arboviroses: Quiz Populacional sobre Prevenção da Dengue e Conscientização sobre a Vacina no SUS”, desenvolvida na modalidade de Campanha Educativa, de Vacinação e Coleta de Dados Populacionais, realizada no período de 08 a 09 de novembro de 2024, contabilizando carga horária total de 08 (oito) horas.',
  frontBodyParagraph2:
    'No âmbito desta ação extensionista, o profissional atuou na elaboração e distribuição comunitária de materiais educativos (folheto digital de sinais de alarme e guias preventivos), aplicação de instrumentos digitais interativos para coleta de dados populacionais sobre medidas de controle vetorial, comunicação científica para combate à desinformação (fake news) sobre imunobiológicos e divulgação dos canais oficiais de saúde pública (SUS) e grupos prioritários da vacina contra a Dengue.',
  axes: [
    {
      id: 'Eixo I',
      title: 'Eixo I — Curadoria Científica e Produção Editorial Preventiva',
      subtitle: 'Produção Editorial em Vigilância Epidemiológica e Arboviroses',
      description:
        'Revisão de diretrizes do Ministério da Saúde e elaboração didática do Folheto Digital de Sinais de Alarme na Dengue, manejo de hidratação oral precoce e alerta contra automedicação com salicilatos (AAS) e anti-inflamatórios não esteroidais.',
      hours: '02h 00min',
    },
    {
      id: 'Eixo II',
      title: 'Eixo II — Quiz Populacional Interativo e Coleta de Dados Populacionais',
      subtitle: 'Educação Comunitária Digital e Levantamento Epidemiológico de Letramento',
      description:
        'Estruturação e aplicação de Quiz Educativo Interativo aberto à comunidade para coleta de dados populacionais sobre práticas de eliminação de criadouros do Aedes aegypti, reconhecimento de sintomas febris e percepção de risco domiciliar.',
      hours: '02h 00min',
    },
    {
      id: 'Eixo III',
      title: 'Eixo III — Conscientização sobre Vacinação no SUS e Combate a Fake News',
      subtitle: 'Infodemiologia e Educação Vacinal Baseada em Evidências',
      description:
        'Comunicação científica ativa para desmistificação de notícias falsas sobre a vacina tetravalente atenuada (QDenga/TAK-003) e orientação técnica sobre o esquema de duas doses (intervalo de 90 dias) e contraindicações oficiais do PNI.',
      hours: '02h 00min',
    },
    {
      id: 'Eixo IV',
      title: 'Eixo IV — Ação Comunitária e Divulgação dos Canais Oficiais do SUS',
      subtitle: 'Cidadania em Saúde, Grupos Prioritários e Rede de Atenção Primária',
      description:
        'Orientação comunitária sobre os grupos prioritários da vacinação contra a Dengue no SUS (crianças e adolescentes de 10 a 14 anos), busca de salas de vacina na Atenção Primária (UBS) e acesso à caderneta virtual pelo aplicativo Meu SUS Digital.',
      hours: '02h 00min',
    },
  ],
};

export interface QuizQuestion {
  id: number;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  optionDistribution: number[];
  explanation: string;
  epidemiologicalInsight: string;
}

export const POPULATION_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    category: 'Controle Vetorial e Ciclo do Aedes aegypti',
    question:
      'Quanto tempo por semana é suficiente na vistoria de calhas, pratinhos de plantas, ralos e reservatórios domésticos para interromper o ciclo de reprodução do mosquito Aedes aegypti (que dura de 7 a 10 dias do ovo ao mosquito alado)?',
    options: [
      'Apenas 10 minutos por semana, realizando escovação mecânica das bordas dos recipientes para remover ovos aderidos.',
      'Uma vez por mês, aplicando cloro apenas na água sem necessidade de escovar as paredes internas do vaso.',
      'Somente nos dias de chuva forte, pois os ovos do mosquito sobrevivem apenas 24 horas em superfícies secas.',
      'Não é necessário vistoriar o interior das residências, pois o vetor só deposita ovos em lagoas e córregos.',
    ],
    correctIndex: 0,
    optionDistribution: [58, 27, 11, 4],
    explanation:
      'A diretriz "10 Minutos Contra a Dengue" (Fiocruz / Ministério da Saúde) baseia-se na biologia do vetor: como o ciclo do ovo à fase adulta leva de 7 a 10 dias, uma vistoria semanal acompanhada de escovação mecânica das paredes internas dos recipientes (onde os ovos resistem por até 450 dias à dessecação) bloqueia a emergência de novos mosquitos.',
    epidemiologicalInsight:
      'Na coleta de dados populacionais da campanha (Nov/2024, n = 1.428), 41,8% dos respondentes desconheciam que apenas descartar a água sem escovar as bordas mantém os ovos viáveis.',
  },
  {
    id: 2,
    category: 'Sinais de Alarme e Janela Crítica da Dengue',
    question:
      'Na evolução clínica da Dengue, os chamados "Sinais de Alarme" — que indicam extravasamento plasmático e risco de evolução para Dengue Grave (choque hipovolêmico) — costumam surgir em qual momento e incluem quais manifestações?',
    options: [
      'Exclusivamente no 1º dia de febre alta, caracterizados por espirros, coriza hialina e tosse produtiva.',
      'Na defervescência (quando a febre começa a ceder, entre o 3º e o 7º dia), incluindo dor abdominal intensa e contínua, vômitos persistentes, tontura postural e sangramento de mucosas.',
      'Apenas 30 dias após o término dos sintomas, manifestando-se por descamação indolor nas palmas das mãos.',
      'Somente quando a temperatura axilar ultrapassa 40,5°C nas primeiras 12 horas de sintomas.',
    ],
    correctIndex: 1,
    optionDistribution: [19, 64, 6, 11],
    explanation:
      'Segundo o Manual de Diagnóstico e Manejo Clínico da Dengue (Ministério da Saúde), a fase crítica inicia-se no defervescer da febre (entre o 3º e o 7º dia). Dor abdominal intensa e contínua, vômitos persistentes, letargia/irritabilidade, hipotensão postural e sangramento de mucosas exigem atendimento imediato e reposição volêmica endovenosa (Grupo C).',
    epidemiologicalInsight:
      'O levantamento populacional revelou que 36% dos participantes acreditavam que a queda da febre no 4º dia representava cura imediata, reduzindo a vigilância justamente na janela crítica.',
  },
  {
    id: 3,
    category: 'Segurança Medicamentosa e Risco Hemorrágico',
    question:
      'Diante de qualquer quadro febril suspeito de Dengue, quais medicamentos são formalmente CONTRAINDICADOS pelo Ministério da Saúde devido ao risco de agravar sangramentos, disfunção plaquetária e lesão de mucosa gástrica?',
    options: [
      'Dipirona ou Paracetamol em doses recomendadas pelo médico para controle de febre e dor.',
      'Sais de Reidratação Oral (soro do SUS) e ingestão fracionada de água, água de coco e sucos.',
      'Ácido Acetilsalicílico (AAS/Aspirina) e Anti-inflamatórios Não Esteroidais (Ibuprofeno, Diclofenaco, Nimesulida, Cetoprofeno).',
      'Repouso físico domiciliar acompanhado de compressas mornas.',
    ],
    correctIndex: 2,
    optionDistribution: [5, 3, 84, 8],
    explanation:
      'O uso de salicilatos (AAS) e anti-inflamatórios não esteroidais (Ibuprofeno, Diclofenaco, Nimesulida, Naproxeno, Cetoprofeno) é estritamente contraindicado na suspeita de Dengue por inibir a agregação plaquetária e elevar o risco de hemorragias digestivas graves.',
    epidemiologicalInsight:
      'Apesar de 84% identificarem a proibição do AAS, 28,4% dos participantes relataram já ter utilizado anti-inflamatórios como Ibuprofeno ou Nimesulida para "dor no corpo" antes de cogitar Dengue.',
  },
  {
    id: 4,
    category: 'Conscientização sobre a Vacina da Dengue no SUS (PNI)',
    question:
      'Sobre a vacina tetravalente contra a Dengue (QDenga / TAK-003) ofertada gratuitamente no Sistema Único de Saúde (SUS), qual é o público-alvo prioritário definido pelo Programa Nacional de Imunizações (PNI) e qual o esquema vacinal completo?',
    options: [
      'Crianças e adolescentes de 10 a 14 anos em municípios prioritários, em esquema de 2 (duas) doses com intervalo de 3 meses (90 dias).',
      'Recém-nascidos na primeira semana de vida, em dose única aplicada na maternidade.',
      'Apenas idosos acima de 75 anos de idade, em esquema de dose anual conjunta com a Influenza.',
      'Adultos de qualquer idade, porém restrita apenas a quem nunca teve infecção prévia por Dengue.',
    ],
    correctIndex: 0,
    optionDistribution: [71, 6, 9, 14],
    explanation:
      'O Ministério da Saúde e a Câmara Técnica de Assessoramento em Imunizações (CTAI) estabeleceram a faixa de 10 a 14 anos como público prioritário no SUS por concentrar elevada taxa de hospitalização. A vacina protege contra os 4 sorotipos (DENV-1 a DENV-4) tanto em soropositivos quanto em soronegativos, exigindo 2 doses com intervalo de 90 dias.',
    epidemiologicalInsight:
      'Na coleta comunitária, 46,5% dos responsáveis sabiam que a vacina estava disponível na UBS, mas desconheciam a obrigatoriedade do retorno em 90 dias para a 2ª dose.',
  },
  {
    id: 5,
    category: 'Critérios Técnicos e Contraindicações da Vacina no SUS',
    question:
      'Por ser composta por vírus vivo atenuado, a vacina contra a Dengue do SUS possui contraindicações específicas e regra de intervalo após infecção aguda. Qual das alternativas abaixo está CORRETA segundo as normas do PNI?',
    options: [
      'Pode ser aplicada em gestantes em qualquer trimestre da gravidez e durante o aleitamento materno.',
      'É contraindicada para gestantes, lactantes (amamentando) e imunossuprimidos; e quem teve Dengue recente deve aguardar 6 meses após a infecção para se vacinar.',
      'Quem teve Dengue há 1 ano está proibido de tomar a vacina pelo resto da vida.',
      'A vacina causa Dengue clínica grave em 90% dos adolescentes vacinados.',
    ],
    correctIndex: 1,
    optionDistribution: [8, 76, 12, 4],
    explanation:
      'Por conter vírus vivo atenuado, a vacina é contraindicada para gestantes, nutrizes (lactantes) e pessoas com imunossupressão congênita ou adquirida. Já quem teve episódio agudo de Dengue deve aguardar 6 meses para iniciar ou completar o esquema vacinal, garantindo melhor resposta imune humoral.',
    epidemiologicalInsight:
      'A orientação sobre o intervalo de 6 meses pós-dengue foi um dos pontos de maior esclarecimento para as famílias participantes da campanha em novembro de 2024.',
  },
  {
    id: 6,
    category: 'Canais Oficiais do SUS e Caderneta Digital',
    question:
      'Qual é a plataforma digital oficial e gratuita do Ministério da Saúde onde pais, adolescentes e cidadãos podem conferir o registro das doses da vacina, verificar o aprazamento da 2ª dose e localizar salas de vacinação do SUS?',
    options: [
      'Correntes de áudio encaminhadas em aplicativos de mensagens.',
      'Aplicativo e portal oficial "Meu SUS Digital" (integrado à Rede Nacional de Dados em Saúde - RNDS) e Disque Saúde 136.',
      'Páginas comerciais de venda de repelentes ultrassônicos.',
      'Apenas mediante protocolo físico na sede estadual do conselho médico.',
    ],
    correctIndex: 1,
    optionDistribution: [2, 91, 5, 2],
    explanation:
      'O aplicativo e portal "Meu SUS Digital" (antigo Conecte SUS) é o canal oficial do Ministério da Saúde que disponibiliza a Carteira Nacional Digital de Vacinação, sincronizada com a Rede Nacional de Dados em Saúde (RNDS), além do telefone gratuito Disque Saúde 136.',
    epidemiologicalInsight:
      'Ao final do quiz educativo, 89,4% dos participantes confirmaram o acesso ou instalação do aplicativo Meu SUS Digital para acompanhamento vacinal.',
  },
];

export interface FactOrFakeItem {
  id: number;
  topic: string;
  claim: string;
  isFact: boolean;
  communityConfusionRate: string;
  shortVerdict: string;
  scientificExplanation: string;
  officialSource: string;
}

export const FATO_OU_FAKE_ITEMS: FactOrFakeItem[] = [
  {
    id: 1,
    topic: 'Imunidade Pós-Infecção e Vacina no SUS',
    claim:
      '"Quem já teve Dengue uma vez na vida já está protegido e não precisa tomar a vacina contra a Dengue no SUS."',
    isFact: false,
    communityConfusionRate: '38% dos participantes tinham dúvida sobre esta afirmação',
    shortVerdict: 'FAKE NEWS! Quem já teve Dengue DEVE se vacinar (respeitando 6 meses após o quadro agudo).',
    scientificExplanation:
      'Existem 4 sorotipos do vírus da Dengue (DENV-1, DENV-2, DENV-3 e DENV-4). Ter contraído um sorotipo gera imunidade apenas contra aquele sorotipo específico, permanecendo o risco de infecção pelos outros três — sendo a segunda infecção frequentemente associada a maior risco de febre hemorrágica/Dengue Grave. A vacina QDenga do SUS é tetravalente e indicada tanto para quem nunca teve quanto para quem já teve dengue.',
    officialSource: 'Nota Técnica PNI / Ministério da Saúde & Organização Mundial da Saúde (OMS)',
  },
  {
    id: 2,
    topic: 'Esquema Vacinal de 2 Doses no SUS',
    claim:
      '"A vacina da Dengue ofertada no SUS para jovens de 10 a 14 anos exige obrigatoriamente 2 doses, com intervalo de 3 meses (90 dias) entre a 1ª e a 2ª dose."',
    isFact: true,
    communityConfusionRate: '46,5% dos responsáveis desconheciam o intervalo exato de 90 dias',
    shortVerdict: 'FATO CIENTÍFICO! O esquema completo de 2 doses é indispensável para proteção duradoura.',
    scientificExplanation:
      'Os estudos clínicos de fase 3 (TIDES) comprovaram eficácia global superior a 80% contra casos sintomáticos e redução de 85% a 90% nas hospitalizações por Dengue quando administradas as duas doses com intervalo de 90 dias. Tomar apenas a primeira dose não assegura a memória imunológica de longo prazo.',
    officialSource: 'Programa Nacional de Imunizações (PNI / Ministério da Saúde)',
  },
  {
    id: 3,
    topic: 'Receitas Caseiras e Repelentes Alternativos',
    claim:
      '"Tomar vitaminas do Complexo B, ingerir inhame/alho ou colocar borra de café nos pratinhos de planta impede a picada e mata 100% das larvas do Aedes aegypti."',
    isFact: false,
    communityConfusionRate: '44% dos respondentes já haviam recebido essa receita em redes sociais',
    shortVerdict: 'FAKE NEWS! Nem complexo B nem borra de café substituem a escovação mecânica e repelentes aprovados pela Anvisa.',
    scientificExplanation:
      'Ensaios laboratoriais da Fiocruz demonstram que a excreção cutânea de tiamina (vitamina B1) ou compostos de alho não exerce efeito repelente eficaz contra a fêmea do Aedes aegypti. Para proteção individual, são recomendados apenas repelentes registrados na Anvisa à base de Icaridina, DEET ou IR3535, aliados à eliminação física e escovação semanal de recipientes.',
    officialSource: 'Fundação Oswaldo Cruz (Fiocruz) & Anvisa',
  },
  {
    id: 4,
    topic: 'Hidratação Precoce no Primeiro Atendimento',
    claim:
      '"Na suspeita de Dengue, a hidratação oral abundante com soro de reidratação e líquidos deve começar imediatamente em casa e na UBS, sem esperar o resultado do exame de sangue."',
    isFact: true,
    communityConfusionRate: '82% acertaram após leitura do guia preventivo',
    shortVerdict: 'FATO CIENTÍFICO! A hidratação oral precoce (60 mL/kg/dia) é a medida que mais salva vidas na Dengue.',
    scientificExplanation:
      'O principal mecanismo de gravidade na Dengue é o aumento da permeabilidade capilar com extravasamento de plasma para o terceiro espaço. Iniciar a reposição hídrica oral (60 mL/kg/dia em adultos, sendo 1/3 com Sais de Reidratação Oral e 2/3 com líquidos caseiros) logo nas primeiras horas previne a hipovolemia e reduz drasticamente a evolução para o choque (Grupo D).',
    officialSource: 'Manual de Diagnóstico e Manejo Clínico da Dengue — Ministério da Saúde (6ª Edição)',
  },
  {
    id: 5,
    topic: 'Segurança da Vacina Tetravalente Atenuada',
    claim:
      '"Gestantes, mulheres que estão amamentando (lactantes) e pessoas com imunossupressão NÃO devem receber a vacina da Dengue do SUS (QDenga)."',
    isFact: true,
    communityConfusionRate: '29% desconheciam a contraindicação para lactantes e gestantes',
    shortVerdict: 'FATO CIENTÍFICO! Por ser vacina de vírus vivo atenuado, é contraindicada para gestantes, lactantes e imunossuprimidos.',
    scientificExplanation:
      'Assim como outras vacinas de vírus vivo atenuado (como Tríplice Viral e Febre Amarela), a vacina tetravalente contra a Dengue (TAK-003) possui contraindicação formal para gestantes, nutrizes e indivíduos com imunodeficiência primária ou adquirida (ou em uso de quimioterapia/corticoterapia imunossupressora). Para esses grupos, a proteção baseia-se no controle vetorial rigoroso e uso de repelentes seguros (como Icaridina).',
    officialSource: 'Informe Técnico Operacional de Vacinação contra a Dengue — PNI / MS',
  },
  {
    id: 6,
    topic: 'Perigo dos Anti-inflamatórios e Salicilatos',
    claim:
      '"No início da febre e dor no corpo da Dengue, tomar Ibuprofeno, Diclofenaco, Nimesulida ou Aspirina (AAS) acelera a recuperação e desinflama as articulações com segurança."',
    isFact: false,
    communityConfusionRate: '28,4% relataram risco de automedicação com AINEs nas primeiras 24h',
    shortVerdict: 'FAKE NEWS PERIGOSA! AAS e anti-inflamatórios são estritamente PROIBIDOS na suspeita de Dengue.',
    scientificExplanation:
      'O Ácido Acetilsalicílico (AAS) e os Anti-inflamatórios Não Esteroidais (Ibuprofeno, Diclofenaco, Nimesulida, Cetoprofeno, Naproxeno) inibem a função plaquetária, agridem a mucosa gastrointestinal e potencializam sangramentos graves e acidose em pacientes com Dengue. O controle sintomático da febre e dor deve ser feito exclusivamente com Dipirona ou Paracetamol sob orientação médica.',
    officialSource: 'Protocolo Clínico de Arboviroses — Ministério da Saúde',
  },
];

export interface VectorChecklistItem {
  id: string;
  area: string;
  title: string;
  frequency: string;
  entomologicalWhy: string;
  actionRequired: string;
  riskPoints: number;
}

export const VECTOR_INSPECTION_ITEMS: VectorChecklistItem[] = [
  {
    id: 'pratinhos',
    area: 'Varanda, Jardim e Área Interna',
    title: 'Pratinhos de vasos de plantas e cachepôs',
    frequency: 'Vistoria a cada 7 dias',
    entomologicalWhy:
      'Concentram cerca de 26% dos focos residenciais urbanos; os ovos aderem na borda interna plástica ou cerâmica.',
    actionRequired:
      'Eliminar o pratinho ou preenchê-lo até a borda com areia grossa lavada, escovando as laterais uma vez por semana.',
    riskPoints: 15,
  },
  {
    id: 'calhas',
    area: 'Cobertura e Telhado',
    title: 'Calhas de chuva, rufos e lajes com desnível',
    frequency: 'Vistoria quinzenal / após chuvas',
    entomologicalWhy:
      'Folhas secas represam pequenas lâminas de água limpa e sombreada — microclima ideal para larvas do Aedes aegypti.',
    actionRequired:
      'Remover folhas e detritos acumulados, desobstruir os condutores de descida e nivelar poças em lajes.',
    riskPoints: 15,
  },
  {
    id: 'caixa-dagua',
    area: 'Reservatórios Superiores e Inferiores',
    title: 'Caixas d’água, cisternas, tonéis e barris de armazenamento',
    frequency: 'Verificação permanente da vedação',
    entomologicalWhy:
      'Um único reservatório elevado destampado ou com fresta de 2 mm pode gerar milhares de mosquitos para toda a vizinhança.',
    actionRequired:
      'Manter tampa perfeitamente vedada, parafusada ou revestida com tela milimétrica de nylon nas saídas de extravasor ("ladrão").',
    riskPoints: 20,
  },
  {
    id: 'ralos',
    area: 'Banheiros de Serviço, Quintal e Garagem',
    title: 'Ralos internos e externos de baixo uso (sifonados)',
    frequency: 'Vistoria 1x por semana',
    entomologicalWhy:
      'O selo hídrico dentro do ralo sifonado permanece parado e na sombra quando o banheiro ou área externa é pouco utilizado.',
    actionRequired:
      'Instalar ralos com fecho abre-e-fecha (escamoteável), colocar tela fina ou despejar água sanitária semanalmente.',
    riskPoints: 12,
  },
  {
    id: 'geladeira',
    area: 'Cozinha e Climatização',
    title: 'Bandeja coletora atrás da geladeira, filtro e dreno de ar-condicionado',
    frequency: 'Vistoria a cada 7 a 10 dias',
    entomologicalWhy:
      'O degelo automático mantém água morna constante na bandeja traseira do motor, frequentemente esquecida pelos moradores.',
    actionRequired:
      'Retirar a água acumulada na bandeja traseira e lavar as paredes plásticas com esponja e detergente neutro.',
    riskPoints: 13,
  },
  {
    id: 'bebedouros',
    area: 'Área de Pets e Quintal',
    title: 'Bebedouros de cães, gatos e aves domésticas',
    frequency: 'Troca diária + escovação 2x por semana',
    entomologicalWhy:
      'Apenas trocar a água sem esfregar a parede da vasilha não remove os ovos microscópicos já depositados na linha d’água.',
    actionRequired:
      'Lavar vigorosamente toda a borda interna do bebedouro com bucha exclusiva, água corrente e sabão neutro.',
    riskPoints: 15,
  },
  {
    id: 'descartaveis',
    area: 'Quintal, Área de Serviço e Depósito',
    title: 'Garrafas PET/vidro, pneus, lonas plásticas e baldes vazios',
    frequency: 'Vistoria semanal ("10 Minutos Contra a Dengue")',
    entomologicalWhy:
      'Dobras de lonas plásticas e pneus guardados acumulam água de orvalho ou chuva que demora semanas para evaporar.',
    actionRequired:
      'Guardar garrafas sempre de cabeça para baixo, manter pneus em local coberto e esticar ou recolher lonas.',
    riskPoints: 10,
  },
];
