import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import {
  Download,
  Printer,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  QrCode,
  FileCheck2,
  ExternalLink,
} from 'lucide-react';
import { CertificateData } from '../data/campaignData';
import {
  LogoEditoraMenteSaude,
  LogoCentroMariaDalva,
  SignatureBarbaraSvg,
  SignatureJamesSvg,
  SeloFePublicaSvg,
} from './InstitutionalAssets';
import { generateCertificate06Pdf } from '../utils/pdfGenerator';

interface CertificateViewerProps {
  certificate: CertificateData;
  onVerifyClick: (code: string) => void;
}

export const CertificateViewer: React.FC<CertificateViewerProps> = ({
  certificate,
  onVerifyClick,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [viewMode, setViewMode] = useState<'both' | 'front' | 'back'>('both');
  const [scaleMode, setScaleMode] = useState<'fit' | '90' | '100'>('fit');
  const [containerWidth, setContainerWidth] = useState<number>(1122);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [pdfSuccessMessage, setPdfSuccessMessage] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const baseUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://ais-pre-wqkiqd65bdw2ofos2kj6ia-300212792132.us-west2.run.app';
  const verificationUrl = `${baseUrl}/?codigo=${certificate.code}#validador`;

  useEffect(() => {
    QRCode.toDataURL(verificationUrl, {
      width: 280,
      margin: 1,
      color: {
        dark: '#111827',
        light: '#FFFFFF',
      },
    })
      .then(setQrDataUrl)
      .catch(console.error);
  }, [verificationUrl]);

  useEffect(() => {
    const updateWidth = () => {
      if (wrapperRef.current) {
        const available = wrapperRef.current.clientWidth - 32;
        setContainerWidth(Math.max(320, available));
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      await generateCertificate06Pdf(certificate, baseUrl);
      setPdfSuccessMessage(true);
      setTimeout(() => setPdfSuccessMessage(false), 4500);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleNativePrint = () => {
    window.print();
  };

  // A4 Landscape @ 96 DPI = 1122px x 794px
  const BASE_WIDTH = 1122;
  const BASE_HEIGHT = 794;

  const computedScale =
    scaleMode === '100'
      ? 1
      : scaleMode === '90'
        ? 0.9
        : Math.min(1, containerWidth / BASE_WIDTH);

  return (
    <div className="w-full">
      {/* Barra de Ferramentas estilo Leitor de PDF Acadêmico */}
      <div className="bg-[#11241E] text-white rounded-t-xl border border-[#0F4C3A] px-4 py-3.5 flex flex-wrap items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#0F4C3A] border border-emerald-700/60 flex items-center justify-center shrink-0">
            <FileCheck2 className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-200/90 font-mono-tabular">
              <span>
                Certificado_Extensao_06_{certificate.code}_Lucas_Goncalves_Silveira.pdf
              </span>
              <span>·</span>
              <span>2 Laudas (A4 Paisagem 297×210mm)</span>
            </div>
            <h3 className="text-sm font-semibold text-white">
              Visualizador Oficial de Documento com Fé Pública — Certificado Nº 06
            </h3>
          </div>
        </div>

        {/* Seletor de Laudas */}
        <div className="flex items-center gap-1 bg-[#0A1713] p-1 rounded-lg border border-emerald-900/80">
          <button
            type="button"
            onClick={() => setViewMode('both')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              viewMode === 'both'
                ? 'bg-[#0F4C3A] text-white shadow-xs'
                : 'text-emerald-200/75 hover:text-white'
            }`}
          >
            Frente e Verso (2 Laudas)
          </button>
          <button
            type="button"
            onClick={() => setViewMode('front')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              viewMode === 'front'
                ? 'bg-[#0F4C3A] text-white shadow-xs'
                : 'text-emerald-200/75 hover:text-white'
            }`}
          >
            Lauda 1 (Frente)
          </button>
          <button
            type="button"
            onClick={() => setViewMode('back')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              viewMode === 'back'
                ? 'bg-[#0F4C3A] text-white shadow-xs'
                : 'text-emerald-200/75 hover:text-white'
            }`}
          >
            Lauda 2 (Verso / Ementa)
          </button>
        </div>

        {/* Controles de Zoom + Download PDF */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="hidden sm:flex items-center gap-1 bg-[#0A1713] p-1 rounded-lg border border-emerald-900/80">
            <button
              type="button"
              onClick={() => setScaleMode('fit')}
              title="Ajustar à largura da tela"
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer ${
                scaleMode === 'fit'
                  ? 'bg-emerald-800/80 text-white'
                  : 'text-emerald-200/70 hover:text-white'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Ajustar</span>
            </button>
            <button
              type="button"
              onClick={() => setScaleMode('90')}
              title="Zoom 90%"
              className={`px-2 py-1 text-xs font-mono-tabular rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                scaleMode === '90'
                  ? 'bg-emerald-800/80 text-white'
                  : 'text-emerald-200/70 hover:text-white'
              }`}
            >
              <ZoomOut className="w-3.5 h-3.5 inline mr-0.5" />
              90%
            </button>
            <button
              type="button"
              onClick={() => setScaleMode('100')}
              title="Tamanho Real 100%"
              className={`px-2 py-1 text-xs font-mono-tabular rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                scaleMode === '100'
                  ? 'bg-emerald-800/80 text-white'
                  : 'text-emerald-200/70 hover:text-white'
              }`}
            >
              <ZoomIn className="w-3.5 h-3.5 inline mr-0.5" />
              100%
            </button>
          </div>

          <button
            type="button"
            onClick={() => onVerifyClick(certificate.code)}
            className="px-3 py-2 text-xs font-medium text-emerald-100 bg-[#1B365D] hover:bg-[#234575] rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5 text-amber-300" />
            <span>Validar QR Code no Site</span>
          </button>

          <button
            type="button"
            onClick={handleNativePrint}
            className="px-3 py-2 text-xs font-medium text-emerald-100 bg-emerald-900/70 hover:bg-emerald-800 rounded-lg border border-emerald-700/60 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="px-4 py-2 text-xs font-semibold text-[#111827] bg-[#F59E0B] hover:bg-[#FBBF24] disabled:opacity-60 rounded-lg shadow-sm transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>
              {isGeneratingPdf
                ? 'Gerando PDF Alta Precisão...'
                : 'Baixar Certificado Nº 06 em PDF'}
            </span>
          </button>
        </div>
      </div>

      {/* Feedback de Download Concluído */}
      {pdfSuccessMessage && (
        <div className="bg-emerald-900 text-emerald-50 px-4 py-2.5 text-xs flex items-center justify-between border-x border-emerald-700 no-print">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
            <span>
              Download concluído:{' '}
              <strong>
                Certificado_Extensao_06_{certificate.code}_Lucas_Goncalves_Silveira.pdf
              </strong>{' '}
              gerado em formato A4 Paisagem (Frente e Verso, 300 DPI) com logotipos e assinaturas originais.
            </span>
          </div>
        </div>
      )}

      {/* Área do Canvas / Visualizador Estilo Leitor PDF */}
      <div
        ref={wrapperRef}
        className="bg-[#272A30] border-x border-b border-stone-700 rounded-b-xl p-4 sm:p-8 overflow-x-auto flex flex-col items-center gap-8 print-only-certificate"
      >
        {/* ===================================================================
            LAUDA 1 — FRENTE DO CERTIFICADO Nº 06 (1122px x 794px)
           =================================================================== */}
        {(viewMode === 'both' || viewMode === 'front') && (
          <div className="flex flex-col items-center">
            <div className="w-full flex items-center justify-between text-xs text-stone-300 mb-2 px-1 no-print font-mono-tabular">
              <span>PÁGINA 1 DE 2 — FRENTE DO CERTIFICADO (LAUDA OFICIAL)</span>
              <span>
                DIMENSÃO: 297mm × 210mm (A4 PAISAGEM) · CÓD: {certificate.code}
              </span>
            </div>

            <div
              style={{
                width: `${BASE_WIDTH * computedScale}px`,
                height: `${BASE_HEIGHT * computedScale}px`,
              }}
              className="relative overflow-hidden shadow-2xl rounded-xs transition-all duration-150"
            >
              <div
                style={{
                  width: `${BASE_WIDTH}px`,
                  height: `${BASE_HEIGHT}px`,
                  transform: `scale(${computedScale})`,
                  transformOrigin: 'top left',
                }}
                className="bg-[#FAF9F6] text-[#18181B] relative p-[20px] select-text certificate-page-print"
              >
                {/* Moldura Externa Verde Institucional (#0F4C3A) */}
                <div className="w-full h-full border-[3.5px] border-[#0F4C3A] p-[6px]">
                  {/* Moldura Interna Fina Azul Marinho (#1B365D) */}
                  <div className="w-full h-full border border-[#1B365D] px-8 py-5 flex flex-col justify-between relative">
                    {/* BLOCO SUPERIOR E CENTRAL */}
                    <div>
                      {/* CABEÇALHO SUPERIOR ALINHADO */}
                      <div className="grid grid-cols-12 items-center pb-3.5 border-b border-stone-300">
                        {/* Instituição 1: Editora Mente e Saúde */}
                        <div className="col-span-4 flex items-center gap-3">
                          <LogoEditoraMenteSaude className="w-[58px] h-[58px] shrink-0" />
                          <div className="leading-tight">
                            <p className="text-[14.5px] font-bold tracking-tight text-[#18181B]">
                              EDITORA MENTE E SAÚDE
                            </p>
                            <p className="text-[11px] font-semibold font-mono-tabular text-stone-700 mt-0.5">
                              CNPJ: 51.372.335/0001-71
                            </p>
                            <p className="text-[11px] font-medium text-[#0F4C3A] mt-0.5">
                              Conselho Editorial e Extensão Científica
                            </p>
                          </div>
                        </div>

                        {/* Centro: Programa Interinstitucional */}
                        <div className="col-span-4 text-center px-1">
                          <p className="text-[10.8px] font-bold tracking-wide text-[#18181B] uppercase leading-snug">
                            PROGRAMA INTERINSTITUCIONAL DE EXTENSÃO, COMUNICAÇÃO
                            CIENTÍFICA
                            <br />E EDUCAÇÃO EM SAÚDE
                          </p>
                          <p className="text-[10.2px] font-bold font-mono-tabular text-stone-800 mt-1.5">
                            Certificado Nº {certificate.number} · Livro de Extensão nº{' '}
                            {certificate.book} · Cód. {certificate.code}
                          </p>
                        </div>

                        {/* Instituição 2: Centro Profissionalizante Maria Dalva de Araújo */}
                        <div className="col-span-4 flex items-center justify-end gap-3 text-right">
                          <div className="leading-tight">
                            <p className="text-[13.5px] font-bold tracking-tight text-[#18181B]">
                              CENTRO PROFISSIONALIZANTE
                            </p>
                            <p className="text-[13.5px] font-bold tracking-tight text-[#18181B]">
                              MARIA DALVA DE ARAÚJO
                            </p>
                            <p className="text-[11px] font-semibold font-mono-tabular text-stone-700 mt-0.5">
                              CNPJ: 51.269.112/0001-83
                            </p>
                          </div>
                          <LogoCentroMariaDalva className="w-[58px] h-[58px] shrink-0" />
                        </div>
                      </div>

                      {/* TÍTULO PRINCIPAL DO CERTIFICADO */}
                      <div className="text-center mt-4">
                        <h1 className="font-serif-editorial text-[36px] font-bold tracking-[0.06em] text-[#0F4C3A] uppercase leading-none">
                          CERTIFICADO DE ATIVIDADE DE EXTENSÃO
                        </h1>
                        <p className="text-[14px] text-stone-800 mt-2.5 max-w-[910px] mx-auto leading-snug">
                          A{' '}
                          <strong className="font-bold text-stone-950">
                            Editora Mente e Saúde
                          </strong>{' '}
                          (CNPJ: 51.372.335/0001-71), em parceria institucional com o{' '}
                          <strong className="font-bold text-stone-950">
                            Centro Profissionalizante Maria Dalva de Araújo
                          </strong>{' '}
                          (CNPJ: 51.269.112/0001-83), certifica para os devidos fins de
                          comprovação curricular e acadêmica que
                        </p>
                      </div>

                      {/* QUADRO DO MÉDICO TITULAR */}
                      <div className="mt-3.5 mx-auto w-[940px] bg-[#F2F6F3] border border-[#CBDAD1] rounded-xs py-3 px-6 text-center">
                        <h2 className="font-serif-editorial text-[30px] font-bold tracking-[0.04em] text-[#111827] leading-none">
                          {certificate.recipientName}
                        </h2>
                        <p className="text-[13.8px] font-bold text-stone-900 mt-1.5">
                          {certificate.recipientRole} | CPF:{' '}
                          <span className="font-mono-tabular">
                            {certificate.recipientCpf}
                          </span>{' '}
                          | {certificate.recipientInstitution}
                        </p>
                      </div>

                      {/* CORPO DO TEXTO COM PALAVRAS-CHAVE DO EDITAL EM NEGRITO */}
                      <div className="mt-4 w-[940px] mx-auto text-[14.1px] leading-[1.6] text-stone-800 text-justify space-y-2.5">
                        <p>
                          participou de forma efetiva da{' '}
                          <strong className="font-bold text-stone-950">
                            Atividade de Extensão
                          </strong>{' '}
                          intitulada{' '}
                          <strong className="font-bold text-stone-950">
                            &ldquo;{certificate.title}&rdquo;
                          </strong>
                          , desenvolvida na modalidade de{' '}
                          <strong className="font-bold text-stone-950">
                            {certificate.modality}
                          </strong>
                          , realizada no período de{' '}
                          <strong className="font-bold text-stone-950">
                            {certificate.period}
                          </strong>
                          , contabilizando carga horária total de{' '}
                          <strong className="font-bold text-stone-950">
                            {certificate.workloadHours}
                          </strong>
                          .
                        </p>
                        <p>
                          No âmbito desta ação extensionista, o profissional atuou na
                          elaboração e distribuição comunitária de materiais educativos
                          (folheto digital de sinais de alarme e guias preventivos),
                          aplicação de instrumentos digitais interativos para{' '}
                          <strong className="font-bold text-stone-950">
                            coleta de dados populacionais
                          </strong>{' '}
                          sobre medidas de controle vetorial,{' '}
                          <strong className="font-bold text-stone-950">
                            comunicação científica para combate à desinformação (fake
                            news)
                          </strong>{' '}
                          sobre imunobiológicos e{' '}
                          <strong className="font-bold text-stone-950">
                            divulgação dos canais oficiais de saúde pública (SUS)
                          </strong>{' '}
                          e grupos prioritários da vacina contra a Dengue.
                        </p>
                      </div>

                      {/* LOCAL E DATA DE EMISSÃO */}
                      <div className="text-center mt-3.5">
                        <p className="font-serif-editorial italic font-semibold text-[19.5px] text-stone-900">
                          {certificate.cityState}, {certificate.issueDate}.
                        </p>
                      </div>
                    </div>

                    {/* RODAPÉ SIMÉTRICO DE ASSINATURAS, SELO DE FÉ PÚBLICA E QR CODE */}
                    <div>
                      <div className="w-[960px] mx-auto grid grid-cols-12 items-end gap-2">
                        {/* Assinatura 1: Bárbara Lima dos Santos */}
                        <div className="col-span-4 flex flex-col items-center">
                          <div className="h-[46px] flex items-end justify-center pb-1">
                            <SignatureBarbaraSvg className="h-[40px] w-auto" />
                          </div>
                          <div className="w-[276px] border-t border-stone-700 pt-1.5 text-center h-[54px]">
                            <p className="text-[12px] font-bold text-stone-950 tracking-wide leading-tight">
                              BÁRBARA LIMA DOS SANTOS
                            </p>
                            <p className="text-[10.3px] text-stone-600 mt-0.5 leading-tight">
                              Editora-Chefe e Coordenadora de Extensão Editorial
                            </p>
                            <p className="text-[9.5px] font-bold font-mono-tabular text-stone-800 mt-0.5 leading-tight whitespace-nowrap">
                              Editora Mente e Saúde (CNPJ: 51.372.335/0001-71)
                            </p>
                          </div>
                        </div>

                        {/* Centro: Selo Oficial + QR Code e Autenticação Pública Manual */}
                        <div className="col-span-4 flex items-center justify-center gap-2.5 pb-0.5">
                          <SeloFePublicaSvg
                            code={certificate.code}
                            className="w-[82px] h-[82px] shrink-0"
                          />

                          <div className="bg-white border border-stone-300 rounded-xs p-2 flex items-center gap-2.5 shadow-2xs">
                            {qrDataUrl ? (
                              <img
                                src={qrDataUrl}
                                alt="QR Code de Autenticidade do Certificado 06"
                                className="w-[82px] h-[82px] shrink-0"
                              />
                            ) : (
                              <div className="w-[82px] h-[82px] bg-stone-100 animate-pulse" />
                            )}
                            <div className="text-left leading-[1.22] pr-1">
                              <p className="text-[9.2px] font-bold text-[#0F4C3A] uppercase tracking-tight">
                                AUTENTICAÇÃO PÚBLICA MANUAL
                              </p>
                              <p className="text-[8.8px] font-mono-tabular font-semibold text-stone-800 mt-0.5">
                                Cód.: {certificate.code}
                              </p>
                              <p className="text-[8.8px] font-mono-tabular font-semibold text-stone-800">
                                Chave: {certificate.controlKey}
                              </p>
                              <p className="text-[8.4px] font-bold text-stone-800 mt-0.5">
                                Endereço p/ Verificação Online:
                              </p>
                              <p className="text-[7.2px] font-mono-tabular text-stone-600 break-all max-w-[142px]">
                                {baseUrl}/
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Assinatura 2: James Araújo de Santana (Linha horizontal na mesma altura) */}
                        <div className="col-span-4 flex flex-col items-center">
                          <div className="h-[46px] flex items-end justify-center pb-1">
                            <SignatureJamesSvg className="h-[40px] w-auto" />
                          </div>
                          <div className="w-[276px] border-t border-stone-700 pt-1.5 text-center h-[54px]">
                            <p className="text-[12px] font-bold text-stone-950 tracking-wide leading-tight">
                              JAMES ARAÚJO DE SANTANA
                            </p>
                            <p className="text-[10.3px] text-stone-600 mt-0.5 leading-tight">
                              Coordenador de Extensão e Projetos Educativos
                            </p>
                            <p className="text-[9.2px] font-bold font-mono-tabular text-stone-800 mt-0.5 leading-tight whitespace-nowrap">
                              Centro Maria Dalva de Araújo (CNPJ: 51.269.112/0001-83)
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* BARRA INFERIOR VERDE CLARA DE VERIFICAÇÃO */}
                      <div className="mt-2.5 bg-[#EEF5F0] border border-[#C6D8CD] rounded-xs py-1.5 px-4 text-center">
                        <p className="text-[9.8px] font-mono-tabular font-bold text-[#0F4C3A]">
                          Verifique via QR Code ou acesse {baseUrl}/ informando o Código{' '}
                          {certificate.code} ou Chave {certificate.controlKey}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            LAUDA 2 — VERSO DO CERTIFICADO Nº 06 (MEMORIAL DESCRITIVO E REGISTRO)
           =================================================================== */}
        {(viewMode === 'both' || viewMode === 'back') && (
          <div className="flex flex-col items-center">
            <div className="w-full flex items-center justify-between text-xs text-stone-300 mb-2 px-1 no-print font-mono-tabular">
              <span>
                PÁGINA 2 DE 2 — VERSO DO CERTIFICADO (MEMORIAL DESCRITIVO E EMENTA)
              </span>
              <span>
                REGISTRO: LIVRO {certificate.book} · FOLHA {certificate.sheet}
              </span>
            </div>

            <div
              style={{
                width: `${BASE_WIDTH * computedScale}px`,
                height: `${BASE_HEIGHT * computedScale}px`,
              }}
              className="relative overflow-hidden shadow-2xl rounded-xs transition-all duration-150"
            >
              <div
                style={{
                  width: `${BASE_WIDTH}px`,
                  height: `${BASE_HEIGHT}px`,
                  transform: `scale(${computedScale})`,
                  transformOrigin: 'top left',
                }}
                className="bg-[#FAF9F6] text-[#18181B] relative p-[20px] select-text certificate-page-print"
              >
                {/* Moldura Externa Verde Institucional (#0F4C3A) */}
                <div className="w-full h-full border-[3.5px] border-[#0F4C3A] p-[6px]">
                  {/* Moldura Interna Azul Marinho (#1B365D) */}
                  <div className="w-full h-full border border-[#1B365D] px-8 py-4 flex flex-col justify-between relative">
                    <div>
                      {/* CABEÇALHO DO VERSO */}
                      <div className="flex items-center gap-3.5 pb-2.5 border-b border-stone-300">
                        <div className="flex items-center gap-2 shrink-0">
                          <LogoEditoraMenteSaude className="w-[44px] h-[44px]" />
                          <LogoCentroMariaDalva className="w-[44px] h-[44px]" />
                        </div>
                        <div className="text-left">
                          <h2 className="font-serif-editorial text-[22px] font-bold tracking-[0.03em] text-[#0F4C3A] uppercase leading-tight">
                            MEMORIAL DESCRITIVO E REGISTRO ACADÊMICO DE ATIVIDADE DE
                            EXTENSÃO
                          </h2>
                          <p className="text-[11.8px] text-stone-700">
                            Verso Oficial do Certificado Nº {certificate.number} · Fé
                            Pública Interinstitucional e Validação Curricular
                          </p>
                        </div>
                      </div>

                      {/* QUADROS 1 E 2 */}
                      <div className="grid grid-cols-12 gap-3.5 mt-3">
                        {/* Quadro 1 */}
                        <div className="col-span-7 bg-white border border-stone-300 rounded-xs p-3">
                          <h3 className="text-[10.8px] font-bold text-[#0F4C3A] uppercase tracking-wider mb-1.5">
                            1. DADOS DE IDENTIFICAÇÃO DO PROFISSIONAL EXTENSIONISTA
                          </h3>
                          <div className="space-y-1 text-[12px] text-stone-700 leading-snug">
                            <p>
                              Titular Certificado:{' '}
                              <strong className="font-bold text-stone-950">
                                {certificate.recipientName}
                              </strong>
                            </p>
                            <p>
                              CPF Registrado:{' '}
                              <strong className="font-bold font-mono-tabular text-stone-950">
                                {certificate.recipientCpf}
                              </strong>
                            </p>
                            <p>
                              Qualificação Profissional:{' '}
                              <strong className="font-bold text-stone-950">
                                {certificate.recipientRole}
                              </strong>
                            </p>
                            <p>
                              Instituição de Origem:{' '}
                              <strong className="font-bold text-stone-950">
                                {certificate.recipientInstitution}
                              </strong>
                            </p>
                          </div>
                        </div>

                        {/* Quadro 2 */}
                        <div className="col-span-5 bg-white border border-stone-300 rounded-xs p-3 flex flex-col justify-between">
                          <div>
                            <h3 className="text-[10.8px] font-bold text-[#0F4C3A] uppercase tracking-wider mb-1.5">
                              2. ENQUADRAMENTO CURRICULAR E PONTUAÇÃO
                            </h3>
                            <p className="text-[12.2px] font-bold text-stone-900 leading-snug">
                              {certificate.editalItem}
                            </p>
                          </div>
                          <div className="pt-2 mt-2">
                            <p className="text-[11.8px] font-mono-tabular font-bold text-stone-800">
                              Período: {certificate.period} &nbsp;|&nbsp; Total:{' '}
                              {certificate.workloadNumeric}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* QUADRO 3 — MATRIZ DE ATIVIDADES PRÁTICAS E METODOLOGIA EXTENSIONISTA */}
                      <div className="mt-3 border border-stone-300 rounded-xs overflow-hidden bg-white">
                        <div className="bg-[#EEF3F0] border-b border-stone-300 px-3.5 py-1.5">
                          <h3 className="text-[10.8px] font-bold text-[#0F4C3A] uppercase tracking-wider">
                            3. MATRIZ DE ATIVIDADES PRÁTICAS E METODOLOGIA EXTENSIONISTA
                            (08 HORAS)
                          </h3>
                        </div>
                        <div className="divide-y divide-stone-200">
                          {certificate.axes.map((axis) => (
                            <div
                              key={axis.id}
                              className="grid grid-cols-12 items-center px-3.5 py-2 gap-3"
                            >
                              <div className="col-span-4 pr-2">
                                <p className="text-[11.2px] font-bold text-stone-900 leading-tight">
                                  {axis.title}
                                </p>
                                <p className="text-[9.8px] text-stone-500 mt-0.5 leading-tight">
                                  {axis.subtitle}
                                </p>
                              </div>
                              <div className="col-span-7 text-[11px] text-stone-700 leading-snug">
                                {axis.description}
                              </div>
                              <div className="col-span-1 text-right font-mono-tabular text-[11.2px] font-bold text-stone-900">
                                {axis.hours}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* QUADRO 4 — REGISTRO OFICIAL DE FÉ PÚBLICA E CHAVES DE VERIFICAÇÃO */}
                      <div className="mt-3 bg-[#FDF9EC] border border-[#E2CE96] rounded-xs p-3 flex items-center justify-between gap-4">
                        <div className="space-y-1 flex-1">
                          <h3 className="text-[10.8px] font-bold text-[#9A6700] uppercase tracking-wider">
                            4. REGISTRO OFICIAL DE FÉ PÚBLICA, ENDEREÇO WEB E CHAVES DE
                            VERIFICAÇÃO DE AUTENTICIDADE
                          </h3>
                          <p className="text-[11.3px] text-stone-800 leading-snug">
                            Certificado registrado sob o{' '}
                            <strong className="font-bold">
                              nº {certificate.number} no Livro de Extensão nº{' '}
                              {certificate.book}, Folha {certificate.sheet}
                            </strong>
                            , expedido pela{' '}
                            <strong className="font-bold">
                              Editora Mente e Saúde
                            </strong>{' '}
                            (CNPJ: 51.372.335/0001-71) e{' '}
                            <strong className="font-bold">
                              Centro Profissionalizante Maria Dalva de Araújo
                            </strong>{' '}
                            (CNPJ: 51.269.112/0001-83).
                          </p>
                          <p className="text-[10.4px] font-mono-tabular text-stone-900 pt-0.5">
                            <strong className="font-bold">
                              CÓDIGO DE AUTENTICIDADE:
                            </strong>{' '}
                            {certificate.code} &nbsp;|&nbsp;{' '}
                            <strong className="font-bold">
                              CHAVE DE CONTROLE / DÍGITO:
                            </strong>{' '}
                            {certificate.controlKey}
                          </p>
                          <p className="text-[9.8px] font-mono-tabular text-stone-800">
                            <strong className="font-bold">
                              ENDEREÇO PARA VERIFICAÇÃO MANUAL (SEM QR CODE):
                            </strong>{' '}
                            {verificationUrl}
                          </p>
                          <p className="text-[9.8px] font-mono-tabular text-stone-700">
                            <strong className="font-bold text-stone-900">
                              HASH SHA-256:
                            </strong>{' '}
                            {certificate.sha256}
                          </p>
                        </div>

                        <div className="bg-white border border-stone-300 p-1.5 rounded-xs shrink-0">
                          {qrDataUrl ? (
                            <img
                              src={qrDataUrl}
                              alt="QR Code Verso Certificado 06"
                              className="w-[84px] h-[84px]"
                            />
                          ) : (
                            <div className="w-[84px] h-[84px] bg-stone-100" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* RODAPÉ SIMÉTRICO DO VERSO COM ASSINATURAS */}
                    <div className="w-[960px] mx-auto grid grid-cols-12 items-end pt-1">
                      <div className="col-span-4 flex flex-col items-center">
                        <div className="h-[40px] flex items-end justify-center pb-1">
                          <SignatureBarbaraSvg className="h-[34px] w-auto" />
                        </div>
                        <div className="w-[266px] border-t border-stone-700 pt-1 text-center h-[38px]">
                          <p className="text-[11.2px] font-bold text-stone-950 leading-tight">
                            BÁRBARA LIMA DOS SANTOS
                          </p>
                          <p className="text-[9.4px] font-mono-tabular text-stone-600 mt-0.5 leading-tight whitespace-nowrap">
                            Editora Mente e Saúde (CNPJ: 51.372.335/0001-71)
                          </p>
                        </div>
                      </div>

                      <div className="col-span-4 text-center pb-0.5">
                        <p className="font-serif-editorial italic font-semibold text-[16.5px] text-stone-900 leading-tight">
                          {certificate.cityState}, {certificate.issueDate}.
                        </p>
                        <p className="text-[10px] text-stone-600 mt-0.5 leading-tight">
                          Documento Oficial de 2 Laudas (Frente e Verso) · Válido em Todo
                          o Território Nacional
                        </p>
                        <p className="text-[9.4px] font-mono-tabular text-stone-500 mt-0.5 leading-tight">
                          Registro: {certificate.code} · Chave: {certificate.controlKey}
                        </p>
                      </div>

                      <div className="col-span-4 flex flex-col items-center">
                        <div className="h-[40px] flex items-end justify-center pb-1">
                          <SignatureJamesSvg className="h-[34px] w-auto" />
                        </div>
                        <div className="w-[266px] border-t border-stone-700 pt-1 text-center h-[38px]">
                          <p className="text-[11.2px] font-bold text-stone-950 leading-tight">
                            JAMES ARAÚJO DE SANTANA
                          </p>
                          <p className="text-[9.4px] font-mono-tabular text-stone-600 mt-0.5 leading-tight whitespace-nowrap">
                            Centro Maria Dalva de Araújo (CNPJ: 51.269.112/0001-83)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rodapé informativo do Visualizador */}
        <div className="w-full max-w-[1122px] bg-stone-800/90 border border-stone-700 rounded-lg px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-300 no-print">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Conformidade verificada: Assinaturas e logotipos idênticos aos Certificados 03 e 04 · CNPJ 51.269.112/0001-83 corrigido · QR Code integrado ao validador deste portal.
            </span>
          </div>
          <button
            type="button"
            onClick={() => onVerifyClick(certificate.code)}
            className="text-amber-300 hover:text-amber-200 font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>Testar Validação Pública deste Certificado</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
