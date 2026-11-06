import React, { useState, useEffect } from 'react';
import {
  Download,
  FileCheck2,
  Syringe,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  XCircle,
  QrCode,
  ClipboardCheck,
  HeartPulse,
  Smartphone,
  HelpCircle,
} from 'lucide-react';
import { CERTIFICATE_06_DATA } from './data/campaignData';
import {
  LogoEditoraMenteSaude,
  LogoCentroMariaDalva,
} from './components/InstitutionalAssets';
import { CertificateViewer } from './components/CertificateViewer';
import { PublicAuthenticator } from './components/PublicAuthenticator';
import { PopulationQuizSection } from './components/PopulationQuizSection';
import {
  FactOrFakeInteractiveSection,
  CitizenInteractiveSimulators,
} from './components/InteractiveCitizenTools';
import { generateCertificate06Pdf } from './utils/pdfGenerator';

type RiskGroupKey = 'A' | 'B' | 'C' | 'D';

const RISK_GROUPS: Record<
  RiskGroupKey,
  {
    code: RiskGroupKey;
    title: string;
    subtitle: string;
    criteria: string;
    conduct: string;
    hydration: string;
    placeOfCare: string;
    accentColor: string;
  }
> = {
  A: {
    code: 'A',
    title: 'Grupo A — Caso Suspeito sem Sinais de Alarme ou Risco Social/Clínico',
    subtitle: 'Classificação Azul · Acompanhamento Ambulatorial e Hidratação Domiciliar',
    criteria:
      'Febre de 2 a 7 dias + 2 ou mais sintomas (náuseas, exantema, mialgia/artralgia, cefaleia, dor retro-orbitária), prova do laço negativa, ausência de sinais de alarme e sem comorbidades ou extremos de idade.',
    conduct:
      'Prescrição de hidratação oral imediata, antitérmicos seguros (Dipirona ou Paracetamol), proibição expressa de AAS e anti-inflamatórios não esteroidais (AINEs) e orientação escrita de retorno imediato na vigência de sinais de alarme.',
    hydration:
      'Adultos: 60 mL/kg/dia (1/3 com Sais de Reidratação Oral do SUS nas primeiras 4–6h e 2/3 com água, água de coco, chás claros ou sucos naturais).',
    placeOfCare: 'Unidade Básica de Saúde (UBS / Estratégia Saúde da Família).',
    accentColor: 'text-[#1B365D] border-[#1B365D]/30 bg-blue-50/50',
  },
  B: {
    code: 'B',
    title: 'Grupo B — Sem Sinais de Alarme, mas com Condição Especial ou Sangramento Cutâneo',
    subtitle: 'Classificação Verde · Observação Clínica e Hemograma Obrigatório',
    criteria:
      'Ausência de sinais de alarme, porém com sangramento espontâneo de pele (petéquias) ou induzido (prova do laço positiva), OU paciente em grupo especial: lactentes (< 2 anos), gestantes, adultos ≥ 65 anos, hipertensos, diabéticos, renais crônicos ou hepatopatas.',
    conduct:
      'Solicitação obrigatória de hemograma completo na urgência, início imediato da hidratação oral supervisionada em leito de observação até a avaliação do hematócrito e plaquetas.',
    hydration:
      'Hidratação oral supervisionada (60 mL/kg/dia) com reavaliação clínica e laboratorial diária até 48h após a queda da febre.',
    placeOfCare: 'Unidade de Atenção Primária com coleta laboratorial ou Pronto Atendimento.',
    accentColor: 'text-[#0F4C3A] border-[#0F4C3A]/30 bg-emerald-50/50',
  },
  C: {
    code: 'C',
    title: 'Grupo C — Presença de Sinais de Alarme (Janela Crítica do 3º ao 7º Dia)',
    subtitle: 'Classificação Amarela · Internação e Reposição Volêmica Venosa Imediata',
    criteria:
      'Presença de um ou mais Sinais de Alarme: dor abdominal intensa e contínua, vômitos persistentes, acúmulo de líquidos (ascite, derrame pleural/pericárdico), hipotensão postural/lipotímia, hepatomegalia > 2 cm, sangramento de mucosa, letargia ou aumento progressivo do hematócrito.',
    conduct:
      'Reposição volêmica endovenosa imediata com soro fisiológico 0,9% (10 mL/kg na primeira hora), exames laboratoriais seriados (hematócrito a cada 2h) e internação por no mínimo 48h de estabilização.',
    hydration:
      'Hidratação endovenosa imediata: 10 mL/kg/h de SF 0,9% na 1ª hora, ajustada segundo resposta clínica, diurese (≥ 1 mL/kg/h) e hematócrito.',
    placeOfCare: 'Unidade de Pronto Atendimento (UPA 24h) ou Leito de Internação Hospitalar.',
    accentColor: 'text-amber-900 border-amber-400 bg-amber-50/70',
  },
  D: {
    code: 'D',
    title: 'Grupo D — Dengue Grave (Extravasamento Plasmático Grave, Choque ou Disfunção Orgânica)',
    subtitle: 'Classificação Vermelha · Emergência Médica e Leito de Terapia Intensiva (UTI)',
    criteria:
      'Sinais de choque hipovolêmico (taquicardia, extremidades frias, pulso fino, enchimento capilar > 2 seg, convergência pressórica PA diferencial ≤ 20 mmHg ou hipotensão arterial), sangramento grave (hematêmese/melena) ou comprometimento grave de órgãos (miocardite, encefalite, hepatite grave).',
    conduct:
      'Expansão volêmica rápida em bolus com solução isotônica (20 mL/kg em até 20 minutos, repetida até 3 vezes se necessário), monitorização contínua e transferência para leito de UTI.',
    hydration:
      'Fase de expansão rápida endovenosa: 20 mL/kg de SF 0,9% ou Ringer Lactato em 20 minutos com reavaliação clínica a cada 15–30 minutos.',
    placeOfCare: 'Sala de Emergência (Sala Vermelha) e Unidade de Terapia Intensiva (UTI).',
    accentColor: 'text-red-900 border-red-300 bg-red-50/70',
  },
};

export default function App() {
  const [selectedRiskGroup, setSelectedRiskGroup] = useState<RiskGroupKey>('C');
  const [externalQueryCode, setExternalQueryCode] = useState<string>('');
  const [isDownloadingTop, setIsDownloadingTop] = useState<boolean>(false);

  const baseUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://ais-pre-wqkiqd65bdw2ofos2kj6ia-300212792132.us-west2.run.app';

  // Detecta leitura automática de QR Code via URL (?codigo=EMS-EXT-2024-1106#validador)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const codeParam =
      params.get('codigo') || params.get('code') || params.get('chave');
    if (codeParam) {
      setExternalQueryCode(codeParam);
      setTimeout(() => {
        const el = document.getElementById('validador');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 250);
    } else if (window.location.hash === '#validador') {
      setTimeout(() => {
        const el = document.getElementById('validador');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 250);
    }
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleVerifyFromCertificate = (code: string) => {
    setExternalQueryCode(code);
    scrollToSection('validador');
  };

  const handleQuickDownloadPdf = async () => {
    try {
      setIsDownloadingTop(true);
      await generateCertificate06Pdf(CERTIFICATE_06_DATA, baseUrl);
    } finally {
      setIsDownloadingTop(false);
    }
  };

  const activeRisk = RISK_GROUPS[selectedRiskGroup];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#18181B]">
      {/* =====================================================================
          TOP BAR CONTRACT (3 ZONAS ESTRITAS)
         ===================================================================== */}
      <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-stone-200/90 px-4 sm:px-8 py-3.5 no-print">
        <div className="max-w-[1320px] mx-auto flex items-center justify-between gap-8">
          {/* Zona 1: Brand Title (1 elemento de texto, linha única) */}
          <a
            href="#topo"
            className="font-display-academic text-base sm:text-lg font-bold tracking-tight text-[#0F4C3A] whitespace-nowrap shrink-0"
          >
            Extensão em Saúde · Arboviroses & SUS
          </a>

          {/* Zona 2: 5 Links de Navegação Concisos */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-600">
            <a
              href="#quiz-populacional"
              className="hover:text-[#0F4C3A] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Quiz da Dengue
            </a>
            <a
              href="#fato-ou-fake"
              className="hover:text-[#0F4C3A] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Fato ou Fake (Vacina SUS)
            </a>
            <a
              href="#simuladores-cidadao"
              className="hover:text-[#0F4C3A] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Simuladores Interativos
            </a>
            <a
              href="#certificado-06"
              className="hover:text-[#0F4C3A] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Certificado Nº 06 (PDF)
            </a>
            <a
              href="#validador"
              className="hover:text-[#0F4C3A] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Autenticador
            </a>
          </nav>

          {/* Zona 3: 1 Ação Principal */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={handleQuickDownloadPdf}
              disabled={isDownloadingTop}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0F4C3A] hover:bg-[#14634C] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-amber-300" />
              <span>
                {isDownloadingTop ? 'Gerando PDF...' : 'Baixar Certificado Nº 06'}
              </span>
            </button>
          </div>
        </div>
      </header>

      <main id="topo" className="flex-1">
        {/* ===================================================================
            HERO SECTION — APRESENTAÇÃO DA CAMPANHA E ACESSO AO CERTIFICADO 06
           =================================================================== */}
        <section className="relative bg-gradient-to-b from-[#0F4C3A] via-[#103E32] to-[#0C2E24] text-white border-b border-emerald-900 no-print">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-8 py-12 lg:py-16">
            {/* Metadados institucionais sem pílulas */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-200/90 font-mono-tabular mb-5">
              <span>PROGRAMA INTERINSTITUCIONAL DE EXTENSÃO (ITEM 08)</span>
              <span aria-hidden="true">·</span>
              <span>CERTIFICADO Nº 06</span>
              <span aria-hidden="true">·</span>
              <span>CÓDIGO OFICIAL: {CERTIFICATE_06_DATA.code}</span>
              <span aria-hidden="true">·</span>
              <span>NOVEMBRO DE 2024 (08 HORAS)</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
              {/* Coluna Principal Esquerda (7 cols) */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <h1 className="font-serif-editorial text-3xl sm:text-4xl lg:text-[44px] font-bold text-white leading-[1.12] tracking-tight text-balance">
                    Campanha Educativa Digital contra Arboviroses: Quiz Populacional sobre
                    Prevenção da Dengue e Conscientização sobre a Vacina no SUS
                  </h1>
                  <p className="text-base text-emerald-100/90 leading-relaxed max-w-2xl">
                    Plataforma pública interativa de educação comunitária em saúde,
                    inquérito epidemiológico digital (coleta de dados populacionais),
                    combate à desinformação vacinal e verificação de autenticidade
                    documental expedida em parceria pela{' '}
                    <strong className="text-white font-semibold">
                      Editora Mente e Saúde (CNPJ: 51.372.335/0001-71)
                    </strong>{' '}
                    e pelo{' '}
                    <strong className="text-white font-semibold">
                      Centro Profissionalizante Maria Dalva de Araújo (CNPJ: 51.269.112/0001-83)
                    </strong>
                    .
                  </p>
                </div>

                {/* Botões de Ação Interativos para a População e Avaliadores */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => scrollToSection('quiz-populacional')}
                    className="px-5 py-3 text-sm font-semibold text-[#111827] bg-[#F59E0B] hover:bg-[#FBBF24] rounded-lg shadow-sm transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>Responder Quiz de Prevenção da Dengue</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => scrollToSection('fato-ou-fake')}
                    className="px-4 py-3 text-sm font-semibold text-white bg-[#1B365D] hover:bg-[#244677] border border-blue-400/30 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
                  >
                    <Syringe className="w-4 h-4 text-amber-300" />
                    <span>Jogar Fato ou Fake (Vacina SUS)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => scrollToSection('certificado-06')}
                    className="px-4 py-3 text-sm font-medium text-emerald-100 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/70 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
                  >
                    <FileCheck2 className="w-4 h-4 text-amber-300" />
                    <span>Ver Certificado Nº 06 (PDF)</span>
                  </button>
                </div>

                {/* Rodapé de Identificação do Médico Extensionista */}
                <div className="pt-4 border-t border-emerald-800/80 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-emerald-100/90">
                  <div>
                    <span className="text-emerald-300/80">Profissional Extensionista: </span>
                    <strong className="text-white font-semibold">
                      Dr. Lucas Gonçalves Silveira
                    </strong>
                  </div>
                  <div className="font-mono-tabular">
                    <span className="text-emerald-300/80">CPF: </span>
                    <strong className="text-white">702.794.941-57</strong>
                  </div>
                  <div>
                    <span className="text-emerald-300/80">Instituição de Origem: </span>
                    <strong className="text-white">
                      Centro Universitário de Anápolis (UNIFAN)
                    </strong>
                  </div>
                </div>
              </div>

              {/* Coluna Direita (5 cols): Cartão de Fé Pública e Chancela Interinstitucional */}
              <div className="lg:col-span-5 bg-[#FAF9F6] text-stone-900 rounded-xl p-6 border border-stone-200 shadow-lg flex flex-col justify-between space-y-5">
                <div className="flex items-center justify-between gap-3 pb-4 border-b border-stone-200">
                  <div className="flex items-center gap-2.5">
                    <LogoEditoraMenteSaude className="w-12 h-12 shrink-0" />
                    <LogoCentroMariaDalva className="w-12 h-12 shrink-0" />
                  </div>
                  <div className="text-right font-mono-tabular">
                    <p className="text-xs font-bold text-[#0F4C3A]">
                      FÉ PÚBLICA INTERINSTITUCIONAL
                    </p>
                    <p className="text-[11px] text-stone-600">
                      Livro {CERTIFICATE_06_DATA.book} · Folha {CERTIFICATE_06_DATA.sheet}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#1B365D]">
                    Resumo da Ação Extensionista Certificada (Item 08)
                  </p>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    Ação extensionista fundamentada em <strong>Campanha Educativa</strong>,{' '}
                    <strong>Conscientização sobre Vacinação no SUS</strong> e{' '}
                    <strong>Coleta de Dados Populacionais</strong> via Quiz Digital Interativo,
                    100% compatível com o objeto social editorial e educacional das instituições
                    promotoras.
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-1 font-mono-tabular">
                    <div className="p-3 rounded-lg bg-white border border-stone-200">
                      <span className="text-[10px] text-stone-500 block">CÓDIGO OFICIAL</span>
                      <strong className="text-xs text-[#0F4C3A]">
                        {CERTIFICATE_06_DATA.code}
                      </strong>
                    </div>
                    <div className="p-3 rounded-lg bg-white border border-stone-200">
                      <span className="text-[10px] text-stone-500 block">CHAVE DE CONTROLE</span>
                      <strong className="text-xs text-[#1B365D]">
                        {CERTIFICATE_06_DATA.controlKey}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-200 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => scrollToSection('validador')}
                    className="text-xs font-semibold text-[#1B365D] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Validar Autenticidade</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleQuickDownloadPdf}
                    className="text-xs font-semibold text-[#0F4C3A] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar PDF (2 Laudas)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Faixa de Indicadores Quantitativos da Campanha */}
            <div className="mt-10 pt-8 border-t border-emerald-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono-tabular">
              <div className="bg-emerald-950/50 border border-emerald-800/70 rounded-xl p-4">
                <p className="text-xs text-emerald-300">AMOSTRA DO QUIZ POPULACIONAL</p>
                <p className="text-2xl font-bold text-white mt-1">1.428 respondentes</p>
                <p className="text-[11px] text-emerald-200/80 mt-0.5 font-sans">
                  Coleta de dados populacionais realizada em Nov/2024
                </p>
              </div>
              <div className="bg-emerald-950/50 border border-emerald-800/70 rounded-xl p-4">
                <p className="text-xs text-emerald-300">CARGA HORÁRIA CERTIFICADA</p>
                <p className="text-2xl font-bold text-amber-300 mt-1">08 horas (4 Eixos)</p>
                <p className="text-[11px] text-emerald-200/80 mt-0.5 font-sans">
                  02h por eixo metodológico detalhado no verso
                </p>
              </div>
              <div className="bg-emerald-950/50 border border-emerald-800/70 rounded-xl p-4">
                <p className="text-xs text-emerald-300">PÚBLICO-ALVO VACINA SUS (PNI)</p>
                <p className="text-2xl font-bold text-white mt-1">10 a 14 anos</p>
                <p className="text-[11px] text-emerald-200/80 mt-0.5 font-sans">
                  Esquema de 2 doses (intervalo de 90 dias · QDenga)
                </p>
              </div>
              <div className="bg-emerald-950/50 border border-emerald-800/70 rounded-xl p-4">
                <p className="text-xs text-emerald-300">FOLHETOS DIGITAIS ENTREGUES</p>
                <p className="text-2xl font-bold text-white mt-1">100% gratuito</p>
                <p className="text-[11px] text-emerald-200/80 mt-0.5 font-sans">
                  Sinais de alarme, hidratação e Meu SUS Digital
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            SEÇÃO 1 — QUIZ POPULACIONAL SOBRE PREVENÇÃO DA DENGUE E VACINA NO SUS
           =================================================================== */}
        <section
          id="quiz-populacional"
          className="max-w-[1320px] mx-auto px-4 sm:px-8 pt-12 lg:pt-16 pb-8 scroll-mt-16 no-print"
        >
          <PopulationQuizSection />
        </section>

        {/* ===================================================================
            SEÇÃO 2 — DESAFIO INTERATIVO "FATO OU FAKE" (VACINA NO SUS & DENGUE)
           =================================================================== */}
        <section
          id="fato-ou-fake"
          className="max-w-[1320px] mx-auto px-4 sm:px-8 py-8 scroll-mt-16 no-print"
        >
          <FactOrFakeInteractiveSection />
        </section>

        {/* ===================================================================
            SEÇÃO 3 — SIMULADORES PRÁTICOS PARA A POPULAÇÃO:
            10 MINUTOS CONTRA A DENGUE, ELEGIBILIDADE VACINAL E HIDRATAÇÃO
           =================================================================== */}
        <section
          id="simuladores-cidadao"
          className="max-w-[1320px] mx-auto px-4 sm:px-8 py-8 scroll-mt-16 no-print"
        >
          <CitizenInteractiveSimulators />
        </section>

        {/* ===================================================================
            SEÇÃO 4 — CERTIFICADO Nº 06 VISÍVEL EM ESTILO PDF + DOWNLOAD DIRETO
           =================================================================== */}
        <section
          id="certificado-06"
          className="max-w-[1320px] mx-auto px-4 sm:px-8 py-12 lg:py-16 scroll-mt-16"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 no-print">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono-tabular text-[#0F4C3A] font-semibold">
                <span>DOCUMENTO OFICIAL Nº 06 · PADRÃO A4 PAISAGEM (FRENTE E VERSO)</span>
                <span>·</span>
                <span>CÓDIGO: {CERTIFICATE_06_DATA.code}</span>
              </div>
              <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
                Certificado de Atividade de Extensão Nº 06 (Frente e Verso Acessível)
              </h2>
              <p className="text-sm text-stone-600 mt-1 max-w-3xl">
                Visualize abaixo as 2 laudas oficiais do <strong>Certificado Nº 06</strong> com
                logotipos e assinaturas originais em fundo transparente, alinhamento simétrico e
                QR Code integrado ao validador deste portal.
              </p>
            </div>
          </div>

          <CertificateViewer
            certificate={CERTIFICATE_06_DATA}
            onVerifyClick={handleVerifyFromCertificate}
          />
        </section>

        {/* ===================================================================
            SEÇÃO 5 — SISTEMA AUTENTICADOR PÚBLICO (#validador)
           =================================================================== */}
        <section
          id="validador"
          className="max-w-[1320px] mx-auto px-4 sm:px-8 py-8 lg:py-12 scroll-mt-16 no-print"
        >
          <PublicAuthenticator
            certificate={CERTIFICATE_06_DATA}
            externalQueryCode={externalQueryCode}
            onScrollToCertificate={() => scrollToSection('certificado-06')}
          />
        </section>

        {/* ===================================================================
            SEÇÃO 6 — DIRETRIZES CIENTÍFICAS DA CAMPANHA:
            CONTROLE VETORIAL, CLASSIFICAÇÃO DE RISCO E VACINA QDENGA NO SUS
           =================================================================== */}
        <section
          id="campanha"
          className="bg-white border-t border-stone-200/90 py-14 lg:py-20 scroll-mt-16 no-print"
        >
          <div className="max-w-[1320px] mx-auto px-4 sm:px-8 space-y-12">
            {/* Cabeçalho Editorial da Campanha */}
            <div className="max-w-3xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono-tabular text-[#0F4C3A] font-semibold">
                <span>MEMÓRIA TÉCNICA E DIRETRIZES CLÍNICAS DA CAMPANHA</span>
                <span>·</span>
                <span>MINISTÉRIO DA SAÚDE, PNI & FIOCRUZ</span>
              </div>
              <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-stone-900 leading-tight">
                Fundamentação Científica: Prevenção das Arboviroses, Manejo Clínico e Vacinação no SUS
              </h2>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                A ação extensionista conduzida pelo médico <strong>Lucas Gonçalves Silveira</strong>{' '}
                reuniu diretrizes atualizadas do Ministério da Saúde e do Programa Nacional de
                Imunizações (PNI) para orientar a comunidade no controle do{' '}
                <em>Aedes aegypti</em>, na identificação precoce dos sinais de alarme e na adesão
                ao esquema vacinal completo no SUS.
              </p>
            </div>

            {/* Painel dos 3 Pilares do Controle Vetorial */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-[#FAF9F6] border border-stone-200/90 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono-tabular font-bold text-[#0F4C3A]">
                    01. BIOLOGIA DO VETOR
                  </span>
                  <ClipboardCheck className="w-5 h-5 text-[#0F4C3A]" />
                </div>
                <h3 className="text-lg font-bold text-stone-900">
                  Ciclo de 7 a 10 Dias e Vistoria Semanal
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  O desenvolvimento do <em>Aedes aegypti</em> (ovo → larva → pupa → mosquito alado)
                  leva de 7 a 10 dias em temperaturas quentes. Por isso, uma vistoria doméstica
                  de apenas <strong>10 minutos uma vez por semana</strong> interrompe o ciclo antes
                  que novos mosquitos adultos voem.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#FAF9F6] border border-stone-200/90 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono-tabular font-bold text-[#1B365D]">
                    02. RESISTÊNCIA DOS OVOS
                  </span>
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="text-lg font-bold text-stone-900">
                  Escovação Mecânica de Bordas e Recipientes
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Os ovos da fêmea são depositados milímetros acima da lâmina d&apos;água e
                  resistem por até <strong>450 dias no seco</strong>. Apenas esvaziar pratinhos ou
                  bebedouros não elimina o risco: é indispensável escovar as paredes internas com
                  bucha e sabão.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#FAF9F6] border border-stone-200/90 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono-tabular font-bold text-[#0F4C3A]">
                    03. PROTEÇÃO ARBOVIRAL TRIPLA
                  </span>
                  <HeartPulse className="w-5 h-5 text-[#0F4C3A]" />
                </div>
                <h3 className="text-lg font-bold text-stone-900">
                  Barreira Simultânea contra Dengue, Zika e Chikungunya
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  O controle físico de criadouros intradomiciliares (ralos pouco usados, bandejas
                  traseiras de geladeira, calhas e caixas d&apos;água) reduz simultaneamente a
                  transmissão dos 4 sorotipos da Dengue (DENV 1–4), Zika e febre Chikungunya.
                </p>
              </div>
            </div>

            {/* Matriz Interativa de Classificação de Risco e Sinais de Alarme (Grupos A, B, C e D do MS) */}
            <div className="bg-[#FAF9F6] border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-stone-200">
                <div>
                  <p className="text-xs font-mono-tabular font-bold text-[#1B365D] uppercase">
                    PROTOCOLO DO MINISTÉRIO DA SAÚDE · ESTADIAMENTO CLÍNICO E CONDUTA
                  </p>
                  <h3 className="font-serif-editorial text-2xl font-bold text-stone-900 mt-1">
                    Matriz Interativa de Classificação de Risco na Dengue (Grupos A, B, C e D)
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 bg-stone-200/80 p-1.5 rounded-xl">
                  {(['A', 'B', 'C', 'D'] as RiskGroupKey[]).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedRiskGroup(key)}
                      className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                        selectedRiskGroup === key
                          ? 'bg-[#0F4C3A] text-white shadow-xs'
                          : 'text-stone-700 hover:text-stone-950 hover:bg-white/60'
                      }`}
                    >
                      Grupo {key}{' '}
                      {key === 'C'
                        ? '(Sinais de Alarme)'
                        : key === 'D'
                          ? '(Dengue Grave)'
                          : ''}
                    </button>
                  ))}
                </div>
              </div>

              <div
                className={`p-6 rounded-xl border ${activeRisk.accentColor} space-y-4 transition-all`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-mono-tabular font-bold uppercase opacity-80">
                      {activeRisk.subtitle}
                    </p>
                    <h4 className="text-lg sm:text-xl font-bold text-stone-950 mt-0.5">
                      {activeRisk.title}
                    </h4>
                  </div>
                  <span className="text-xs font-mono-tabular font-bold px-3 py-1 rounded bg-white/80 border border-stone-300 text-stone-900">
                    Unidade de Referência: {activeRisk.placeOfCare}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="bg-white/90 p-4 rounded-lg border border-stone-200/80">
                    <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                      Critérios Clínicos de Identificação
                    </p>
                    <p className="text-xs sm:text-sm text-stone-800 leading-relaxed">
                      {activeRisk.criteria}
                    </p>
                  </div>

                  <div className="bg-white/90 p-4 rounded-lg border border-stone-200/80">
                    <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                      Conduta Médica e Assistencial no SUS
                    </p>
                    <p className="text-xs sm:text-sm text-stone-800 leading-relaxed">
                      {activeRisk.conduct}
                    </p>
                  </div>

                  <div className="bg-white/90 p-4 rounded-lg border border-stone-200/80">
                    <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                      Protocolo de Hidratação Precoce
                    </p>
                    <p className="text-xs sm:text-sm text-stone-800 leading-relaxed">
                      {activeRisk.hydration}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bloco Informativo da Vacina QDenga no SUS */}
            <div className="bg-gradient-to-br from-[#1B365D] to-[#102340] text-white rounded-2xl p-6 sm:p-10 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono-tabular text-sky-200">
                    <Syringe className="w-4 h-4 text-amber-300" />
                    <span>PROGRAMA NACIONAL DE IMUNIZAÇÕES (PNI / MINISTÉRIO DA SAÚDE)</span>
                  </div>
                  <h3 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-white leading-tight">
                    Diretrizes Oficiais da Vacina contra a Dengue no SUS (QDenga / TAK-003)
                  </h3>
                  <p className="text-sm sm:text-base text-sky-100/90 leading-relaxed">
                    O Brasil tornou-se o primeiro país do mundo a ofertar gratuitamente a vacina
                    tetravalente contra a Dengue no sistema público de saúde. Na campanha educativa,
                    orientamos pais, responsáveis e escolares sobre os critérios oficiais do PNI,
                    evitando faltas na segunda dose e combatendo a desinformação.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="bg-white/10 border border-white/15 rounded-xl p-4">
                      <p className="text-xs font-mono-tabular text-amber-300 font-bold">
                        FAIXA ETÁRIA PRIORITÁRIA NO SUS
                      </p>
                      <p className="text-lg font-bold text-white mt-1">
                        Crianças e Adolescentes de 10 a 14 anos
                      </p>
                      <p className="text-xs text-sky-100/80 mt-1">
                        Definida pela Câmara Técnica de Assessoramento em Imunizações (CTAI) por
                        concentrar alta taxa de hospitalização.
                      </p>
                    </div>

                    <div className="bg-white/10 border border-white/15 rounded-xl p-4">
                      <p className="text-xs font-mono-tabular text-amber-300 font-bold">
                        ESQUEMA VACINAL OBRIGATÓRIO
                      </p>
                      <p className="text-lg font-bold text-white mt-1">
                        2 Doses (Intervalo de 3 Meses / 90 Dias)
                      </p>
                      <p className="text-xs text-sky-100/80 mt-1">
                        Proteção contra os 4 sorotipos (DENV-1, DENV-2, DENV-3 e DENV-4), indicada
                        para quem já teve ou nunca teve dengue.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-white text-stone-900 rounded-xl p-6 space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-stone-200">
                    <Smartphone className="w-5 h-5 text-[#1B365D]" />
                    <div>
                      <h4 className="text-sm font-bold text-stone-900">
                        Diretrizes PNI & Aplicativo Meu SUS Digital
                      </h4>
                      <p className="text-xs text-stone-500">
                        Orientações técnicas divulgadas nos folhetos comunitários
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-3 text-xs text-stone-700 leading-relaxed">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#0F4C3A] shrink-0 mt-0.5" />
                      <span>
                        <strong>Intervalo após episódio agudo de Dengue:</strong> Caso o adolescente
                        tenha tido diagnóstico recente de dengue, deve aguardar{' '}
                        <strong>6 meses</strong> para iniciar ou completar o esquema vacinal.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Contraindicações formais (vírus vivo atenuado):</strong> Gestantes,
                        mulheres amamentando (lactantes), pessoas com imunodeficiência congênita ou
                        adquirida e indivíduos em terapia imunossupressora.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <BookOpen className="w-4 h-4 text-[#1B365D] shrink-0 mt-0.5" />
                      <span>
                        <strong>Acompanhamento no Meu SUS Digital:</strong> Todas as doses aplicadas
                        nas Unidades Básicas de Saúde (UBS) integram a Rede Nacional de Dados em
                        Saúde (RNDS), emitindo alerta da 2ª dose na Carteira Digital.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================================
          FOOTER INSTITUCIONAL
         ===================================================================== */}
      <footer className="bg-[#0C1D17] text-stone-300 border-t border-emerald-950 py-10 px-4 sm:px-8 no-print">
        <div className="max-w-[1320px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <LogoEditoraMenteSaude className="w-12 h-12 shrink-0" />
            <LogoCentroMariaDalva className="w-12 h-12 shrink-0" />
            <div className="text-xs space-y-1">
              <p className="font-bold text-white">
                Programa Interinstitucional de Extensão, Comunicação Científica e Educação em Saúde
              </p>
              <p className="text-stone-400 font-mono-tabular">
                Editora Mente e Saúde (CNPJ: 51.372.335/0001-71) · Centro Profissionalizante Maria
                Dalva de Araújo (CNPJ: 51.269.112/0001-83)
              </p>
            </div>
          </div>

          <div className="text-xs text-stone-400 font-mono-tabular md:text-right space-y-1">
            <p className="text-stone-200 font-semibold">
              Certificado Oficial Nº 06 · Cód. {CERTIFICATE_06_DATA.code}
            </p>
            <p>
              Chave de Controle: {CERTIFICATE_06_DATA.controlKey} · Livro{' '}
              {CERTIFICATE_06_DATA.book}, Folha {CERTIFICATE_06_DATA.sheet}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
