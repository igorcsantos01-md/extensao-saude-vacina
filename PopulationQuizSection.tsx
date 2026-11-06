import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  BookOpen,
  BarChart3,
  AlertTriangle,
  Syringe,
  FileText,
  Users,
  Award,
} from 'lucide-react';
import { POPULATION_QUIZ_QUESTIONS } from '../data/campaignData';

export const PopulationQuizSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [answersHistory, setAnswersHistory] = useState<number[]>([]);
  const [completed, setCompleted] = useState<boolean>(false);
  const [totalParticipants, setTotalParticipants] = useState<number>(1428);
  const [showDigitalPamphlet, setShowDigitalPamphlet] = useState<boolean>(false);

  const currentQuestion = POPULATION_QUIZ_QUESTIONS[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
    setIsSubmitted(true);
    setAnswersHistory((prev) => [...prev, idx]);
    if (idx === currentQuestion.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < POPULATION_QUIZ_QUESTIONS.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setCompleted(true);
      setTotalParticipants((prev) => prev + 1);
      setShowDigitalPamphlet(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setAnswersHistory([]);
    setCompleted(false);
  };

  return (
    <div className="space-y-8">
      {/* Painel Principal do Quiz Populacional */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-200">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tabular text-[#0F4C3A] font-semibold">
              <span>EIXO II · INQUÉRITO DIGITAL E COLETA DE DADOS POPULACIONAIS</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {totalParticipants.toLocaleString('pt-BR')} PARTICIPANTES NA COMUNIDADE
              </span>
            </div>
            <h3 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Quiz Populacional Interativo: Prevenção da Dengue e Vacinação no SUS
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Responda às 6 situações práticas abaixo, compare sua resposta com os dados
              epidemiológicos coletados na comunidade e receba orientação científica imediata.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowDigitalPamphlet((prev) => !prev)}
            className="px-4 py-2.5 text-xs font-semibold text-[#0F4C3A] bg-[#EEF7F2] hover:bg-[#DEF0E6] border border-[#B8D8C5] rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>
              {showDigitalPamphlet
                ? 'Ocultar Folheto Digital de Sinais de Alarme'
                : 'Abrir Folheto Digital de Sinais de Alarme (SUS)'}
            </span>
          </button>
        </div>

        {/* Quiz em Andamento vs Relatório Final */}
        {!completed ? (
          <div className="mt-6">
            {/* Indicador de Questão e Barra de Progresso */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-600 font-mono-tabular mb-2.5">
              <span>
                PERGUNTA {currentIndex + 1} DE {POPULATION_QUIZ_QUESTIONS.length} ·{' '}
                <strong className="text-[#1B365D]">{currentQuestion.category}</strong>
              </span>
              <span>
                PONTUAÇÃO PARCIAL: <strong>{score}</strong>/{POPULATION_QUIZ_QUESTIONS.length} ACERTOS
              </span>
            </div>

            <div className="grid grid-cols-6 gap-1.5 mb-6">
              {POPULATION_QUIZ_QUESTIONS.map((q, i) => {
                let barColor = 'bg-stone-200';
                if (i < answersHistory.length) {
                  barColor =
                    answersHistory[i] === POPULATION_QUIZ_QUESTIONS[i].correctIndex
                      ? 'bg-[#0F4C3A]'
                      : 'bg-amber-500';
                } else if (i === currentIndex) {
                  barColor = 'bg-[#1B365D]';
                }
                return (
                  <div
                    key={q.id}
                    className={`h-2 rounded-full transition-all ${barColor}`}
                  />
                );
              })}
            </div>

            {/* Enunciado da Questão */}
            <h4 className="text-lg sm:text-xl font-bold text-stone-900 leading-snug mb-5">
              {currentQuestion.question}
            </h4>

            {/* Alternativas com Estatística Populacional após Resposta */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQuestion.correctIndex;
                const pct = currentQuestion.optionDistribution[idx] ?? 0;

                let buttonStyle =
                  'bg-[#FAF9F6] hover:bg-stone-100/80 border-stone-300 text-stone-800';
                if (isSubmitted) {
                  if (isCorrect) {
                    buttonStyle =
                      'bg-[#EEF7F2] border-[#0F4C3A] text-stone-950 font-semibold';
                  } else if (isSelected && !isCorrect) {
                    buttonStyle = 'bg-red-50 border-red-400 text-red-900';
                  } else {
                    buttonStyle = 'bg-stone-50 border-stone-200 text-stone-600';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isSubmitted}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all relative overflow-hidden cursor-pointer ${buttonStyle}`}
                  >
                    <div className="flex items-start gap-3.5 relative z-10">
                      <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-mono-tabular font-bold shrink-0 mt-0.5">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <div className="flex-1 space-y-2">
                        <span className="text-sm leading-relaxed block">{option}</span>
                        {isSubmitted && (
                          <div className="pt-1">
                            <div className="flex items-center justify-between text-[11px] font-mono-tabular text-stone-600 mb-1">
                              <span>
                                {isCorrect
                                  ? 'Alternativa Correta (Protocolo SUS/MS)'
                                  : isSelected
                                    ? 'Sua Escolha'
                                    : 'Respostas na Comunidade'}
                              </span>
                              <span className="font-bold">
                                {pct}% da população escolheu esta opção
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-stone-200/80 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  isCorrect ? 'bg-[#0F4C3A]' : 'bg-stone-400'
                                }`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      {isSubmitted && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-[#0F4C3A] shrink-0 mt-0.5" />
                      )}
                      {isSubmitted && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Justificativa Científica Imediata + Resultado da Coleta de Dados */}
            {isSubmitted && (
              <div className="mt-6 space-y-4">
                <div className="p-5 rounded-xl bg-[#FAF9F6] border border-stone-200/90 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0F4C3A]">
                    <FileText className="w-4 h-4" />
                    <span>Fundamentação Científica (Ministério da Saúde / PNI / Fiocruz)</span>
                  </div>
                  <p className="text-sm text-stone-800 leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                  <div className="pt-3 border-t border-stone-200/80 flex items-start gap-2.5 text-xs text-[#1B365D]">
                    <BarChart3 className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                    <span>
                      <strong>Dado Epidemiológico Coletado na Campanha (Nov/2024):</strong>{' '}
                      {currentQuestion.epidemiologicalInsight}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-3 bg-[#0F4C3A] hover:bg-[#14634C] text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span>
                      {currentIndex + 1 < POPULATION_QUIZ_QUESTIONS.length
                        ? 'Próxima Pergunta do Quiz'
                        : 'Concluir Quiz e Gerar Diagnóstico de Letramento'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            <div className="p-6 rounded-xl bg-[#EEF7F2] border border-[#B8D8C5] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#0F4C3A] text-amber-300 flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-mono-tabular font-semibold text-[#0F4C3A] uppercase">
                    PARTICIPAÇÃO CONCLUÍDA · DADOS INTEGRADOS À AMOSTRA COMUNITÁRIA
                  </p>
                  <h4 className="text-xl font-bold text-stone-900 mt-1">
                    Você acertou {score} de {POPULATION_QUIZ_QUESTIONS.length} questões (
                    {Math.round((score / POPULATION_QUIZ_QUESTIONS.length) * 100)}% de aproveitamento)
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-700 mt-1 leading-relaxed">
                    {score >= 5
                      ? 'Excelente nível de letramento epidemiológico! Você domina as práticas de controle do Aedes aegypti, o reconhecimento dos sinais de alarme e o esquema de 2 doses da vacina no SUS.'
                      : 'Obrigado por participar! Confira abaixo o Folheto Digital de Sinais de Alarme e o Guia da Vacina contra a Dengue no SUS para proteger sua família.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRestart}
                className="px-4 py-2.5 bg-white hover:bg-stone-50 text-[#0F4C3A] border border-[#0F4C3A]/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Refazer Quiz Populacional</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Folheto Digital Interativo de Sinais de Alarme e Guia da Vacina no SUS */}
      {showDigitalPamphlet && (
        <div className="bg-white border-2 border-[#0F4C3A] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200">
            <div>
              <p className="text-xs font-mono-tabular font-bold text-[#0F4C3A] uppercase">
                MATERIAL EDUCATIVO COMUNITÁRIO · DISTRIBUIÇÃO GRATUITA (EIXOS I, III E IV)
              </p>
              <h3 className="font-serif-editorial text-2xl font-bold text-stone-900 mt-0.5">
                Folheto Digital Oficial: Sinais de Alarme da Dengue e Guia da Vacina no SUS
              </h3>
            </div>
            <span className="text-xs font-mono-tabular text-stone-500">
              Curadoria Científica: Dr. Lucas Gonçalves Silveira · Nov/2024
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Coluna 1: Sinais de Alarme */}
            <div className="p-5 rounded-xl bg-amber-50/70 border border-amber-200/90 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <span>1. Sinais de Alarme (Procure UPA/UBS Imediatamente)</span>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed">
                Atenção redobrada entre o <strong>3º e o 7º dia</strong> (quando a febre começa a
                ceder):
              </p>
              <ul className="text-xs text-stone-800 space-y-1.5 list-disc pl-4">
                <li>Dor abdominal intensa (referida ou à palpação) e contínua;</li>
                <li>Vômitos persistentes que impedem a hidratação oral;</li>
                <li>Tontura ao levantar, sensação de desmaio (hipotensão postural);</li>
                <li>Sangramento de gengivas, nariz (epistaxe) ou petéquias;</li>
                <li>Sonolência excessiva (letargia) ou irritabilidade em crianças.</li>
              </ul>
            </div>

            {/* Coluna 2: Hidratação Precoce e Medicamentos Proibidos */}
            <div className="p-5 rounded-xl bg-[#FAF9F6] border border-stone-200 space-y-3">
              <div className="flex items-center gap-2 text-[#1B365D] font-bold text-sm">
                <FileText className="w-5 h-5 text-[#1B365D] shrink-0" />
                <span>2. Hidratação Imediata e Alerta contra Automedicação</span>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed">
                Inicie a hidratação oral logo na suspeita clínica:
              </p>
              <ul className="text-xs text-stone-800 space-y-1.5 list-disc pl-4">
                <li>
                  <strong>Adultos:</strong> 60 mL/kg/dia (1/3 com Sais de Reidratação Oral do SUS e
                  2/3 com água, água de coco ou sucos naturais);
                </li>
                <li>
                  <strong>PROIBIDO USAR:</strong> AAS (Aspirina), Ibuprofeno, Diclofenaco,
                  Nimesulida, Cetoprofeno e corticoides sem prescrição médica (risco hemorrágico).
                </li>
              </ul>
            </div>

            {/* Coluna 3: Vacina da Dengue no SUS (QDenga / PNI) */}
            <div className="p-5 rounded-xl bg-[#EEF7F2] border border-[#B8D8C5] space-y-3">
              <div className="flex items-center gap-2 text-[#0F4C3A] font-bold text-sm">
                <Syringe className="w-5 h-5 text-[#0F4C3A] shrink-0" />
                <span>3. Vacina contra a Dengue no SUS (PNI / Meu SUS Digital)</span>
              </div>
              <ul className="text-xs text-stone-800 space-y-1.5 list-disc pl-4">
                <li>
                  <strong>Público Prioritário no SUS:</strong> Crianças e adolescentes de{' '}
                  <strong>10 a 14 anos</strong>;
                </li>
                <li>
                  <strong>Esquema Completo:</strong> 2 doses com intervalo de{' '}
                  <strong>3 meses (90 dias)</strong>;
                </li>
                <li>
                  <strong>Pós-Dengue Recente:</strong> Aguardar 6 meses após a infecção aguda para
                  vacinar;
                </li>
                <li>
                  <strong>Contraindicações:</strong> Gestantes, lactantes e imunossuprimidos;
                </li>
                <li>
                  <strong>Canal Oficial:</strong> Consulte a caderneta no app{' '}
                  <strong>Meu SUS Digital</strong> ou ligue <strong>Disque Saúde 136</strong>.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
