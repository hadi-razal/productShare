"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch, type FieldPathValue } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock3,
  Sparkles,
  ShieldCheck,
  Shirt,
  Gem,
  Armchair,
  Laptop,
  Lamp,
  SprayCan,
  Utensils,
  Blocks,
  Car,
  Factory,
  Package,
  Shapes,
  Link2,
  MessageCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getCurrentUser, ensureStoreForUser } from "@/lib/auth";
import { getStoreById } from "@/lib/db";
import { isUsernameAvailable } from "@/helpers/username";
import { isValidUsername, normalizeUsername } from "@/lib/username-rules";
import { uploadPublicFile } from "@/lib/storage";
import {
  markOnboardingLocallyComplete,
  needsStoreOnboarding,
} from "@/lib/store-profile";
import {
  categories,
  defaults,
  onboardingSchema,
  productRanges,
  sharingMethods,
  slugify,
  stepErrors,
  stepFields,
  type OnboardingData,
} from "@/lib/onboarding";
import {
  Brand,
  OnboardingNavigation,
  OnboardingProgress,
  ProductShareSupportCard,
  SelectableCard,
  SetupSummary,
  StoreLogoUploader,
  StorePreview,
} from "./OnboardingComponents";
import "./onboarding.css";

const headings = [
  "Let’s set up your ProductShare store",
  "What should we call you?",
  "Tell us about your store",
  "What type of business do you run?",
  "How do you currently share your products?",
  "Make your catalogue yours",
  "Everything looks good",
];
const descriptions = [
  "Answer a few quick questions and we’ll prepare your digital product catalogue.",
  "This helps us personalize your ProductShare experience.",
  "This information will appear on your digital product catalogue.",
  "Choose the category that best describes your products.",
  "This helps us prepare the right ProductShare experience for you.",
  "Choose how customers will recognize and access your store.",
  "Review your store details before creating your ProductShare catalogue.",
];
const categoryIcons = [
  Shirt,
  Gem,
  Armchair,
  Laptop,
  Lamp,
  SprayCan,
  Utensils,
  Blocks,
  Car,
  Factory,
  Package,
  Shapes,
];

export default function OnboardingFlow() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const form = useForm<OnboardingData>({
    defaultValues: defaults,
    resolver: zodResolver(onboardingSchema),
    mode: "onChange",
  });
  const {
    register,
    setValue,
    reset,
    getValues,
    formState: { errors, dirtyFields },
  } = form;
  const data = useWatch({ control: form.control }) as OnboardingData;
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [userId, setUserId] = useState("");
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("Getting ready");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paused, setPaused] = useState(false);
  const [seconds, setSeconds] = useState(10);
  const [availability, setAvailability] = useState<{
    slug: string;
    state: "checking" | "available" | "taken" | "error";
  }>({ slug: "", state: "checking" });
  const [checkAttempt, setCheckAttempt] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const busy = useRef(false);
  const restoredSlug = useRef(false);
  const restoredWhatsapp = useRef(false);
  const lastSaved = useRef("");
  const pendingSave = useRef<Promise<void>>(Promise.resolve());
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          router.replace("/login");
          return;
        }
        await ensureStoreForUser(user);
        const [store, draft] = await Promise.all([
          getStoreById(user.uid),
          supabase
            .from("store_onboarding")
            .select("details,onboarding_step,onboarding_completed")
            .eq("user_id", user.uid)
            .maybeSingle(),
        ]);
        if (cancelled) return;
        if (draft.error)
          throw new Error(
            "We couldn’t load your saved setup. Please retry. If this continues, contact support.",
          );
        if (
          draft.data?.onboarding_completed ||
          (store && !needsStoreOnboarding(store))
        ) {
          router.replace("/store");
          return;
        }
        const initial = {
          ...defaults,
          full_name: user.displayName || "",
          email: user.email || "",
          store_name: store?.name || "",
          store_slug: store?.username || "",
          store_logo_url: store?.logoImage || "",
          store_description: store?.description || "",
          whatsapp_number: store?.whatsappNumber || "",
          ...draft.data?.details,
        };
        const restoredStep = Math.max(
          0,
          Math.min(6, draft.data?.onboarding_step || 0),
        );
        restoredSlug.current = Boolean(draft.data?.details?.store_slug);
        restoredWhatsapp.current = Boolean(
          draft.data?.details?.whatsapp_number,
        );
        reset(initial);
        setStep(restoredStep);
        setUserId(user.uid);
        lastSaved.current = JSON.stringify({
          details: initial,
          step: restoredStep,
        });
        setStatus(draft.data ? "Progress restored" : "Saved as you go");
        setReady(true);
        setLoadError("");
      } catch (err) {
        if (!cancelled)
          setLoadError(
            err instanceof Error
              ? err.message
              : "Unable to load setup. Please retry.",
          );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reset, router, reload]);

  const persist = useCallback(
    (details: OnboardingData, nextStep: number) => {
      const snapshot = JSON.stringify({ details, step: nextStep });
      const operation = pendingSave.current
        .catch(() => {})
        .then(async () => {
          setStatus("Saving progress…");
          const { error: saveError } = await supabase
            .from("store_onboarding")
            .upsert({
              user_id: userId,
              details,
              onboarding_step: nextStep,
              onboarding_completed: false,
              updated_at: new Date().toISOString(),
            });
          if (saveError) {
            setStatus("Progress not saved");
            throw new Error(
              "Your progress couldn’t be saved. Check your connection and retry.",
            );
          }
          lastSaved.current = snapshot;
          setStatus("Progress saved");
        });
      pendingSave.current = operation;
      return operation;
    },
    [userId],
  );

  const snapshot = JSON.stringify({ details: data, step });
  useEffect(() => {
    if (!ready || success || saving || snapshot === lastSaved.current) return;
    const timer = setTimeout(() => {
      void persist(getValues(), step).catch((err) => setError(err.message));
    }, 1000);
    return () => clearTimeout(timer);
  }, [snapshot, ready, success, saving, persist, getValues, step]);
  useEffect(() => {
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (!success && ready && snapshot !== lastSaved.current) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [snapshot, ready, success]);
  useEffect(() => {
    if (ready) headingRef.current?.focus();
  }, [step, ready, success]);
  useEffect(() => {
    if (!ready || dirtyFields.store_slug || restoredSlug.current) return;
    if (data.store_name) setValue("store_slug", slugify(data.store_name));
  }, [data.store_name, dirtyFields.store_slug, ready, setValue]);
  useEffect(() => {
    if (
      ready &&
      !dirtyFields.whatsapp_number &&
      !restoredWhatsapp.current &&
      data.contact_number
    )
      setValue(
        "whatsapp_number",
        data.country_code.replace("+", "") + data.contact_number,
      );
  }, [
    data.contact_number,
    data.country_code,
    dirtyFields.whatsapp_number,
    ready,
    setValue,
  ]);
  useEffect(() => {
    if (!ready || !isValidUsername(data.store_slug)) return;
    let active = true;
    setAvailability({ slug: data.store_slug, state: "checking" });
    const timer = setTimeout(async () => {
      try {
        const available = await isUsernameAvailable(data.store_slug, userId);
        if (active)
          setAvailability({
            slug: data.store_slug,
            state: available ? "available" : "taken",
          });
      } catch {
        if (active) setAvailability({ slug: data.store_slug, state: "error" });
      }
    }, 450);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [data.store_slug, userId, ready, checkAttempt]);
  useEffect(() => {
    if (!success || paused) return;
    if (seconds === 0) {
      router.replace("/store");
      return;
    }
    const timer = setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [success, paused, seconds, router]);

  const go = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
    setError("");
  };
  const update = <K extends keyof OnboardingData>(
    key: K,
    value: OnboardingData[K],
  ) =>
    setValue(key, value as FieldPathValue<OnboardingData, K>, {
      shouldDirty: true,
      shouldValidate: true,
    });
  const valid =
    stepErrors(data, step).length === 0 &&
    (step < 5 ||
      (availability.slug === data.store_slug &&
        availability.state === "available"));
  const submit = async () => {
    if (busy.current || uploading) return;
    const issues = stepErrors(getValues(), step);
    if (issues.length) {
      await form.trigger(step === 6 ? undefined : stepFields[step]);
      return;
    }
    if (!valid) return;
    busy.current = true;
    setSaving(true);
    setError("");
    try {
      if (step < 6) {
        await persist(getValues(), step + 1);
        go(step + 1);
      } else {
        const values = onboardingSchema.parse(getValues());
        await persist(values, 6);
        const { data: session } = await supabase.auth.getSession();
        const response = await fetch("/api/onboarding", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.session?.access_token || ""}`,
          },
          body: JSON.stringify(values),
        });
        const result = await response.json();
        if (!response.ok) {
          if (response.status === 409) {
            go(5);
            setCheckAttempt((value) => value + 1);
          }
          throw new Error(result.error);
        }
        markOnboardingLocallyComplete(userId);
        setSuccess(true);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please retry.",
      );
    } finally {
      setSaving(false);
      busy.current = false;
    }
  };
  const upload = async (file: File) => {
    if (
      !/^(image\/png|image\/jpeg|image\/webp)$/.test(file.type) ||
      file.size > 1024 * 1024
    ) {
      setError("Choose a JPG, PNG or WebP image under 1 MB.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const url = await uploadPublicFile(
        `images/onboarding_${userId}_${crypto.randomUUID()}.${file.type.split("/")[1]}`,
        file,
      );
      update("store_logo_url", url);
    } catch {
      setError("Your logo couldn’t be uploaded. Please try again.");
    } finally {
      setUploading(false);
    }
  };
  const field = (
    name: keyof OnboardingData,
    label: string,
    placeholder: string,
    extra: React.InputHTMLAttributes<HTMLInputElement> = {},
  ) => (
    <div className="ob-field">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        placeholder={placeholder}
        {...register(name)}
        {...extra}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
      />
      {errors[name] && (
        <p className="ob-field-error" id={`${name}-error`} role="alert">
          {String(errors[name]?.message)}
        </p>
      )}
    </div>
  );

  if (!ready)
    return (
      <div className="ob-loading">
        <Brand />
        {loadError ? (
          <>
            <p role="alert">{loadError}</p>
            <button
              className="ob-primary"
              onClick={() => {
                setLoadError("");
                setReload((value) => value + 1);
              }}
            >
              Retry
            </button>
            <a href="mailto:admin@duoph.in">Contact support</a>
          </>
        ) : (
          <>
            <span className="ob-spinner" />
            <p>Preparing your store setup…</p>
          </>
        )}
      </div>
    );
  if (success)
    return (
      <div className="ob-success">
        <motion.div
          initial={{ opacity: 0, scale: reduced ? 1 : 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <span className="ob-success-icon">
            <Check size={32} />
          </span>
          <p className="ob-eyebrow">YOU’RE ALL SET</p>
          <h1 tabIndex={-1} ref={headingRef}>
            Your ProductShare store is ready!
          </h1>
          <p>
            You can now add products, customize your catalogue and share it with
            customers.
          </p>
          <ProductShareSupportCard />
          <button
            className="ob-primary"
            onClick={() => router.replace("/store")}
          >
            Go to dashboard <ArrowRight size={18} />
          </button>
          <p className="ob-redirect" role="status">
            {paused
              ? "Automatic redirect paused."
              : `Taking you to your dashboard in ${seconds}s.`}{" "}
            <button onClick={() => setPaused((value) => !value)}>
              {paused ? "Resume" : "Pause redirect"}
            </button>
          </p>
        </motion.div>
      </div>
    );

  return (
    <div className="ob-root">
      <section className="ob-panel" aria-label="Store setup">
        <header className="ob-header">
          <Brand />
          <a href="mailto:admin@duoph.in">Need help?</a>
        </header>
        <OnboardingProgress step={step} status={status} />
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void submit();
          }}
          noValidate
          onKeyDown={(event) => {
            if (
              event.key === "Enter" &&
              (event.target as HTMLElement).tagName === "INPUT"
            ) {
              event.preventDefault();
              void submit();
            }
          }}
        >
          <div className="ob-step-scroll">
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={{
                  enter: (d: number) => ({
                    opacity: 0,
                    x: reduced ? 0 : d * 24,
                  }),
                  center: { opacity: 1, x: 0 },
                  exit: (d: number) => ({
                    opacity: 0,
                    x: reduced ? 0 : d * -24,
                  }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: reduced ? 0 : 0.2 }}
                onAnimationComplete={() => headingRef.current?.focus()}
              >
                {step === 0 && (
                  <div className="ob-welcome-art" aria-hidden="true">
                    <div className="ob-art-tile">
                      <Package size={38} strokeWidth={1.4} />
                      <span>Your next chapter</span>
                    </div>
                    <span className="ob-art-link">
                      <Link2 size={23} />
                    </span>
                    <span className="ob-art-check">
                      <Check size={20} />
                    </span>
                    <Sparkles className="ob-art-sparkle" size={24} />
                  </div>
                )}
                <p className="ob-eyebrow">
                  {
                    [
                      "A BIG STEP FOR YOUR BUSINESS",
                      "FIRST, A QUICK INTRODUCTION",
                      "LET’S MEET YOUR BRAND",
                      "FIND YOUR CORNER",
                      "A LITTLE ABOUT YOUR BUSINESS",
                      "THE FINISHING TOUCHES",
                      "READY WHEN YOU ARE",
                    ][step]
                  }
                </p>
                <h1 tabIndex={-1} ref={headingRef}>
                  {step === 6
                    ? `Everything looks good, ${data.full_name.split(" ")[0]}!`
                    : headings[step]}
                </h1>
                <p className="ob-description">{descriptions[step]}</p>
                <div className="ob-fields">
                  {step === 0 && (
                    <>
                      <div className="ob-welcome-benefits">
                        <div>
                          <span>
                            <Package size={18} />
                          </span>
                          <div>
                            <strong>
                              Your products, beautifully presented
                            </strong>
                            <p>A professional catalogue that feels like you.</p>
                          </div>
                        </div>
                        <div>
                          <span>
                            <Link2 size={18} />
                          </span>
                          <div>
                            <strong>One link. Ready to share.</strong>
                            <p>Reach your customers wherever they are.</p>
                          </div>
                        </div>
                        <div>
                          <span>
                            <MessageCircle size={18} />
                          </span>
                          <div>
                            <strong>Turn browsing into conversations</strong>
                            <p>Let customers connect with you directly.</p>
                          </div>
                        </div>
                      </div>
                      <p className="ob-time">
                        <Clock3 size={15} /> This takes less than 2 minutes
                      </p>
                    </>
                  )}
                  {step === 1 && (
                    <>
                      {field("full_name", "Full name", "e.g. Ananya Sharma", {
                        autoComplete: "name",
                        maxLength: 100,
                      })}
                      <div className="ob-field">
                        <label htmlFor="contact_number">Contact number</label>
                        <div className="ob-phone">
                          <select
                            aria-label="Country calling code"
                            {...register("country_code")}
                          >
                            {["+91", "+1", "+44", "+971", "+61"].map((code) => (
                              <option key={code}>{code}</option>
                            ))}
                          </select>
                          <input
                            id="contact_number"
                            inputMode="tel"
                            autoComplete="tel-national"
                            placeholder="98765 43210"
                            value={data.contact_number}
                            onChange={(event) =>
                              update(
                                "contact_number",
                                event.target.value.replace(/\D/g, ""),
                              )
                            }
                            aria-describedby="contact-error"
                            aria-invalid={Boolean(errors.contact_number)}
                          />
                        </div>
                        <p id="contact-error" className="ob-field-error">
                          {errors.contact_number?.message}
                        </p>
                      </div>
                      {field("email", "Email address", "you@example.com", {
                        type: "email",
                        autoComplete: "email",
                      })}
                      <p className="ob-hint">
                        <ShieldCheck size={15} /> Your personal details stay
                        private.
                      </p>
                    </>
                  )}
                  {step === 2 && (
                    <>
                      <StoreLogoUploader
                        url={data.store_logo_url}
                        name={data.store_name}
                        busy={uploading}
                        onUpload={(file) => void upload(file)}
                      />
                      {field(
                        "store_name",
                        "Store or business name",
                        "e.g. The Everyday Edit",
                        { autoComplete: "organization", maxLength: 100 },
                      )}
                      <div className="ob-field">
                        <label htmlFor="store_description">
                          Short description <span>Optional</span>
                        </label>
                        <textarea
                          id="store_description"
                          rows={3}
                          maxLength={160}
                          placeholder="A little about what makes your store special…"
                          {...register("store_description")}
                        />
                        <small>{data.store_description.length}/160</small>
                      </div>
                      <div className="ob-field-row">
                        {field("city", "City", "e.g. Kochi", {
                          autoComplete: "address-level2",
                        })}
                        {field("state", "State", "e.g. Kerala", {
                          autoComplete: "address-level1",
                        })}
                      </div>
                    </>
                  )}
                  {step === 3 && (
                    <>
                      <div className="ob-choice-grid">
                        {categories.map((category, index) => {
                          const Icon = categoryIcons[index];
                          return (
                            <SelectableCard
                              key={category}
                              selected={data.business_category === category}
                              onClick={() =>
                                update("business_category", category)
                              }
                            >
                              <Icon size={19} />
                              {category}
                            </SelectableCard>
                          );
                        })}
                      </div>
                      {data.business_category === "Other" &&
                        field(
                          "custom_business_category",
                          "Your business category",
                          "Tell us what you sell",
                          { maxLength: 80 },
                        )}
                    </>
                  )}
                  {step === 4 && (
                    <>
                      <div className="ob-methods">
                        {sharingMethods.map((method) => (
                          <SelectableCard
                            multiple
                            key={method}
                            selected={data.catalogue_sharing_methods.includes(
                              method,
                            )}
                            onClick={() => {
                              const none = "I don’t have a catalogue yet";
                              update(
                                "catalogue_sharing_methods",
                                data.catalogue_sharing_methods.includes(method)
                                  ? data.catalogue_sharing_methods.filter(
                                      (item) => item !== method,
                                    )
                                  : method === none
                                    ? [method]
                                    : [
                                        ...data.catalogue_sharing_methods.filter(
                                          (item) => item !== none,
                                        ),
                                        method,
                                      ],
                              );
                            }}
                          >
                            {method}
                          </SelectableCard>
                        ))}
                      </div>
                      <fieldset className="ob-range">
                        <legend>
                          Approximately how many products do you have?
                        </legend>
                        <div>
                          {productRanges.map((range) => (
                            <button
                              type="button"
                              key={range}
                              aria-pressed={data.product_count_range === range}
                              className={
                                data.product_count_range === range
                                  ? "is-selected"
                                  : ""
                              }
                              onClick={() =>
                                update("product_count_range", range)
                              }
                            >
                              {range}
                            </button>
                          ))}
                        </div>
                      </fieldset>
                    </>
                  )}
                  {step === 5 && (
                    <>
                      <div className="ob-field">
                        <label htmlFor="store_slug">Your catalogue link</label>
                        <div className="ob-url">
                          <span>productshare.in/store/</span>
                          <input
                            id="store_slug"
                            value={data.store_slug}
                            onChange={(event) =>
                              update(
                                "store_slug",
                                normalizeUsername(event.target.value).slice(
                                  0,
                                  30,
                                ),
                              )
                            }
                            autoComplete="off"
                            spellCheck={false}
                            aria-describedby="slug-status"
                          />
                        </div>
                        <p
                          id="slug-status"
                          className={`ob-slug-status ${availability.state === "available" ? "available" : ""}`}
                          role="status"
                        >
                          {!isValidUsername(data.store_slug)
                            ? "Use 3–30 letters, numbers or hyphens; no hyphens at either end."
                            : availability.slug !== data.store_slug ||
                                availability.state === "checking"
                              ? "Checking availability…"
                              : availability.state === "available"
                                ? "✓ Available — this link can be yours"
                                : availability.state === "taken"
                                  ? "Already taken. Try an alternative below."
                                  : "Couldn’t check availability."}
                        </p>
                        {availability.state === "error" && (
                          <button
                            type="button"
                            className="ob-text-button"
                            onClick={() =>
                              setCheckAttempt((value) => value + 1)
                            }
                          >
                            Retry availability check
                          </button>
                        )}
                        {availability.state === "taken" && (
                          <div className="ob-suggestions">
                            {["shop", "store", "co"].map((suffix) => (
                              <button
                                type="button"
                                key={suffix}
                                onClick={() =>
                                  update(
                                    "store_slug",
                                    `${data.store_slug.slice(0, 23)}-${suffix}`,
                                  )
                                }
                              >
                                {data.store_slug.slice(0, 23)}-{suffix}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="ob-field">
                        <label htmlFor="brand_color">Brand colour</label>
                        <div className="ob-colors">
                          {[
                            "#6860C9",
                            "#2D6A4F",
                            "#C06549",
                            "#276A9E",
                            "#17171C",
                          ].map((color) => (
                            <button
                              key={color}
                              type="button"
                              style={{ background: color }}
                              aria-label={`Use ${color}`}
                              aria-pressed={data.brand_color === color}
                              onClick={() => update("brand_color", color)}
                            >
                              {data.brand_color === color && (
                                <Check size={18} />
                              )}
                            </button>
                          ))}
                          <input
                            id="brand_color"
                            type="color"
                            {...register("brand_color")}
                          />
                          <span>{data.brand_color.toUpperCase()}</span>
                        </div>
                      </div>
                      {field(
                        "whatsapp_number",
                        "WhatsApp enquiry number",
                        "919876543210",
                        { inputMode: "tel" },
                      )}
                      <p className="ob-hint">
                        We’ve used your contact number. Change it if your
                        business uses another.
                      </p>
                      {(
                        [
                          "show_whatsapp_button",
                          "allow_product_enquiries",
                        ] as const
                      ).map((key, index) => (
                        <label className="ob-toggle" key={key}>
                          <span>
                            {index === 0
                              ? "Show WhatsApp button"
                              : "Allow direct product enquiries"}
                          </span>
                          <input type="checkbox" {...register(key)} />
                          <span className="ob-switch" aria-hidden="true" />
                        </label>
                      ))}
                      <div className="ob-field">
                        <label htmlFor="currency">Preferred currency</label>
                        <select id="currency" {...register("currency")}>
                          {["INR", "USD", "EUR", "GBP", "AED"].map(
                            (currency) => (
                              <option key={currency}>{currency}</option>
                            ),
                          )}
                        </select>
                      </div>
                    </>
                  )}
                  {step === 6 && <SetupSummary data={data} edit={go} />}
                </div>
              </motion.div>
            </AnimatePresence>
            {error && (
              <div className="ob-error" role="alert">
                {error}
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => {
                    setError("");
                    void persist(getValues(), step).catch((err) =>
                      setError(err.message),
                    );
                  }}
                >
                  Retry saving progress
                </button>
              </div>
            )}
            <details className="ob-mobile-preview">
              <summary>
                Preview your store <ChevronDown size={17} />
              </summary>
              <StorePreview data={data} />
            </details>
          </div>
          <OnboardingNavigation
            step={step}
            busy={saving || uploading}
            valid={valid}
            back={() => go(step - 1)}
            retry={Boolean(error)}
          />
          <p className="ob-bottom-note">
            {step === 0
              ? "A small setup. A whole new way to share."
              : "You can update your store details anytime."}
          </p>
        </form>
      </section>
      <aside className="ob-preview-panel" aria-label="Live catalogue preview">
        <StorePreview data={data} />
        <div className="ob-preview-bottom">
          <ShieldCheck size={14} /> Built for your business. Designed for your
          customers.
        </div>
      </aside>
    </div>
  );
}
