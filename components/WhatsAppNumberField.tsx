"use client";

import { useState } from "react";
import {
  DEFAULT_WHATSAPP_CODE,
  joinWhatsappNumber,
  splitWhatsappNumber,
  WHATSAPP_COUNTRIES,
  whatsappCountry,
  whatsappDigits,
} from "@/lib/whatsapp";

type WhatsAppNumberFieldProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  variant?: "setup" | "settings";
};

const WhatsAppNumberField = ({
  id,
  value,
  onChange,
  variant = "settings",
}: WhatsAppNumberFieldProps) => {
  const [code, setCode] = useState(
    () => splitWhatsappNumber(value).code || DEFAULT_WHATSAPP_CODE,
  );
  const stored = splitWhatsappNumber(value);
  const activeCode = whatsappDigits(value) ? stored.code : code;
  const national = whatsappDigits(value)
    ? stored.national
    : "";
  const country = whatsappCountry(activeCode);

  const emit = (nextCode: string, nextNational: string) => {
    const nextCountry = whatsappCountry(nextCode);
    const local = whatsappDigits(nextNational).slice(0, nextCountry.nationalLength);
    setCode(nextCode);
    onChange(joinWhatsappNumber(nextCode, local));
  };

  return (
    <div className={`ds-whatsapp ${variant === "setup" ? "is-setup" : "is-settings"}`}>
      <label className="ds-whatsapp-code" htmlFor={`${id}-code`}>
        <span className="sr-only">Country code</span>
        <select
          id={`${id}-code`}
          value={activeCode}
          onChange={(event) => emit(event.target.value, national)}
          aria-label="Country code"
        >
          {WHATSAPP_COUNTRIES.map((item) => (
            <option key={item.code} value={item.code}>
              +{item.code} {item.name}
            </option>
          ))}
        </select>
        <strong>+{activeCode}</strong>
      </label>
      <input
        id={id}
        type="tel"
        inputMode="numeric"
        value={national}
        onChange={(event) =>
          emit(
            activeCode,
            whatsappDigits(event.target.value).slice(0, country.nationalLength),
          )
        }
        placeholder="Number for customer enquiries"
        autoComplete="tel-national"
        aria-label="WhatsApp number"
      />
    </div>
  );
};

export default WhatsAppNumberField;
