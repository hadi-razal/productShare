export type WhatsAppCountry = {
  code: string;
  name: string;
  nationalLength: number;
};

export const WHATSAPP_COUNTRIES: WhatsAppCountry[] = [
  { code: "91", name: "India", nationalLength: 10 },
  { code: "971", name: "United Arab Emirates", nationalLength: 9 },
  { code: "966", name: "Saudi Arabia", nationalLength: 9 },
  { code: "974", name: "Qatar", nationalLength: 8 },
  { code: "965", name: "Kuwait", nationalLength: 8 },
  { code: "968", name: "Oman", nationalLength: 8 },
  { code: "973", name: "Bahrain", nationalLength: 8 },
  { code: "94", name: "Sri Lanka", nationalLength: 9 },
  { code: "977", name: "Nepal", nationalLength: 10 },
  { code: "880", name: "Bangladesh", nationalLength: 10 },
  { code: "92", name: "Pakistan", nationalLength: 10 },
  { code: "65", name: "Singapore", nationalLength: 8 },
  { code: "60", name: "Malaysia", nationalLength: 9 },
  { code: "62", name: "Indonesia", nationalLength: 10 },
  { code: "63", name: "Philippines", nationalLength: 10 },
  { code: "66", name: "Thailand", nationalLength: 9 },
  { code: "84", name: "Vietnam", nationalLength: 9 },
  { code: "852", name: "Hong Kong", nationalLength: 8 },
  { code: "81", name: "Japan", nationalLength: 10 },
  { code: "82", name: "South Korea", nationalLength: 10 },
  { code: "86", name: "China", nationalLength: 11 },
  { code: "61", name: "Australia", nationalLength: 9 },
  { code: "64", name: "New Zealand", nationalLength: 9 },
  { code: "44", name: "United Kingdom", nationalLength: 10 },
  { code: "49", name: "Germany", nationalLength: 11 },
  { code: "33", name: "France", nationalLength: 9 },
  { code: "39", name: "Italy", nationalLength: 10 },
  { code: "34", name: "Spain", nationalLength: 9 },
  { code: "31", name: "Netherlands", nationalLength: 9 },
  { code: "1", name: "United States / Canada", nationalLength: 10 },
  { code: "52", name: "Mexico", nationalLength: 10 },
  { code: "55", name: "Brazil", nationalLength: 11 },
  { code: "27", name: "South Africa", nationalLength: 9 },
  { code: "234", name: "Nigeria", nationalLength: 10 },
  { code: "254", name: "Kenya", nationalLength: 9 },
];

export const DEFAULT_WHATSAPP_CODE = "91";

const byLongestCode = [...WHATSAPP_COUNTRIES].sort((a, b) => b.code.length - a.code.length);

export const whatsappCountry = (code: string) =>
  WHATSAPP_COUNTRIES.find((country) => country.code === code) ?? WHATSAPP_COUNTRIES[0];

export const whatsappDigits = (value?: string | null) =>
  String(value || "").replace(/\D/g, "");

export const splitWhatsappNumber = (value?: string | null) => {
  const digits = whatsappDigits(value);
  if (!digits) return { code: DEFAULT_WHATSAPP_CODE, national: "" };

  for (const country of byLongestCode) {
    if (!digits.startsWith(country.code)) continue;
    const national = digits.slice(country.code.length);
    if (national.length === country.nationalLength) {
      return { code: country.code, national };
    }
  }

  if (digits.length === 10) return { code: DEFAULT_WHATSAPP_CODE, national: digits };

  for (const country of byLongestCode) {
    if (!digits.startsWith(country.code)) continue;
    const national = digits.slice(country.code.length);
    if (national.length > 0 && national.length < country.nationalLength) {
      return { code: country.code, national };
    }
  }

  if (digits.startsWith(DEFAULT_WHATSAPP_CODE)) {
    return { code: DEFAULT_WHATSAPP_CODE, national: digits.slice(DEFAULT_WHATSAPP_CODE.length) };
  }
  return { code: DEFAULT_WHATSAPP_CODE, national: digits };
};

export const normalizeWhatsappNumber = (value?: string | null) => {
  const { code, national } = splitWhatsappNumber(value);
  return joinWhatsappNumber(code, national);
};

export const joinWhatsappNumber = (code: string, national: string) => {
  const local = whatsappDigits(national);
  if (!local) return "";
  return `${code}${local}`;
};

export const isValidWhatsappNumber = (value?: string | null) => {
  const digits = whatsappDigits(value);
  if (!digits) return false;
  const { code, national } = splitWhatsappNumber(digits);
  const country = whatsappCountry(code);
  return national.length === country.nationalLength && digits === `${code}${national}`;
};

export const whatsappValidationMessage = (value?: string | null) => {
  if (!whatsappDigits(value)) return "WhatsApp number is required.";
  if (isValidWhatsappNumber(value)) return "";
  const { code } = splitWhatsappNumber(value);
  const country = whatsappCountry(code);
  return `Enter a ${country.nationalLength}-digit WhatsApp number for ${country.name}.`;
};
