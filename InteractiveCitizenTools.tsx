import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  ShieldAlert,
  Syringe,
  Droplets,
  Home,
  Calendar,
  Sparkles,
  CheckSquare,
  Square,
  Info,
} from 'lucide-react';
import {
  FATO_OU_FAKE_ITEMS,
  VECTOR_INSPECTION_ITEMS,
} from '../data/campaignData';

/**
 * 1. Desafio Interativo "Fato ou Fake" sobre a Vacina da Dengue no SUS e Prevenção
 */
export const FactOrFakeInteractiveSection: React.FC = () => {
  // Mapa de respostas do usuário: { [id]: boolean (true = votou FATO, false = votou FAKE) }
  const [userVotes, setUserVotes] = useState<Record<number, boolean>>({});

  const totalAnswered = Object.keys(userVotes).length;
  const correctVotes = FATO_OU_FAKE_ITEMS.filter(
    (item) => userVotes[item.id] !== undefined && userVotes[item.id] === item.isFact
  ).length;

  const handleVote = (id: number, votedFact: boolean) => {
    setUserVotes((prev) => ({
      ...prev,
      [id]: votedFact,
    }));
  };

  const handleReset = () => {
    setUserVotes({});
  };

  return (
    <div className="bg-white border border-stone-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-tabular font-bold text-[#0F4C3A] uppercase">
            <span>EIXO III · DINÂMICA INTERATIVA DE COMBATE À DESINFORMAÇÃO (INFODEMIOLOGIA)</span>
          </div>
          <h3 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Desafio Populacional &ldquo;Fato ou Fake&rdquo;: Vacina da Dengue no SUS e Prevenção
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Clique em <strong>É FATO CIENTÍFICO</strong> ou <strong>É FAKE NEWS</strong> em cada
            afirmação abaixo para testar seus conhecimentos e destravar o parecer técnico do
            Ministério da Saúde / PNI.
          </p>
        </div>

        {/* Placar em tempo real do Fato ou Fake */}
        <div className="flex items-center gap-3 bg-[#FAF9F6] border border-stone-200 px-4 py-2.5 rounded-xl">
          <div className="text-right font-mono-tabular">
            <span className="text-[11px] text-stone-500 block">SEU PLACAR ATUAL</span>
            <strong className="text-sm text-[#0F4C3A]">
              {correctVotes} acertos de {totalAnswered}/{FATO_OU_FAKE_ITEMS.length} avaliados
            </strong>
          </div>
          {totalAnswered > 0 && (
            <button
              type="button"
              onClick={handleReset}
              title="Reiniciar Desafio Fato ou Fake"
              className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Grade de Cards Interativos Fato ou Fake */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {FATO_OU_FAKE_ITEMS.map((item, idx) => {
          const hasVoted = userVotes[item.id] !== undefined;
          const userChoice = userVotes[item.id];
          const userGotItRight = hasVoted && userChoice === item.isFact;

          return (
            <div
              key={item.id}
              className={`rounded-2xl border p-6 flex flex-col justify-between transition-all ${
                !hasVoted
                  ? 'bg-[#FAF9F6] border-stone-200/90 hover:border-stone-300'
                  : userGotItRight
                    ? 'bg-[#EEF7F2]/70 border-[#0F4C3A]'
                    : 'bg-amber-50/60 border-amber-400'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 text-xs font-mono-tabular">
                  <span className="font-bold text-[#1B365D]">
                    AFIRMAÇÃO 0{idx + 1} · {item.topic.toUpperCase()}
                  </span>
                  {!hasVoted ? (
                    <span className="text-stone-500 flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5" />
                      Aguardando seu voto
                    </span>
                  ) : userGotItRight ? (
                    <span className="text-[#0F4C3A] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Você acertou!
                    </span>
                  ) : (
                    <span className="text-amber-800 font-bold flex items-center gap-1">
                      <ShieldAlert className="w-4 h-4" />
                      Atenção ao esclarecimento
                    </span>
                  )}
                </div>

                <h4 className="text-base font-bold text-stone-900 leading-snug">
                  {item.claim}
                </h4>
              </div>

              {/* Botões de Votação (Fato vs Fake) ou Parecer Científico Revelado */}
              {!hasVoted ? (
                <div className="pt-5 mt-4 border-t border-stone-200/80 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleVote(item.id, true)}
                    className="py-2.5 px-4 rounded-xl bg-white hover:bg-[#EEF7F2] text-[#0F4C3A] border border-[#0F4C3A]/40 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>É FATO CIENTÍFICO</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleVote(item.id, false)}
                    className="py-2.5 px-4 rounded-xl bg-white hover:bg-red-50 text-red-700 border border-red-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>É FAKE NEWS</span>
                  </button>
                </div>
              ) : (
                <div className="pt-4 mt-4 border-t border-stone-200/90 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold">
                    {item.isFact ? (
                      <span className="text-[#0F4C3A] flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        {item.shortVerdict}
                      </span>
                    ) : (
                      <span className="text-red-700 flex items-center gap-1.5">
                        <XCircle className="w-4 h-4 shrink-0" />
                        {item.shortVerdict}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-stone-700 leading-relaxed">
                    {item.scientificExplanation}
                  </p>

                  <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono-tabular text-stone-500">
                    <span>Fonte: {item.officialSource}</span>
                    <span className="text-[#1B365D] font-semibold">
                      {item.communityConfusionRate}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * 2. Checklist Interativo Domiciliar "10 Minutos Contra a Dengue" +
 *    Simulador de Elegibilidade da Vacina no SUS e Calculadora de Hidratação Oral Precoce
 */
export const CitizenInteractiveSimulators: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'checklist' | 'vaccine' | 'hydration'>(
    'checklist'
  );

  // Estado do Checklist Domiciliar "10 Minutos Contra a Dengue"
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    pratinhos: true,
    bebedouros: true,
  });

  const toggleChecklistItem = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const protectionScore = VECTOR_INSPECTION_ITEMS.reduce(
    (acc, item) => (checkedItems[item.id] ? acc + item.riskPoints : acc),
    0
  );

  // Estado do Simulador de Elegibilidade da Vacina da Dengue no SUS (QDenga / PNI)
  const [ageGroup, setAgeGroup] = useState<'under10' | '10to14' | '15to59' | '60plus'>(
    '10to14'
  );
  const [hadRecentDengue, setHadRecentDengue] = useState<'no' | 'under6m' | 'over6m'>(
    'no'
  );
  const [hasContraindication, setHasContraindication] = useState<boolean>(false);
  const [firstDoseDate, setFirstDoseDate] = useState<string>('2024-11-09');

  // Cálculo da data da 2ª dose (+90 dias)
  const computeSecondDoseDate = (dateStr: string): string => {
    if (!dateStr) return '90 dias após a 1ª dose';
    const d = new Date(dateStr + 'T12:00:00');
    if (isNaN(d.getTime())) return '90 dias após a 1ª dose';
    d.setDate(d.getDate() + 90);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  // Estado da Calculadora Clínica de Hidratação Oral Precoce (Protocolo MS: 60 mL/kg/dia)
  const [bodyWeightKg, setBodyWeightKg] = useState<number>(68);
  const totalHydrationMl = bodyWeightKg * 60;
  const sroVolumeMl = Math.round(totalHydrationMl / 3);
  const homeFluidsMl = totalHydrationMl - sroVolumeMl;
  const cups200ml = Math.round(totalHydrationMl / 200);

  return (
    <div className="bg-white border border-stone-200/90 rounded-2xl overflow-hidden shadow-xs">
      {/* Cabeçalho com Abas Interativas para o Cidadão */}
      <div className="bg-[#FAF9F6] border-b border-stone-200 px-6 py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-mono-tabular font-bold text-[#0F4C3A] uppercase">
            FERRAMENTAS PRÁTICAS DE EDUCAÇÃO EM SAÚDE PARA A POPULAÇÃO
          </p>
          <h3 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-stone-900 mt-0.5">
            Simuladores Comunitários: Controle Vetorial, Vacina no SUS e Hidratação
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-stone-200/80 p-1.5 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('checklist')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'checklist'
                ? 'bg-[#0F4C3A] text-white shadow-xs'
                : 'text-stone-700 hover:text-stone-950 hover:bg-white/60'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>1. Vistoria &ldquo;10 Minutos Contra a Dengue&rdquo;</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('vaccine')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'vaccine'
                ? 'bg-[#1B365D] text-white shadow-xs'
                : 'text-stone-700 hover:text-stone-950 hover:bg-white/60'
            }`}
          >
            <Syringe className="w-3.5 h-3.5" />
            <span>2. Simulador da Vacina no SUS (PNI)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('hydration')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'hydration'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-700 hover:text-stone-950 hover:bg-white/60'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>3. Calculadora de Hidratação (SUS)</span>
          </button>
        </div>
      </div>

      {/* CONTEÚDO DA ABA 1: CHECKLIST DOMICILIAR "10 MINUTOS CONTRA A DENGUE" */}
      {activeTab === 'checklist' && (
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#EEF7F2] border border-[#B8D8C5] rounded-xl p-5">
            <div className="space-y-1">
              <p className="text-xs font-mono-tabular font-bold text-[#0F4C3A] uppercase">
                ÍNDICE DE BLINDAGEM DOMICILIAR CONTRA O AEDES AEGYPTI
              </p>
              <h4 className="text-lg font-bold text-stone-900">
                Marque os pontos que você já vistoriou e escovou na sua residência nesta semana:
              </h4>
              <p className="text-xs text-stone-600">
                Como o ciclo do mosquito leva de 7 a 10 dias do ovo à fase adulta, atingir 100%
                uma vez por semana impede o nascimento de mosquitos transmissores de Dengue, Zika
                e Chikungunya.
              </p>
            </div>

            <div className="bg-white border border-[#0F4C3A]/30 rounded-xl px-5 py-3 text-center shrink-0">
              <span className="text-[11px] font-mono-tabular text-stone-500 block">
                PROTEÇÃO DA SUA CASA
              </span>
              <span className="text-3xl font-bold font-mono-tabular text-[#0F4C3A]">
                {protectionScore}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {VECTOR_INSPECTION_ITEMS.map((item) => {
              const isChecked = !!checkedItems[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    isChecked
                      ? 'bg-[#EEF7F2]/60 border-[#0F4C3A]'
                      : 'bg-[#FAF9F6] border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <button
                    type="button"
                    className="mt-0.5 text-[#0F4C3A] shrink-0 cursor-pointer"
                    aria-label={item.title}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-5 h-5 text-[#0F4C3A]" />
                    ) : (
                      <Square className="w-5 h-5 text-stone-400" />
                    )}
                  </button>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between gap-2 text-[11px] font-mono-tabular">
                      <span className="text-[#1B365D] font-bold uppercase">{item.area}</span>
                      <span className="text-[#0F4C3A] font-semibold">
                        +{item.riskPoints}% proteção
                      </span>
                    </div>
                    <h5 className="text-sm font-bold text-stone-900">{item.title}</h5>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      <strong>Por que vistoriar:</strong> {item.entomologicalWhy}
                    </p>
                    <p className="text-xs text-[#0F4C3A] font-medium pt-0.5">
                      <strong>Conduta recomendada:</strong> {item.actionRequired}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CONTEÚDO DA ABA 2: SIMULADOR DE ELEGIBILIDADE DA VACINA NO SUS (PNI) */}
      {activeTab === 'vaccine' && (
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Controles de Entrada */}
            <div className="lg:col-span-6 space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                  1. Qual é a faixa etária da pessoa a ser vacinada?
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: 'under10', label: 'Menor de 10 anos' },
                    { id: '10to14', label: '10 a 14 anos (Público SUS)' },
                    { id: '15to59', label: '15 a 59 anos' },
                    { id: '60plus', label: '60 anos ou mais' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setAgeGroup(opt.id as typeof ageGroup)}
                      className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                        ageGroup === opt.id
                          ? 'bg-[#1B365D] text-white border-[#1B365D]'
                          : 'bg-[#FAF9F6] text-stone-800 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                  2. Teve diagnóstico agudo de Dengue recentemente?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'no', label: 'Nunca teve Dengue' },
                    { id: 'under6m', label: 'Sim, há menos de 6 meses' },
                    { id: 'over6m', label: 'Sim, há mais de 6 meses' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setHadRecentDengue(opt.id as typeof hadRecentDengue)}
                      className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                        hadRecentDengue === opt.id
                          ? 'bg-[#0F4C3A] text-white border-[#0F4C3A]'
                          : 'bg-[#FAF9F6] text-stone-800 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                  3. Possui alguma contraindicação para vacina de vírus vivo atenuado?
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setHasContraindication(false)}
                    className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                      !hasContraindication
                        ? 'bg-[#0F4C3A] text-white border-[#0F4C3A]'
                        : 'bg-[#FAF9F6] text-stone-800 border-stone-200'
                    }`}
                  >
                    Não (Sem gestação, lactação ou imunossupressão)
                  </button>
                  <button
                    type="button"
                    onClick={() => setHasContraindication(true)}
                    className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                      hasContraindication
                        ? 'bg-red-700 text-white border-red-700'
                        : 'bg-[#FAF9F6] text-stone-800 border-stone-200'
                    }`}
                  >
                    Sim (Gestante, lactante ou imunossuprimido)
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-200">
                <label
                  htmlFor="first-dose-date"
                  className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5"
                >
                  4. Calculadora de Retorno da 2ª Dose (Informe a data da 1ª dose):
                </label>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-[#1B365D] shrink-0" />
                  <input
                    id="first-dose-date"
                    type="date"
                    value={firstDoseDate}
                    onChange={(e) => setFirstDoseDate(e.target.value)}
                    className="px-3.5 py-2 bg-[#FAF9F6] border border-stone-300 rounded-lg text-xs font-mono-tabular text-stone-900"
                  />
                </div>
              </div>
            </div>

            {/* Painel de Resultado da Orientação Vacinal no SUS */}
            <div className="lg:col-span-6 flex flex-col justify-between bg-[#FAF9F6] border border-stone-200 rounded-2xl p-6 space-y-4">
              <div className="space-y-3">
                <p className="text-xs font-mono-tabular font-bold text-[#1B365D] uppercase">
                  PARECER DE ORIENTAÇÃO VACINAL BASEADO NAS NORMAS DO PNI / SUS
                </p>

                {hasContraindication ? (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 space-y-2">
                    <h4 className="text-base font-bold text-red-900 flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                      <span>Vacina Contraindicada neste Momento (Vírus Vivo Atenuado)</span>
                    </h4>
                    <p className="text-xs text-red-800 leading-relaxed">
                      Segundo o Programa Nacional de Imunizações (PNI), a vacina QDenga é
                      contraindicada para <strong>gestantes, nutrizes (lactantes)</strong> e
                      pessoas com <strong>imunossupressão congênita ou adquirida</strong>. A
                      proteção deve ser feita com controle de focos e uso de repelentes seguros
                      aprovados pela Anvisa (ex: Icaridina).
                    </p>
                  </div>
                ) : ageGroup === '10to14' && hadRecentDengue === 'under6m' ? (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 space-y-2">
                    <h4 className="text-base font-bold text-amber-900 flex items-center gap-2">
                      <Info className="w-5 h-5 text-amber-600 shrink-0" />
                      <span>Elegível no SUS, mas Deve Aguardar 6 Meses Pós-Infecção</span>
                    </h4>
                    <p className="text-xs text-stone-800 leading-relaxed">
                      O adolescente faz parte do <strong>grupo prioritário gratuito do SUS (10 a 14 anos)</strong>,
                      porém quem teve infecção aguda por Dengue deve aguardar{' '}
                      <strong>6 meses (180 dias)</strong> após o início dos sintomas para receber a
                      dose, garantindo resposta imunológica ideal.
                    </p>
                  </div>
                ) : ageGroup === '10to14' ? (
                  <div className="p-4 rounded-xl bg-[#EEF7F2] border border-[#0F4C3A] space-y-2">
                    <h4 className="text-base font-bold text-[#0F4C3A] flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#0F4C3A] shrink-0" />
                      <span>Elegível para Vacinação Gratuita no SUS (Público Prioritário PNI)</span>
                    </h4>
                    <p className="text-xs text-stone-800 leading-relaxed">
                      Crianças e adolescentes de <strong>10 a 14 anos</strong> integram a faixa
                      etária prioritária definida pelo Ministério da Saúde. Compareça à Unidade
                      Básica de Saúde (UBS) com documento de identificação, CPF/CNS e caderneta de
                      vacinação.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2">
                    <h4 className="text-base font-bold text-[#1B365D] flex items-center gap-2">
                      <Info className="w-5 h-5 text-[#1B365D] shrink-0" />
                      <span>Fora da Faixa Prioritária Inicial do PNI/SUS (10 a 14 anos)</span>
                    </h4>
                    <p className="text-xs text-stone-800 leading-relaxed">
                      No calendário oficial do PNI/SUS, as doses gratuitas estão concentradas na
                      faixa de <strong>10 a 14 anos</strong> (grupo com maior taxa de hospitalização
                      após idosos, para os quais a vacina não possui indicação em bula acima de 60
                      anos). Acompanhe comunicados da Secretaria Municipal de Saúde no app{' '}
                      <strong>Meu SUS Digital</strong>.
                    </p>
                  </div>
                )}

                {/* Previsão da 2ª Dose */}
                <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-1">
                  <span className="text-[11px] font-mono-tabular text-stone-500 block uppercase">
                    APRAZAMENTO AUTOMÁTICO DA 2ª DOSE (+90 DIAS / 3 MESES)
                  </span>
                  <p className="text-sm font-bold text-[#1B365D]">
                    Data estimada para a 2ª dose: {computeSecondDoseDate(firstDoseDate)}
                  </p>
                  <p className="text-xs text-stone-600">
                    O registro de ambas as doses fica disponível na Carteira Nacional Digital de
                    Vacinação dentro do aplicativo oficial <strong>Meu SUS Digital</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTEÚDO DA ABA 3: CALCULADORA CLÍNICA DE HIDRATAÇÃO ORAL PRECOCE (60 mL/kg/dia) */}
      {activeTab === 'hydration' && (
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono-tabular font-bold text-amber-800 uppercase">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>DIRETRIZ DO MINISTÉRIO DA SAÚDE (ADULTOS: 60 mL/kg/dia)</span>
              </div>
              <h4 className="text-xl font-bold text-stone-900">
                Calculadora de Hidratação Oral Precoce na Suspeita de Dengue
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Ajuste o peso corporal abaixo para calcular o volume diário exato de líquidos
                recomendado pelo protocolo clínico do Ministério da Saúde logo no início da febre:
              </p>

              <div className="p-5 rounded-xl bg-[#FAF9F6] border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-stone-600">
                    Peso Corporal (Adulto / Jovem):
                  </span>
                  <span className="text-2xl font-bold font-mono-tabular text-[#0F4C3A]">
                    {bodyWeightKg} kg
                  </span>
                </div>
                <input
                  type="range"
                  min={35}
                  max={120}
                  value={bodyWeightKg}
                  onChange={(e) => setBodyWeightKg(Number(e.target.value))}
                  className="w-full accent-[#0F4C3A] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] font-mono-tabular text-stone-500">
                  <span>35 kg</span>
                  <span>70 kg</span>
                  <span>120 kg</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono-tabular">
              <div className="p-5 rounded-xl bg-[#0F4C3A] text-white space-y-1.5">
                <span className="text-[11px] text-emerald-200 block">
                  META TOTAL EM 24 HORAS
                </span>
                <p className="text-2xl sm:text-3xl font-bold text-amber-300">
                  {(totalHydrationMl / 1000).toFixed(2).replace('.', ',')} L
                </p>
                <p className="text-xs text-emerald-100 font-sans">
                  ({totalHydrationMl.toLocaleString('pt-BR')} mL/dia · aprox. {cups200ml} copos de
                  200 mL)
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#FAF9F6] border border-stone-200 space-y-1.5">
                <span className="text-[11px] text-[#1B365D] font-bold block">
                  1/3 COM SORO DE REIDRATAÇÃO (SRO)
                </span>
                <p className="text-2xl font-bold text-stone-900">
                  {sroVolumeMl.toLocaleString('pt-BR')} mL
                </p>
                <p className="text-xs text-stone-600 font-sans">
                  Sais de Reidratação Oral (ofertados gratuitamente nas UBS do SUS), priorizados
                  nas primeiras 4 a 6 horas.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#FAF9F6] border border-stone-200 space-y-1.5">
                <span className="text-[11px] text-[#0F4C3A] font-bold block">
                  2/3 COM LÍQUIDOS CASEIROS
                </span>
                <p className="text-2xl font-bold text-stone-900">
                  {homeFluidsMl.toLocaleString('pt-BR')} mL
                </p>
                <p className="text-xs text-stone-600 font-sans">
                  Água filtrada, água de coco, sucos naturais de frutas e chás claros ao longo do
                  dia.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
