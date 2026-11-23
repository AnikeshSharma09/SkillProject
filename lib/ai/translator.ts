export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
];

const GLOSSARY: Record<string, Record<string, string>> = {
  // Invoice summary phrases
  "Official commercial invoice": {
    es: "Factura comercial oficial",
    fr: "Facture commerciale officielle",
    de: "Offizielle Handelsrechnung",
    hi: "आधिकारिक वाणिज्यिक चालान",
    ja: "公式商業請求書",
  },
  "Total balance payable is": {
    es: "El saldo total a pagar es",
    fr: "Le solde total à payer est de",
    de: "Der fällige Gesamtsaldo beträgt",
    hi: "कुल देय शेष राशि है",
    ja: "支払総額は",
  },
  "Itemized transaction schedule details multi-unit inventory fulfillments and operational service deliverables.": {
    es: "El desglose de la transacción detalla entregas de inventario multielemento y servicios operativos.",
    fr: "Le calendrier détaillé des transactions spécifie les livraisons d'inventaire et les prestations opérationnelles.",
    de: "Die Einzelpostenaufstellung führt mehrteilige Lagerlieferungen und betriebliche Leistungsleistungen auf.",
    hi: "मदवार लेन-देन अनुसूची बहु-इकाई इन्वेंट्री पूर्ति और परिचालन सेवाओं का विवरण देती है।",
    ja: "項目別取引明細書には、複数ユニットの在庫納品と運用サービス納品物が詳述されています。",
  },
  "Commercial settlement deadline is scheduled for": {
    es: "La fecha límite de liquidación comercial está programada para",
    fr: "La date limite de règlement commercial est prévue pour",
    de: "Die Frist für den kaufmännischen Ausgleich ist geplant für",
    hi: "वाणिज्यिक निपटान की समय सीमा निर्धारित है",
    ja: "商業決済期限の予定日は",
  },
  "All line items and digital signatures have passed automated reconciliation checks and are queued for release approval.": {
    es: "Todas las partidas y firmas digitales han superado la conciliación automática y están listas para aprobación.",
    fr: "Toutes les lignes et signatures numériques ont passé la réconciliation automatique et sont prêtes pour approbation.",
    de: "Alle Posten und digitalen Signaturen haben den automatischen Abgleich bestanden und stehen zur Freigabe an.",
    hi: "सभी मदों और डिजिटल हस्ताक्षरों ने स्वचालित मिलान पूरा कर लिया है और अनुमोदन के लिए तैयार हैं।",
    ja: "すべての品目と電子署名は自動照合を通過し、承認待ち行列に入っています。",
  },

  // Purchase Order phrases
  "Corporate Purchase Order authorization": {
    es: "Autorización de orden de compra corporativa",
    fr: "Autorisation de bon de commande d'entreprise",
    de: "Genehmigung der betrieblichen Bestellung",
    hi: "कॉर्पोरेट खरीद आदेश प्राधिकरण",
    ja: "企業購買注文の承認",
  },
  "Total committed procurement spend authorized up to": {
    es: "Gasto de adquisición comprometido autorizado hasta",
    fr: "Dépenses d'approvisionnement autorisées jusqu'à",
    de: "Gesamte freigegebene Beschaffungsausgaben bis zu",
    hi: "अधिकतम स्वीकृत खरीद व्यय",
    ja: "承認された調達予算上限:",
  },
  "Requisition originates from operational systems department to support enterprise campus infrastructure requirements.": {
    es: "La solicitud proviene del departamento de sistemas operativos para respaldar infraestructura del campus.",
    fr: "La réquisition provient du département des systèmes pour l'infrastructure du campus.",
    de: "Die Anforderung stammt aus der IT-Abteilung zur Unterstützung der Campus-Infrastruktur.",
    hi: "मांग परिसर के बुनियादी ढांचे की जरूरतों का समर्थन करने के लिए सिस्टम विभाग से उत्पन्न होती है।",
    ja: "キャンパスインフラストラクチャ要件をサポートするため運用システム部門から発信されました。",
  },
  "Mandatory fulfillment and physical shipment delivery milestone is targeted on or before": {
    es: "El hito de entrega física de envío obligatorio está programado para o antes de",
    fr: "L'étape de livraison physique obligatoire est ciblée le ou avant le",
    de: "Die verbindliche Lieferfrist für die physische Sendung ist angesetzt auf oder vor",
    hi: "अनिवार्य पूर्ति और भौतिक शिपमेंट वितरण का लक्ष्य इस तिथि या उससे पहले है:",
    ja: "必須の履行および現物配送期日は以下またはそれ以前です:",
  },
  "Three-way matching criteria initialized between purchase order, receiving logs, and vendor payment disbursement.": {
    es: "Criterios de cotejo triple iniciados entre orden de compra, registros de recepción y desembolso.",
    fr: "Critères de rapprochement à trois voies initialisés entre bon de commande, réceptions et paiement.",
    de: "Drei-Wege-Abgleich zwischen Bestellung, Wareneingang und Lieferantenauszahlung eingeleitet.",
    hi: "खरीद आदेश, प्राप्त लॉग और विक्रेता भुगतान संवितरण के बीच त्रि-स्तरीय मिलान शुरू किया गया।",
    ja: "発注書、受領ログ、およびベンダー支払支出間の3者照合基準が初期化されました。",
  },

  // Receipt phrases
  "Point-of-sale expense receipt verified for corporate vendor": {
    es: "Recibo de gastos en punto de venta verificado para el proveedor",
    fr: "Reçu de dépenses au point de vente vérifié pour le fournisseur",
    de: "Point-of-Sale-Beleg verifiziert für den Unternehmungslieferanten",
    hi: "कॉर्पोरेट विक्रेता के लिए पॉइंट-ऑफ-सेल खर्च रसीद सत्यापित की गई:",
    ja: "法人物販ベンダーのPOS経費レシートが確認されました:",
  },
  "Total transaction settlement value recorded at": {
    es: "Valor total de liquidación registrado en",
    fr: "Valeur totale de règlement enregistrée à",
    de: "Gesamter Abrechnungswert erfasst bei",
    hi: "कुल लेनदेन निपटान मूल्य दर्ज किया गया:",
    ja: "決済総額が記録されました:",
  },
  "Covers operational business expense items authenticated against employee reimbursement guidelines.": {
    es: "Cubre gastos operativos comerciales autenticados según directrices de reembolso de empleados.",
    fr: "Couvre les dépenses professionnelles validées selon les règles de remboursement des employés.",
    de: "Umfasst betriebliche Ausgaben, die gemäß den Erstattungsrichtlinien authentifiziert wurden.",
    hi: "कर्मचारी प्रतिपूर्ति दिशानिर्देशों के तहत प्रमाणित व्यावसायिक खर्च मदों को कवर करता है।",
    ja: "従業員の経費精算ガイドラインに基づいて認証された運用業務経費を対象とします。",
  },
  "Document archived into audit repository with duplicate detection and expense policy controls satisfied.": {
    es: "Documento archivado en repositorio de auditoría con detección de duplicados y controles aprobados.",
    fr: "Document archivé dans le registre d'audit avec détection des doublons et règles validées.",
    de: "Dokument im Prüfarchiv abgelegt mit Duplikaterkennung und erfüllten Ausgabenrichtlinien.",
    hi: "डुप्लिकेट पहचान और व्यय नीति नियंत्रण संतुष्ट होने के साथ ऑडिट रिपॉजिटरी में संग्रहीत।",
    ja: "重複検出および経費ポリシー管理を満たし、監査リポジトリにアーカイブされました。",
  },

  // Report phrases
  "Executive document profile for": {
    es: "Perfil de documento ejecutivo para",
    fr: "Profil de document exécutif pour",
    de: "Dokumentenprofil für",
    hi: "दस्तावेज़ प्रोफ़ाइल:",
    ja: "エグゼクティブ文書プロファイル:",
  },
  "Content stream extracted with multi-layer OCR confidence and structured entity cross-referencing.": {
    es: "Flujo de contenido extraído con confianza OCR multicapa y referencias cruzadas estructuradas.",
    fr: "Flux de contenu extrait avec confiance OCR multicouche et références croisées d'entités.",
    de: "Inhaltsdaten mit mehrschichtigem OCR-Konfidenz und strukturierter Entitätenabgleichung extrahiert.",
    hi: "मल्टी-लेयर ओसीआर विश्वास और संरचित इकाई क्रॉस-रेफरेंसिंग के साथ निकाली गई सामग्री।",
    ja: "多層OCR信頼度と構造化エンティティ照合により抽出されたコンテンツストリーム。",
  },
  "Key operational stakeholders and departmental workflows notified of document ingestion.": {
    es: "Partes interesadas operativas y flujos departamentales notificados de la ingestión del documento.",
    fr: "Parties prenantes opérationnelles et flux de travail notifiés de l'ingestion du document.",
    de: "Wichtige operative Beteiligte und Abteilungs-Workflows über den Belegerhalt benachrichtigt.",
    hi: "दस्तावेज़ अंतर्ग्रहण की सूचना प्रमुख परिचालन हितधारकों और विभागीय वर्कफ़्लो को दी गई।",
    ja: "文書の取り込みが主要な利害関係者および部門ワークフローに通知されました。",
  },
  "Indexed into semantic search vector space for real-time querying and automated policy routing.": {
    es: "Indexado en espacio vectorial semántico para consultas en tiempo real y enrutamiento automatizado.",
    fr: "Indexé dans l'espace vectoriel sémantique pour requêtes en temps réel et routage automatique.",
    de: "Im semantischen Vektorraum indexiert für Echtzeitabfragen und automatisiertes Richtlinien-Routing.",
    hi: "रीयल-टाइम क्वेरी और स्वचालित नीति रूटिंग के लिए शब्दार्थ खोज वेक्टर में अनुक्रमित।",
    ja: "リアルタイムクエリと自動ポリシールーティングのためにセマンティック検索空間にインデックス付けされました。",
  },

  // Field Labels
  "Vendor Name": {
    es: "Nombre del proveedor",
    fr: "Nom du fournisseur",
    de: "Lieferantenname",
    hi: "विक्रेता का नाम",
    ja: "ベンダー名",
  },
  "Invoice Number": {
    es: "Número de factura",
    fr: "Numéro de facture",
    de: "Rechnungsnummer",
    hi: "चालान संख्या",
    ja: "請求書番号",
  },
  "Invoice Date": {
    es: "Fecha de factura",
    fr: "Date de facture",
    de: "Rechnungsdatum",
    hi: "चालान तिथि",
    ja: "請求日",
  },
  "Due Date": {
    es: "Fecha de vencimiento (Plazo)",
    fr: "Date d'échéance",
    de: "Fälligkeitsdatum",
    hi: "नियत तारीख (अंतिम तिथि)",
    ja: "支払期日",
  },
  "Subtotal": {
    es: "Subtotal",
    fr: "Sous-total",
    de: "Zwischensumme",
    hi: "उप-योग",
    ja: "小計",
  },
  "Tax (GST)": {
    es: "Impuesto (IVA/GST)",
    fr: "Taxe (TVA/TPS)",
    de: "Steuer (MwSt)",
    hi: "कर (जीएसटी / वैट)",
    ja: "税金 (消費税)",
  },
  "Total Amount": {
    es: "Monto total",
    fr: "Montant total",
    de: "Gesamtbetrag",
    hi: "कुल देय राशि",
    ja: "合計金額",
  },
  "Currency": {
    es: "Moneda",
    fr: "Devise",
    de: "Währung",
    hi: "मुद्रा",
    ja: "通貨",
  },
  "Client / Customer": {
    es: "Cliente / Comprador",
    fr: "Client / Acheteur",
    de: "Kunde / Auftraggeber",
    hi: "ग्राहक / खरीदार",
    ja: "顧客 / クライアント",
  },
  "Report Title": {
    es: "Título del informe",
    fr: "Titre du rapport",
    de: "Berichtstitel",
    hi: "रिपोर्ट का शीर्षक",
    ja: "レポートのタイトル",
  },
  "Reporting Period / Cycle": {
    es: "Período / Ciclo del informe",
    fr: "Période / Cycle de rapport",
    de: "Berichtszeitraum / Zyklus",
    hi: "रिपोर्टिंग अवधि / चक्र",
    ja: "報告期間 / サイクル",
  },
  "Prepared by / Dept": {
    es: "Preparado por / Depto.",
    fr: "Préparé par / Dép.",
    de: "Erstellt von / Abt.",
    hi: "द्वारा तैयार / विभाग",
    ja: "作成者 / 部署",
  },
  "Execution Status": {
    es: "Estado de ejecución",
    fr: "Statut d'exécution",
    de: "Ausführungsstatus",
    hi: "निष्पादन की स्थिति",
    ja: "実行ステータス",
  },
  "Report Date": {
    es: "Fecha del informe",
    fr: "Date du rapport",
    de: "Berichtsdatum",
    hi: "रिपोर्ट की तिथि",
    ja: "レポート日",
  },
  "Latency & Throughput": {
    es: "Latencia y rendimiento",
    fr: "Latence et débit",
    de: "Latenz & Durchsatz",
    hi: "विलंबता और थ्रूपुट",
    ja: "レイテンシとスループット",
  },
  "Employee Name": {
    es: "Nombre del empleado",
    fr: "Nom de l'employé",
    de: "Mitarbeitername",
    hi: "कर्मचारी का नाम",
    ja: "従業員名",
  },
  "Leave Reason": {
    es: "Motivo de la ausencia",
    fr: "Motif du congé",
    de: "Urlaubsgrund",
    hi: "छुट्टी का कारण",
    ja: "休暇の理由",
  },
};

/**
 * Translates document executive summary into the target language.
 */
export function translateSummary(summary: string, targetLang: string): string {
  if (!summary || targetLang === "en") return summary;

  const lines = summary.split("\n");
  const translatedLines = lines.map((line) => {
    let translatedLine = line;

    // Apply known phrase replacements from dictionary
    for (const [enPhrase, translations] of Object.entries(GLOSSARY)) {
      if (translations[targetLang] && translatedLine.includes(enPhrase)) {
        translatedLine = translatedLine.replace(enPhrase, translations[targetLang]);
      }
    }

    // Contextual connector translations
    if (targetLang === "es") {
      translatedLine = translatedLine
        .replace(/issued by/gi, "emitida por")
        .replace(/covering/gi, "cubriendo")
        .replace(/applicable taxes/gi, "impuestos aplicables")
        .replace(/scheduled for/gi, "programada para")
        .replace(/via corporate banking disbursement/gi, "mediante desembolso bancario corporativo")
        .replace(/classified under/gi, "clasificado bajo")
        .replace(/organizational taxonomy/gi, "taxonomía organizacional");
    } else if (targetLang === "fr") {
      translatedLine = translatedLine
        .replace(/issued by/gi, "émise par")
        .replace(/covering/gi, "couvrant")
        .replace(/applicable taxes/gi, "taxes applicables")
        .replace(/scheduled for/gi, "prévue pour")
        .replace(/via corporate banking disbursement/gi, "via décaissement bancaire d'entreprise")
        .replace(/classified under/gi, "classé sous")
        .replace(/organizational taxonomy/gi, "taxonomie organisationnelle");
    } else if (targetLang === "de") {
      translatedLine = translatedLine
        .replace(/issued by/gi, "ausgestellt von")
        .replace(/covering/gi, "abdeckend")
        .replace(/applicable taxes/gi, "geltende Steuern")
        .replace(/scheduled for/gi, "geplant für")
        .replace(/via corporate banking disbursement/gi, "über Überweisung des Firmenkontos")
        .replace(/classified under/gi, "klassifiziert unter")
        .replace(/organizational taxonomy/gi, "Organisationstaxonomie");
    } else if (targetLang === "hi") {
      translatedLine = translatedLine
        .replace(/issued by/gi, "द्वारा जारी")
        .replace(/covering/gi, "जिसमें शामिल है")
        .replace(/applicable taxes/gi, "लागू कर")
        .replace(/scheduled for/gi, "निर्धारित")
        .replace(/via corporate banking disbursement/gi, "कॉर्पोरेट बैंकिंग संवितरण के माध्यम से")
        .replace(/classified under/gi, "के तहत वर्गीकृत")
        .replace(/organizational taxonomy/gi, "संगठनात्मक वर्गीकरण");
    } else if (targetLang === "ja") {
      translatedLine = translatedLine
        .replace(/issued by/gi, "発行元:")
        .replace(/covering/gi, "対象:")
        .replace(/applicable taxes/gi, "適用税金")
        .replace(/scheduled for/gi, "予定日:")
        .replace(/via corporate banking disbursement/gi, "企業銀行支出経由")
        .replace(/classified under/gi, "に分類")
        .replace(/organizational taxonomy/gi, "組織タクソノミー");
    }

    return translatedLine;
  });

  return translatedLines.join("\n");
}

/**
 * Translates field labels into target language.
 */
export function translateFieldLabel(label: string, targetLang: string): string {
  if (targetLang === "en" || !GLOSSARY[label]) return label;
  return GLOSSARY[label][targetLang] || label;
}
