import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { CertificateData } from '../data/campaignData';
import {
  LOGO_EMS_DATA_URL,
  LOGO_CMDA_DATA_URL,
  SIG_BARBARA_DATA_URL,
  SIG_JAMES_DATA_URL,
} from '../data/certificateAssets';

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

function getSeloDataUrl(code: string): Promise<string> {
  const svgString = `<svg viewBox="0 0 120 120" width="240" height="240" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="55" fill="#FDFBF3" stroke="#C59B27" stroke-width="2.2"/>
    <circle cx="60" cy="60" r="49" fill="#FAF3DD" stroke="#C59B27" stroke-width="1.2" stroke-dasharray="3 2"/>
    <circle cx="60" cy="60" r="42" fill="none" stroke="#D4AF37" stroke-width="0.9"/>
    <text x="60" y="31" text-anchor="middle" fill="#B48A1E" font-size="8" font-weight="700" font-family="Georgia, serif">★  ★  ★</text>
    <text x="60" y="47" text-anchor="middle" fill="#855E09" font-size="8.3" font-weight="700" font-family="Georgia, serif">SELO OFICIAL</text>
    <text x="60" y="59.5" text-anchor="middle" fill="#714E05" font-size="8" font-weight="700" font-family="Georgia, serif">FÉ PÚBLICA</text>
    <line x1="28" y1="66" x2="92" y2="66" stroke="#C59B27" stroke-width="0.9"/>
    <text x="60" y="76" text-anchor="middle" fill="#855E09" font-size="5.8" font-weight="700" font-family="monospace">${code}</text>
    <text x="60" y="92" text-anchor="middle" fill="#B48A1E" font-size="7.5" font-weight="700" font-family="Georgia, serif">★  ★  ★</text>
  </svg>`;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = 360;
      c.height = 360;
      const ctx = c.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error('No 2d context'));
        return;
      }
      ctx.drawImage(img, 0, 0, 360, 360);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL('image/png'));
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}

interface RichSegment {
  text: string;
  bold?: boolean;
}

interface WordToken {
  word: string;
  bold: boolean;
  width: number;
}

/**
 * Renderiza parágrafo com trechos em negrito e alinhamento justificado, centralizado ou à esquerda.
 * Garante sempre ctx.textAlign = 'left' internamente para nunca sobrepor palavras.
 */
function drawRichParagraph(
  ctx: CanvasRenderingContext2D,
  segments: RichSegment[],
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  fontSize: number,
  fontFamily: string,
  align: 'justify' | 'center' | 'left' = 'justify',
  color = '#1F2937'
): number {
  ctx.save();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  const rawTokens: { word: string; bold: boolean }[] = [];
  segments.forEach((seg) => {
    const words = seg.text.split(/\s+/).filter(Boolean);
    words.forEach((w) => {
      // Se o token for apenas pontuação inicial (ex: ",", ".", ";", ":"), cola na palavra anterior
      if (/^[,.;:)!?]+$/.test(w) && rawTokens.length > 0) {
        rawTokens[rawTokens.length - 1].word += w;
      } else {
        rawTokens.push({ word: w, bold: !!seg.bold });
      }
    });
  });

  const tokens: WordToken[] = rawTokens.map((t) => {
    ctx.font = `${t.bold ? '700' : '400'} ${fontSize}px ${fontFamily}`;
    return {
      word: t.word,
      bold: t.bold,
      width: ctx.measureText(t.word).width,
    };
  });

  ctx.font = `400 ${fontSize}px ${fontFamily}`;
  const spaceWidth = ctx.measureText(' ').width;

  const lines: WordToken[][] = [];
  let currentLine: WordToken[] = [];
  let currentWidth = 0;

  tokens.forEach((tok) => {
    const addedWidth =
      currentLine.length === 0 ? tok.width : spaceWidth + tok.width;
    if (currentWidth + addedWidth > maxWidth && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = [tok];
      currentWidth = tok.width;
    } else {
      currentLine.push(tok);
      currentWidth += addedWidth;
    }
  });
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  ctx.fillStyle = color;

  lines.forEach((line, lineIdx) => {
    const isLastLine = lineIdx === lines.length - 1;
    const totalWordsWidth = line.reduce((acc, t) => acc + t.width, 0);
    const totalStandardWidth =
      totalWordsWidth + Math.max(0, line.length - 1) * spaceWidth;

    let cursorX = x;
    let gap = spaceWidth;

    if (align === 'center') {
      cursorX = x + (maxWidth - totalStandardWidth) / 2;
    } else if (align === 'justify' && !isLastLine && line.length > 1) {
      gap = (maxWidth - totalWordsWidth) / (line.length - 1);
      // Limita o espaçamento máximo caso uma linha tenha poucas palavras
      if (gap > spaceWidth * 3.2) {
        gap = spaceWidth;
      }
    }

    const lineY = y + lineIdx * lineHeight;
    line.forEach((tok) => {
      ctx.font = `${tok.bold ? '700' : '400'} ${fontSize}px ${fontFamily}`;
      ctx.fillText(tok.word, cursorX, lineY);
      cursorX += tok.width + gap;
    });
  });

  ctx.restore();
  return y + lines.length * lineHeight;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fill?: string,
  stroke?: string,
  lineWidth = 1
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
}

function drawFrameBase(ctx: CanvasRenderingContext2D) {
  // Fundo creme acadêmico (#FAF9F6)
  ctx.fillStyle = '#FAF9F6';
  ctx.fillRect(0, 0, 1122, 794);

  // Moldura externa verde esmeralda (#0F4C3A)
  ctx.strokeStyle = '#0F4C3A';
  ctx.lineWidth = 3.5;
  ctx.strokeRect(20, 20, 1082, 754);

  // Moldura interna azul marinho (#1B365D)
  ctx.strokeStyle = '#1B365D';
  ctx.lineWidth = 1.2;
  ctx.strokeRect(27, 27, 1068, 740);
}

export async function generateCertificate06Pdf(
  cert: CertificateData,
  baseUrl: string
): Promise<void> {
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }

  const cleanBaseUrl = baseUrl.replace(/\/$/, '');
  const verificationUrl = `${cleanBaseUrl}/?codigo=${cert.code}#validador`;

  const [qrDataUrl, seloDataUrl, logoEms, logoCmda, sigBarbara, sigJames] =
    await Promise.all([
      QRCode.toDataURL(verificationUrl, {
        width: 360,
        margin: 1,
        color: { dark: '#111827', light: '#FFFFFF' },
      }),
      getSeloDataUrl(cert.code),
      loadImage(LOGO_EMS_DATA_URL),
      loadImage(LOGO_CMDA_DATA_URL),
      loadImage(SIG_BARBARA_DATA_URL),
      loadImage(SIG_JAMES_DATA_URL),
    ]);

  const [qrImg, seloImg] = await Promise.all([
    loadImage(qrDataUrl),
    loadImage(seloDataUrl),
  ]);

  const SANS = '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif';
  const SERIF = '"Cormorant Garamond", Georgia, serif';
  const MONO = '"JetBrains Mono", monospace';

  // =========================================================================
  // RENDERIZA PÁGINA 1 (FRENTE) EM CANVAS 3366 x 2382 (3x de 1122 x 794)
  // =========================================================================
  const canvas1 = document.createElement('canvas');
  canvas1.width = 3366;
  canvas1.height = 2382;
  const ctx1 = canvas1.getContext('2d')!;
  ctx1.scale(3, 3);

  drawFrameBase(ctx1);

  // Cabeçalho Superior
  ctx1.drawImage(logoEms, 58, 46, 58, 58);
  ctx1.drawImage(logoCmda, 1006, 46, 58, 58);

  // Instituição 1 (Esquerda)
  ctx1.textAlign = 'left';
  ctx1.fillStyle = '#18181B';
  ctx1.font = `700 14.5px ${SANS}`;
  ctx1.fillText('EDITORA MENTE E SAÚDE', 127, 65);

  ctx1.fillStyle = '#374151';
  ctx1.font = `600 11px ${MONO}`;
  ctx1.fillText('CNPJ: 51.372.335/0001-71', 127, 82);

  ctx1.fillStyle = '#0F4C3A';
  ctx1.font = `500 11px ${SANS}`;
  ctx1.fillText('Conselho Editorial e Extensão Científica', 127, 98);

  // Centro do Cabeçalho
  ctx1.textAlign = 'center';
  ctx1.fillStyle = '#18181B';
  ctx1.font = `700 10.8px ${SANS}`;
  ctx1.fillText(
    'PROGRAMA INTERINSTITUCIONAL DE EXTENSÃO, COMUNICAÇÃO',
    561,
    59
  );
  ctx1.fillText('CIENTÍFICA E EDUCAÇÃO EM SAÚDE', 561, 74);

  ctx1.fillStyle = '#1F2937';
  ctx1.font = `700 10.2px ${MONO}`;
  ctx1.fillText(
    `Certificado Nº ${cert.number}  ·  Livro de Extensão nº ${cert.book}  ·  Cód. ${cert.code}`,
    561,
    95
  );

  // Instituição 2 (Direita)
  ctx1.textAlign = 'right';
  ctx1.fillStyle = '#18181B';
  ctx1.font = `700 13.5px ${SANS}`;
  ctx1.fillText('CENTRO PROFISSIONALIZANTE', 994, 65);
  ctx1.fillText('MARIA DALVA DE ARAÚJO', 994, 82);

  ctx1.fillStyle = '#374151';
  ctx1.font = `600 11px ${MONO}`;
  ctx1.fillText('CNPJ: 51.269.112/0001-83', 994, 98);

  // Linha divisória do cabeçalho
  ctx1.strokeStyle = '#D6D3CB';
  ctx1.lineWidth = 1;
  ctx1.beginPath();
  ctx1.moveTo(58, 115);
  ctx1.lineTo(1064, 115);
  ctx1.stroke();

  // Título Principal
  ctx1.textAlign = 'center';
  ctx1.fillStyle = '#0F4C3A';
  ctx1.font = `700 35px ${SERIF}`;
  ctx1.fillText('CERTIFICADO DE ATIVIDADE DE EXTENSÃO', 561, 156);

  // Parágrafo Introdutório Centralizado
  drawRichParagraph(
    ctx1,
    [
      { text: 'A ' },
      { text: 'Editora Mente e Saúde', bold: true },
      {
        text: ' (CNPJ: 51.372.335/0001-71), em parceria institucional com o ',
      },
      { text: 'Centro Profissionalizante Maria Dalva de Araújo', bold: true },
      {
        text: ' (CNPJ: 51.269.112/0001-83), certifica para os devidos fins de comprovação curricular e acadêmica que',
      },
    ],
    105,
    184,
    912,
    19.5,
    13.6,
    SANS,
    'center',
    '#27272A'
  );

  // Quadro de Destaque do Médico Titular
  drawRoundedRect(ctx1, 91, 218, 940, 74, 3, '#F2F6F3', '#CBDAD1', 1);

  ctx1.textAlign = 'center';
  ctx1.fillStyle = '#111827';
  ctx1.font = `700 29px ${SERIF}`;
  ctx1.fillText(cert.recipientName, 561, 254);

  ctx1.fillStyle = '#18181B';
  ctx1.font = `700 13.5px ${SANS}`;
  ctx1.fillText(
    `${cert.recipientRole} | CPF: ${cert.recipientCpf} | ${cert.recipientInstitution}`,
    561,
    279
  );

  // Corpo do Texto — Parágrafo 1 (com palavras-chave em negrito e justificado)
  const p1EndY = drawRichParagraph(
    ctx1,
    [
      { text: 'participou de forma efetiva da ' },
      { text: 'Atividade de Extensão', bold: true },
      { text: ' intitulada ' },
      {
        text: `“${cert.title}”,`,
        bold: true,
      },
      { text: ' desenvolvida na modalidade de ' },
      { text: `${cert.modality},`, bold: true },
      { text: ' realizada no período de ' },
      { text: `${cert.period},`, bold: true },
      { text: ' contabilizando carga horária total de ' },
      { text: `${cert.workloadHours}.`, bold: true },
    ],
    91,
    320,
    940,
    21,
    13.6,
    SANS,
    'justify',
    '#1F2937'
  );

  // Corpo do Texto — Parágrafo 2
  const p2EndY = drawRichParagraph(
    ctx1,
    [
      {
        text: 'No âmbito desta ação extensionista, o profissional atuou na elaboração e distribuição comunitária de materiais educativos (folheto digital de sinais de alarme e guias preventivos), aplicação de instrumentos digitais interativos para ',
      },
      { text: 'coleta de dados populacionais', bold: true },
      { text: ' sobre medidas de controle vetorial, ' },
      {
        text: 'comunicação científica para combate à desinformação (fake news)',
        bold: true,
      },
      { text: ' sobre imunobiológicos e ' },
      {
        text: 'divulgação dos canais oficiais de saúde pública (SUS)',
        bold: true,
      },
      { text: ' e grupos prioritários da vacina contra a Dengue.' },
    ],
    91,
    p1EndY + 9,
    940,
    21,
    13.6,
    SANS,
    'justify',
    '#1F2937'
  );

  // Data e Local (Posicionado com folga limpa abaixo do Parágrafo 2)
  ctx1.textAlign = 'center';
  ctx1.fillStyle = '#18181B';
  ctx1.font = `italic 600 19px ${SERIF}`;
  ctx1.fillText(
    `${cert.cityState}, ${cert.issueDate}.`,
    561,
    Math.max(498, p2EndY + 18)
  );

  // Rodapé Simétrico de Assinaturas + Selo + QR Code
  // Assinatura Esquerda (Bárbara)
  ctx1.drawImage(sigBarbara, 134, 608, 146, 36);
  ctx1.strokeStyle = '#374151';
  ctx1.lineWidth = 1;
  ctx1.beginPath();
  ctx1.moveTo(68, 650);
  ctx1.lineTo(346, 650);
  ctx1.stroke();

  ctx1.textAlign = 'center';
  ctx1.fillStyle = '#111827';
  ctx1.font = `700 12px ${SANS}`;
  ctx1.fillText('BÁRBARA LIMA DOS SANTOS', 207, 667);

  ctx1.fillStyle = '#4B5563';
  ctx1.font = `400 10.5px ${SANS}`;
  ctx1.fillText('Editora-Chefe e Coordenadora de Extensão Editorial', 207, 683);

  ctx1.fillStyle = '#1F2937';
  ctx1.font = `700 9.6px ${MONO}`;
  ctx1.fillText('Editora Mente e Saúde (CNPJ: 51.372.335/0001-71)', 207, 699);

  // Selo Oficial de Fé Pública (Centro-Esquerda)
  ctx1.drawImage(seloImg, 376, 606, 86, 86);

  // Quadro QR Code + Autenticação Pública Manual (Centro-Direita)
  drawRoundedRect(ctx1, 474, 592, 268, 108, 3, '#FFFFFF', '#D1D5DB', 1);
  ctx1.drawImage(qrImg, 482, 600, 92, 92);

  ctx1.textAlign = 'left';
  ctx1.fillStyle = '#0F4C3A';
  ctx1.font = `700 9.4px ${SANS}`;
  ctx1.fillText('AUTENTICAÇÃO PÚBLICA MANUAL', 582, 612);

  ctx1.fillStyle = '#1F2937';
  ctx1.font = `600 9px ${MONO}`;
  ctx1.fillText(`Cód.: ${cert.code}`, 582, 627);
  ctx1.fillText(`Chave: ${cert.controlKey}`, 582, 641);

  ctx1.fillStyle = '#111827';
  ctx1.font = `700 8.6px ${SANS}`;
  ctx1.fillText('Endereço p/ Verificação Online:', 582, 656);

  ctx1.fillStyle = '#4B5563';
  ctx1.font = `400 7.4px ${MONO}`;
  const fullDisplayUrl = `${cleanBaseUrl}/`;
  const urlLine1 = fullDisplayUrl.slice(0, 31);
  const urlLine2 = fullDisplayUrl.slice(31, 62);
  const urlLine3 = fullDisplayUrl.slice(62);
  ctx1.fillText(urlLine1, 582, 669);
  if (urlLine2) ctx1.fillText(urlLine2, 582, 679);
  if (urlLine3) ctx1.fillText(urlLine3, 582, 689);

  // Assinatura Direita (James) — Linha horizontal na mesma altura (Y = 650)
  ctx1.drawImage(sigJames, 842, 608, 146, 36);
  ctx1.strokeStyle = '#374151';
  ctx1.lineWidth = 1;
  ctx1.beginPath();
  ctx1.moveTo(776, 650);
  ctx1.lineTo(1054, 650);
  ctx1.stroke();

  ctx1.textAlign = 'center';
  ctx1.fillStyle = '#111827';
  ctx1.font = `700 12px ${SANS}`;
  ctx1.fillText('JAMES ARAÚJO DE SANTANA', 915, 667);

  ctx1.fillStyle = '#4B5563';
  ctx1.font = `400 10.5px ${SANS}`;
  ctx1.fillText('Coordenador de Extensão e Projetos Educativos', 915, 683);

  ctx1.fillStyle = '#1F2937';
  ctx1.font = `700 9.2px ${MONO}`;
  ctx1.fillText(
    'Centro Maria Dalva de Araújo (CNPJ: 51.269.112/0001-83)',
    915,
    699
  );

  // Barra Inferior de Verificação
  drawRoundedRect(ctx1, 58, 716, 1006, 28, 3, '#EEF5F0', '#C6D8CD', 1);
  ctx1.textAlign = 'center';
  ctx1.fillStyle = '#0F4C3A';
  ctx1.font = `700 9.5px ${MONO}`;
  ctx1.fillText(
    `Verifique via QR Code ou acesse ${cleanBaseUrl}/ informando o Código ${cert.code} ou Chave ${cert.controlKey}`,
    561,
    733.5
  );

  // =========================================================================
  // RENDERIZA PÁGINA 2 (VERSO) EM CANVAS 3366 x 2382 (3x de 1122 x 794)
  // =========================================================================
  const canvas2 = document.createElement('canvas');
  canvas2.width = 3366;
  canvas2.height = 2382;
  const ctx2 = canvas2.getContext('2d')!;
  ctx2.scale(3, 3);

  drawFrameBase(ctx2);

  // Cabeçalho do Verso
  ctx2.drawImage(logoEms, 58, 44, 45, 45);
  ctx2.drawImage(logoCmda, 109, 44, 45, 45);

  ctx2.textAlign = 'left';
  ctx2.fillStyle = '#0F4C3A';
  ctx2.font = `700 22px ${SERIF}`;
  ctx2.fillText(
    'MEMORIAL DESCRITIVO E REGISTRO ACADÊMICO DE ATIVIDADE DE EXTENSÃO',
    168,
    64
  );

  ctx2.fillStyle = '#374151';
  ctx2.font = `500 12px ${SANS}`;
  ctx2.fillText(
    `Verso Oficial do Certificado Nº ${cert.number} · Fé Pública Interinstitucional e Validação Curricular`,
    168,
    83
  );

  ctx2.strokeStyle = '#D6D3CB';
  ctx2.lineWidth = 1;
  ctx2.beginPath();
  ctx2.moveTo(58, 98);
  ctx2.lineTo(1064, 98);
  ctx2.stroke();

  // Quadro 1 (Esquerda) e Quadro 2 (Direita)
  drawRoundedRect(ctx2, 58, 108, 548, 114, 3, '#FFFFFF', '#D6D3CB', 1);
  drawRoundedRect(ctx2, 620, 108, 444, 114, 3, '#FFFFFF', '#D6D3CB', 1);

  // Textos do Quadro 1
  ctx2.textAlign = 'left';
  ctx2.fillStyle = '#0F4C3A';
  ctx2.font = `700 11px ${SANS}`;
  ctx2.fillText(
    '1. DADOS DE IDENTIFICAÇÃO DO PROFISSIONAL EXTENSIONISTA',
    72,
    128
  );

  const q1Rows = [
    ['Titular Certificado: ', cert.recipientName],
    ['CPF Registrado: ', cert.recipientCpf],
    ['Qualificação Profissional: ', cert.recipientRole],
    ['Instituição de Origem: ', cert.recipientInstitution],
  ];
  q1Rows.forEach(([label, val], idx) => {
    const ry = 150 + idx * 20;
    ctx2.fillStyle = '#4B5563';
    ctx2.font = `400 12.2px ${SANS}`;
    ctx2.fillText(label, 72, ry);
    const lw = ctx2.measureText(label).width;
    ctx2.fillStyle = '#111827';
    ctx2.font = `700 12.2px ${SANS}`;
    ctx2.fillText(val, 72 + lw, ry);
  });

  // Textos do Quadro 2
  ctx2.fillStyle = '#0F4C3A';
  ctx2.font = `700 11px ${SANS}`;
  ctx2.fillText('2. ENQUADRAMENTO CURRICULAR E PONTUAÇÃO', 634, 128);

  drawRichParagraph(
    ctx2,
    [{ text: cert.editalItem, bold: true }],
    634,
    150,
    414,
    19,
    12.5,
    SANS,
    'left',
    '#111827'
  );

  ctx2.textAlign = 'left';
  ctx2.fillStyle = '#1F2937';
  ctx2.font = `700 11.8px ${MONO}`;
  ctx2.fillText(
    `Período: ${cert.period}  |  Total: ${cert.workloadNumeric}`,
    634,
    206
  );

  // Quadro 3 — Matriz de Atividades Práticas e Metodologia Extensionista
  drawRoundedRect(ctx2, 58, 232, 1006, 260, 3, '#FFFFFF', '#D6D3CB', 1);
  drawRoundedRect(ctx2, 58, 232, 1006, 28, 3, '#EEF3F0', '#D6D3CB', 1);

  ctx2.textAlign = 'left';
  ctx2.fillStyle = '#0F4C3A';
  ctx2.font = `700 11px ${SANS}`;
  ctx2.fillText(
    '3. MATRIZ DE ATIVIDADES PRÁTICAS E METODOLOGIA EXTENSIONISTA (08 HORAS)',
    72,
    250
  );

  cert.axes.forEach((axis, idx) => {
    const rowTop = 260 + idx * 57.5;
    if (idx > 0) {
      ctx2.strokeStyle = '#E5E7EB';
      ctx2.lineWidth = 1;
      ctx2.beginPath();
      ctx2.moveTo(58, rowTop);
      ctx2.lineTo(1064, rowTop);
      ctx2.stroke();
    }

    const titleEndY = drawRichParagraph(
      ctx2,
      [{ text: axis.title, bold: true }],
      72,
      rowTop + 17,
      268,
      13.8,
      10.8,
      SANS,
      'left',
      '#111827'
    );

    drawRichParagraph(
      ctx2,
      [{ text: axis.subtitle, bold: false }],
      72,
      titleEndY + 1,
      268,
      12,
      9.3,
      SANS,
      'left',
      '#6B7280'
    );

    drawRichParagraph(
      ctx2,
      [{ text: axis.description, bold: false }],
      356,
      rowTop + 19,
      610,
      14.8,
      10.9,
      SANS,
      'left',
      '#374151'
    );

    ctx2.textAlign = 'right';
    ctx2.fillStyle = '#111827';
    ctx2.font = `700 11.5px ${MONO}`;
    ctx2.fillText(axis.hours, 1048, rowTop + 33);
    ctx2.textAlign = 'left';
  });

  // Quadro 4 — Registro Oficial de Fé Pública
  drawRoundedRect(ctx2, 58, 502, 1006, 134, 3, '#FDF9EC', '#E2CE96', 1);

  ctx2.textAlign = 'left';
  ctx2.fillStyle = '#9A6700';
  ctx2.font = `700 11px ${SANS}`;
  ctx2.fillText(
    '4. REGISTRO OFICIAL DE FÉ PÚBLICA, ENDEREÇO WEB E CHAVES DE VERIFICAÇÃO DE AUTENTICIDADE',
    72,
    522
  );

  drawRichParagraph(
    ctx2,
    [
      { text: 'Certificado registrado sob o ' },
      {
        text: `nº ${cert.number} no Livro de Extensão nº ${cert.book}, Folha ${cert.sheet},`,
        bold: true,
      },
      { text: ' expedido pela ' },
      { text: 'Editora Mente e Saúde', bold: true },
      { text: ' (CNPJ: 51.372.335/0001-71) e ' },
      {
        text: 'Centro Profissionalizante Maria Dalva de Araújo',
        bold: true,
      },
      { text: ' (CNPJ: 51.269.112/0001-83).' },
    ],
    72,
    542,
    868,
    16.5,
    11.3,
    SANS,
    'left',
    '#1F2937'
  );

  ctx2.textAlign = 'left';
  ctx2.fillStyle = '#111827';
  ctx2.font = `700 10.4px ${MONO}`;
  ctx2.fillText(
    `CÓDIGO DE AUTENTICIDADE: ${cert.code}   |   CHAVE DE CONTROLE / DÍGITO: ${cert.controlKey}`,
    72,
    580
  );

  ctx2.font = `600 9.1px ${MONO}`;
  ctx2.fillText(
    `ENDEREÇO PARA VERIFICAÇÃO MANUAL (SEM QR CODE): ${verificationUrl}`,
    72,
    600
  );

  ctx2.font = `600 9.6px ${MONO}`;
  ctx2.fillText(`HASH SHA-256: ${cert.sha256}`, 72, 620);

  drawRoundedRect(ctx2, 954, 514, 96, 96, 3, '#FFFFFF', '#D1D5DB', 1);
  ctx2.drawImage(qrImg, 960, 520, 84, 84);

  // Rodapé de Assinaturas do Verso — Mesma linha horizontal Y = 708
  ctx2.drawImage(sigBarbara, 128, 668, 138, 34);
  ctx2.strokeStyle = '#374151';
  ctx2.lineWidth = 1;
  ctx2.beginPath();
  ctx2.moveTo(68, 708);
  ctx2.lineTo(334, 708);
  ctx2.stroke();

  ctx2.textAlign = 'center';
  ctx2.fillStyle = '#111827';
  ctx2.font = `700 11.5px ${SANS}`;
  ctx2.fillText('BÁRBARA LIMA DOS SANTOS', 201, 725);
  ctx2.fillStyle = '#4B5563';
  ctx2.font = `600 9.5px ${MONO}`;
  ctx2.fillText('Editora Mente e Saúde (CNPJ: 51.372.335/0001-71)', 201, 740);

  // Centro do Rodapé do Verso
  ctx2.fillStyle = '#111827';
  ctx2.font = `italic 600 16.5px ${SERIF}`;
  ctx2.fillText(`${cert.cityState}, ${cert.issueDate}.`, 561, 704);

  ctx2.fillStyle = '#4B5563';
  ctx2.font = `400 10.2px ${SANS}`;
  ctx2.fillText(
    'Documento Oficial de 2 Laudas (Frente e Verso) · Válido em Todo o Território Nacional',
    561,
    722
  );

  ctx2.font = `600 9.6px ${MONO}`;
  ctx2.fillText(
    `Registro: ${cert.code} · Chave: ${cert.controlKey}`,
    561,
    738
  );

  // Assinatura Direita do Verso
  ctx2.drawImage(sigJames, 850, 668, 138, 34);
  ctx2.strokeStyle = '#374151';
  ctx2.lineWidth = 1;
  ctx2.beginPath();
  ctx2.moveTo(788, 708);
  ctx2.lineTo(1054, 708);
  ctx2.stroke();

  ctx2.fillStyle = '#111827';
  ctx2.font = `700 11.5px ${SANS}`;
  ctx2.fillText('JAMES ARAÚJO DE SANTANA', 921, 725);
  ctx2.fillStyle = '#4B5563';
  ctx2.font = `600 9.5px ${MONO}`;
  ctx2.fillText(
    'Centro Maria Dalva de Araújo (CNPJ: 51.269.112/0001-83)',
    921,
    740
  );

  // Gera o PDF A4 Paisagem (297mm x 210mm) com as 2 laudas 3366x2382
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const page1Data = canvas1.toDataURL('image/png');
  const page2Data = canvas2.toDataURL('image/png');

  doc.addImage(page1Data, 'PNG', 0, 0, 297, 210, undefined, 'FAST');
  doc.addPage('a4', 'landscape');
  doc.addImage(page2Data, 'PNG', 0, 0, 297, 210, undefined, 'FAST');

  doc.save(
    `Certificado_Extensao_06_${cert.code}_Lucas_Goncalves_Silveira.pdf`
  );
}
