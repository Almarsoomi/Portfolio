"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type FormEvent,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/components/use-reduced-motion";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookCheck,
  BookOpen,
  Bot,
  Briefcase,
  CalendarCheck,
  Check,
  Clock,
  Compass,
  Eraser,
  Factory,
  FileSpreadsheet,
  Globe,
  HardHat,
  Landmark,
  Laptop,
  LayoutDashboard,
  Loader2,
  Mail,
  MessageCircle,
  Pencil,
  Percent,
  Puzzle,
  Receipt,
  RefreshCw,
  Rocket,
  RotateCcw,
  Send,
  Settings2,
  Shapes,
  ShoppingBag,
  Sparkles,
  Store,
  UtensilsCrossed,
  Zap,
  type LucideProps,
} from "lucide-react";
import type { FormGroup, FormIcon, FormStep, PathKey } from "@/data/portfolio";
import { EMAILJS, EMAIL_ACCENTS, emailjsReady } from "@/data/emailjs";
import { useContent, useLang } from "./i18n";
import CountryCodePicker, { DEFAULT_COUNTRY, countryFromNumber, dialCode } from "./CountryCodePicker";
import { smoothScrollTo } from "./lenis-store";
import { EASE } from "./motion-primitives";

const ICONS: Record<FormIcon, ComponentType<LucideProps>> = {
  globe: Globe,
  dashboard: LayoutDashboard,
  calendar: CalendarCheck,
  cart: ShoppingBag,
  bot: Bot,
  sparkles: Sparkles,
  rocket: Rocket,
  refresh: RefreshCw,
  puzzle: Puzzle,
  book: BookOpen,
  settings: Settings2,
  percent: Percent,
  landmark: Landmark,
  eraser: Eraser,
  chart: BarChart3,
  store: Store,
  factory: Factory,
  briefcase: Briefcase,
  hardhat: HardHat,
  utensils: UtensilsCrossed,
  shapes: Shapes,
  bookcheck: BookCheck,
  laptop: Laptop,
  sheet: FileSpreadsheet,
  receipt: Receipt,
  zap: Zap,
  clock: Clock,
  compass: Compass,
};

type Answers = Record<string, string[]>;
type Preferred = "email" | "whatsapp" | "either";
type Status = "idle" | "sending" | "sent" | "error";

interface Details {
  name: string;
  company: string;
  email: string;
  /** Local number, without the country code. */
  whatsapp: string;
  /** Country for the WhatsApp number, ISO code ("AE"). */
  waCountry: string;
  preferred: Preferred;
  message: string;
  /** Honeypot — real visitors never see or fill it. */
  website: string;
}

type ErrorKey = "name" | "contact" | "email" | "whatsapp";

const EMPTY_DETAILS: Details = {
  name: "",
  company: "",
  email: "",
  whatsapp: "",
  waCountry: DEFAULT_COUNTRY,
  preferred: "either",
  message: "",
  website: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Full international number, digits only: AE + "050 123 4567" → "971501234567". */
function waDigits(iso: string, raw: string): string {
  const local = raw.replace(/\D/g, "").replace(/^0+/, "");
  return local ? dialCode(iso) + local : "";
}

/** "+971 50 123 4567" for the email. */
function waDisplay(iso: string, raw: string): string {
  const local = raw.trim().replace(/^0+/, "");
  return local ? `+${dialCode(iso)} ${local}` : "";
}

function isAnswered(group: FormGroup, answers: Answers) {
  return group.optional || (answers[group.id]?.length ?? 0) > 0;
}

function makeRef() {
  const t = Date.now().toString(36).toUpperCase().slice(-4);
  const r = Math.random().toString(36).toUpperCase().slice(2, 4);
  return `AH-${t}${r}`;
}

export default function ContactWizard({ path }: { path: PathKey }) {
  const { contactForm } = useContent();
  const lang = useLang();
  const reduce = useReducedMotion();
  const { ui } = contactForm;
  const flow = contactForm[path];
  const steps = flow.steps;
  const total = steps.length + 1; // + details step
  const rtl = lang === "ar";

  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  /** Furthest step reached — earlier ones can be jumped to from the progress bar. */
  const [maxStep, setMaxStep] = useState(0);
  /** Set while editing an earlier answer: where "Back to summary" returns to. */
  const [returnTo, setReturnTo] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [details, setDetails] = useState<Details>(EMPTY_DETAILS);
  const [errors, setErrors] = useState<Partial<Record<ErrorKey, string>>>({});
  const [shake, setShake] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [reference, setReference] = useState("");

  const advanceTimer = useRef<number | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const interacted = useRef(false);

  const clearTimer = () => {
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    advanceTimer.current = null;
  };
  useEffect(() => clearTimer, []);

  const goTo = useCallback(
    (next: number) => {
      clearTimer();
      interacted.current = true;
      const target = Math.max(0, Math.min(total - 1, next));
      setDir(target > step ? 1 : -1);
      setStep(target);
      setMaxStep((m) => Math.max(m, target));
      setReturnTo((r) => (r !== null && target >= r ? null : r));
    },
    [step, total],
  );

  /** Jump back to an earlier answer, remembering where to come back to. */
  const editStep = useCallback(
    (target: number) => {
      if (target < step) setReturnTo((r) => Math.max(r ?? 0, step));
      goTo(target);
    },
    [goTo, step],
  );

  const panelRef = useRef<HTMLDivElement>(null);

  // Move focus to the new question so keyboard and screen-reader users follow
  // along, and bring the panel back into view if the visitor scrolled past its top.
  useEffect(() => {
    if (!interacted.current) return;
    headingRef.current?.focus({ preventScroll: true });
    const top = panelRef.current?.getBoundingClientRect().top ?? 0;
    if (panelRef.current && top < 64) smoothScrollTo(panelRef.current, { offset: -96, duration: 0.7 });
  }, [step, status]);

  const current: FormStep | undefined = steps[step];
  const stepComplete = current ? current.groups.every((g) => isAnswered(g, answers)) : true;

  function pick(group: FormGroup, optionId: string) {
    clearTimer();
    const prev = answers[group.id] ?? [];
    const nextValues = group.multi
      ? prev.includes(optionId)
        ? prev.filter((v) => v !== optionId)
        : [...prev, optionId]
      : [optionId];
    const nextAnswers = { ...answers, [group.id]: nextValues };
    setAnswers(nextAnswers);

    // Smart advance: when every question on this step is single-choice and now
    // answered, glide on to the next step by itself.
    const step_ = steps[step];
    const allSingle = step_.groups.every((g) => !g.multi);
    if (!group.multi && allSingle && step_.groups.every((g) => isAnswered(g, nextAnswers))) {
      // While editing, a pick goes straight back to the summary.
      const target = returnTo ?? step + 1;
      advanceTimer.current = window.setTimeout(() => goTo(target), reduce ? 150 : 480);
    }
  }

  /** Answered questions, in order — feeds the live brief and the email. */
  const brief = useMemo(() => {
    const rows: { step: number; group: FormGroup; values: string[] }[] = [];
    steps.forEach((s, i) =>
      s.groups.forEach((g) => {
        const ids = answers[g.id] ?? [];
        if (!ids.length) return;
        const values = g.options.filter((o) => ids.includes(o.id)).map((o) => o.label);
        rows.push({ step: i, group: g, values });
      }),
    );
    return rows;
  }, [answers, steps]);

  function validate(): boolean {
    const e: Partial<Record<ErrorKey, string>> = {};
    const email = details.email.trim();
    const wa = waDigits(details.waCountry, details.whatsapp);
    if (!details.name.trim()) e.name = ui.errors.name;
    if (!email && !details.whatsapp.trim()) e.contact = ui.errors.contact;
    if (email && !EMAIL_RE.test(email)) e.email = ui.errors.email;
    if (details.whatsapp.trim() && wa.length < 9) e.whatsapp = ui.errors.whatsapp;
    setErrors(e);
    if (Object.keys(e).length) setShake((n) => n + 1);
    return !Object.keys(e).length;
  }

  function buildMessage(ref: string) {
    const prefLabel = ui.preferredOptions[details.preferred];
    const answersText = brief.map((r) => `${r.group.summary}: ${r.values.join(", ")}`).join("\n");
    const wa = waDigits(details.waCountry, details.whatsapp);
    const esc = (s: string) =>
      s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
    const answersHtml = brief
      .map(
        (r) =>
          `<tr><td style="padding:6px 12px 6px 0;color:#8b98b3;white-space:nowrap;vertical-align:top">${esc(
            r.group.summary,
          )}</td><td style="padding:6px 0;font-weight:600">${esc(r.values.join(", "))}</td></tr>`,
      )
      .join("");
    const title = `${ui.emailSubject}: ${flow.label} — ${details.name.trim()}`;
    return {
      title,
      request_type: flow.label,
      name: details.name.trim(),
      company: details.company.trim() || "—",
      email: details.email.trim(),
      reply_to: details.email.trim(),
      whatsapp: waDisplay(details.waCountry, details.whatsapp) || "—",
      whatsapp_link: wa ? `https://wa.me/${wa}` : "",
      preferred_contact: prefLabel,
      message: details.message.trim() || "—",
      answers: answersText,
      answers_html: `<table style="border-collapse:collapse">${answersHtml}</table>`,
      ref,
      lang,
      page: typeof window !== "undefined" ? window.location.href : "",
      submitted_at: new Date().toLocaleString("en-GB", { timeZone: "Asia/Dubai" }) + " (Dubai)",
      ...EMAIL_ACCENTS[path],
    };
  }

  async function submit(e?: FormEvent) {
    e?.preventDefault();
    interacted.current = true;
    if (status === "sending" || !validate()) return;
    const ref = reference || makeRef();
    setReference(ref);

    // Bots fill the hidden field — pretend it worked and send nothing.
    if (details.website) {
      setStatus("sent");
      return;
    }
    // Not connected to EmailJS yet (see docs/emailjs-setup.md).
    if (!emailjsReady) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      const emailjs = (await import("@emailjs/browser")).default;
      await emailjs.send(EMAILJS.serviceId, EMAILJS.templateId, buildMessage(ref), {
        publicKey: EMAILJS.publicKey,
        blockHeadless: true,
        limitRate: { id: "contact-form", throttle: 15000 },
      });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  function reset() {
    interacted.current = true;
    setAnswers({});
    setDetails(EMPTY_DETAILS);
    setErrors({});
    setReference("");
    setDir(-1);
    setStep(0);
    setMaxStep(0);
    setReturnTo(null);
    setStatus("idle");
  }

  const done = status === "sent";
  // Steps enter with a plain CSS animation (see .wizard-step in globals.css).
  // Framer's hardware-accelerated opacity/filter animations could get stuck at
  // their first frame on iOS Safari, leaving a step invisible.
  const slide = 40 * dir * (rtl ? -1 : 1);
  const BackIcon = rtl ? ArrowRight : ArrowLeft;
  const NextIcon = rtl ? ArrowLeft : ArrowRight;

  return (
    <div className="grid gap-6 text-start lg:grid-cols-[minmax(0,1fr)_17rem]">
      <div ref={panelRef} className="min-w-0 rounded-2xl border border-edge bg-surface/70 p-4 sm:p-6">
        {!done ? (
          <Progress
            step={step}
            total={total}
            titles={[...steps.map((s) => s.title), ui.detailsTitle]}
            canReach={(i) =>
              i !== step && i <= maxStep && steps.slice(0, i).every((s) => s.groups.every((g) => isAnswered(g, answers)))
            }
            onJump={(i) => (i < step ? editStep(i) : goTo(i))}
            ui={ui}
          />
        ) : null}

        <AutoHeight>
          {done ? (
              <Success
                key="done"
                name={details.name.trim().split(" ")[0]}
                reference={reference}
                hasEmail={Boolean(details.email.trim())}
                headingRef={headingRef}
                onReset={reset}
                ui={ui}
              />
            ) : (
              <div
                key={step}
                className={`pt-5 ${interacted.current ? "wizard-step" : ""}`}
                style={{ "--wizard-dx": `${slide}px` } as React.CSSProperties}
              >
                {current ? (
                  <>
                    <StepHeading headingRef={headingRef} title={current.title} subtitle={current.subtitle} />
                    <div className="mt-6 space-y-7">
                      {current.groups.map((g) => (
                        <OptionGroup
                          key={g.id}
                          group={g}
                          showLabel={current.groups.length > 1}
                          selected={answers[g.id] ?? []}
                          onPick={(id) => pick(g, id)}
                          ui={ui}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <DetailsStep
                    details={details}
                    setDetails={(d) => {
                      setDetails(d);
                      if (Object.keys(errors).length) setErrors({});
                    }}
                    errors={errors}
                    shake={shake}
                    headingRef={headingRef}
                    brief={brief}
                    onEdit={editStep}
                    onSubmit={submit}
                    status={status}
                    ui={ui}
                  />
                )}
              </div>
            )}
        </AutoHeight>

        {!done ? (
          <div className="mt-7 flex items-center justify-between gap-3 border-t border-edge pt-5">
            <button
              type="button"
              onClick={() => goTo(step - 1)}
              disabled={step === 0}
              className="inline-flex h-11 items-center gap-2 rounded-xl px-3 font-display text-sm font-semibold text-ink-muted transition-colors hover:text-ink disabled:pointer-events-none disabled:opacity-0"
            >
              <BackIcon aria-hidden className="h-4 w-4" />
              {ui.back}
            </button>

            {current ? (
              <NextButton
                enabled={stepComplete}
                label={returnTo !== null ? ui.backToSummary : ui.next}
                icon={<NextIcon aria-hidden className="h-4 w-4" />}
                onClick={() => goTo(returnTo ?? step + 1)}
              />
            ) : (
              <SendButton status={status} ui={ui} onClick={() => submit()} rtl={rtl} />
            )}
          </div>
        ) : null}

        {status === "error" ? (
          <motion.div
            role="alert"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex flex-col gap-3 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-ink sm:flex-row sm:items-center"
          >
            <AlertTriangle aria-hidden className="h-5 w-5 shrink-0 text-red-400" />
            <div className="flex-1">
              <p className="font-semibold">{ui.errorTitle}</p>
              <p className="text-ink-muted">{ui.errorText}</p>
            </div>
            <div className="flex flex-wrap gap-2 [&>button]:whitespace-nowrap">
              <button
                type="button"
                onClick={() => submit()}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-edge-strong px-3 font-semibold hover:border-accent/50"
              >
                <RotateCcw aria-hidden className="h-3.5 w-3.5" />
                {ui.retry}
              </button>
            </div>
          </motion.div>
        ) : null}
      </div>

      <Brief brief={brief} ui={ui} label={flow.label} done={done} onEdit={editStep} />
    </div>
  );
}

type UI = ReturnType<typeof useContent>["contactForm"]["ui"];

/* ───────────────────────── Pieces ───────────────────────── */

/** Animates its height to match whatever is inside (steps differ in size). */
function AutoHeight({ children }: { children: ReactNode }) {
  const inner = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | "auto">("auto");
  const reduce = useReducedMotion();
  useLayoutEffect(() => {
    const el = inner.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setHeight(entry.contentRect.height));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <motion.div
      animate={{ height }}
      transition={reduce ? { duration: 0 } : { duration: 0.35, ease: EASE }}
      className="overflow-hidden"
      style={{ marginInline: -6, paddingInline: 6 }}
    >
      <div ref={inner} className="pb-1">
        {children}
      </div>
    </motion.div>
  );
}

function Progress({
  step,
  total,
  titles,
  canReach,
  onJump,
  ui,
}: {
  step: number;
  total: number;
  titles: string[];
  canReach: (i: number) => boolean;
  onJump: (i: number) => void;
  ui: UI;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint rtl:tracking-normal">
        <span>
          {ui.step}{" "}
          <motion.span key={step} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="inline-block text-accent">
            {step + 1}
          </motion.span>{" "}
          {ui.of} {total}
        </span>
        <span className="hidden normal-case tracking-normal sm:inline">{ui.hoursNote}</span>
      </div>
      {/* Each segment is a button: tap any step you've already reached to jump to it. */}
      <nav aria-label={ui.goToStep} className="mt-1.5 flex gap-1.5">
        {Array.from({ length: total }, (_, i) => {
          const reachable = canReach(i);
          return (
            <button
              key={i}
              type="button"
              disabled={!reachable}
              onClick={() => onJump(i)}
              aria-current={i === step ? "step" : undefined}
              aria-label={`${ui.step} ${i + 1} ${ui.of} ${total}: ${titles[i]}`}
              title={titles[i]}
              className={`group/seg relative flex-1 py-2 ${reachable ? "cursor-pointer" : "cursor-default"}`}
            >
              <span
                className={`relative block h-1.5 overflow-hidden rounded-full bg-edge transition-transform ${
                  reachable ? "group-hover/seg:scale-y-[1.6]" : ""
                }`}
              >
                <motion.span
                  className="absolute inset-0 origin-left rounded-full bg-gradient-to-r from-accent to-accent-deep rtl:origin-right"
                  initial={false}
                  animate={{ scaleX: i < step ? 1 : i === step ? 0.5 : 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  style={i === step ? { boxShadow: "0 0 12px rgb(var(--color-accent) / 0.7)" } : undefined}
                />
                {/* Reached steps ahead of you stay softly lit, so it's clear you can jump back to them. */}
                {i > step && reachable ? (
                  <span aria-hidden className="absolute inset-0 rounded-full bg-accent/35" />
                ) : null}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function StepHeading({
  title,
  subtitle,
  headingRef,
}: {
  title: string;
  subtitle: string;
  headingRef: React.RefObject<HTMLHeadingElement>;
}) {
  return (
    <div>
      <h3
        ref={headingRef}
        tabIndex={-1}
        className="font-display text-xl font-semibold tracking-tight text-ink outline-none sm:text-2xl"
      >
        {title}
      </h3>
      <p className="mt-1.5 text-sm text-ink-muted sm:text-base">{subtitle}</p>
    </div>
  );
}

function OptionGroup({
  group,
  showLabel,
  selected,
  onPick,
  ui,
}: {
  group: FormGroup;
  showLabel: boolean;
  selected: string[];
  onPick: (id: string) => void;
  ui: UI;
}) {
  const cards = group.options.some((o) => o.icon);
  const reduce = useReducedMotion();
  return (
    <fieldset>
      <legend className={showLabel ? "mb-3 flex flex-wrap items-baseline gap-x-2 text-sm font-semibold text-ink" : "sr-only"}>
        {group.label ?? group.summary}
        <span className="text-xs font-normal text-ink-faint">
          {group.multi ? ui.pickAny : ui.pickOne}
          {group.optional ? ` · ${ui.optional}` : ""}
        </span>
      </legend>
      <div
        className={
          cards
            ? `grid gap-2.5 ${group.options.length > 4 ? "grid-cols-2 sm:grid-cols-3" : group.options.length === 4 ? "grid-cols-2" : "grid-cols-3"}`
            : "flex flex-wrap gap-2"
        }
        role={group.multi ? "group" : "radiogroup"}
      >
        {group.options.map((o, i) => {
          const on = selected.includes(o.id);
          return (
            <div
              key={o.id}
              className={`wizard-rise ${cards ? "h-full" : ""}`}
              style={{ animationDelay: `${0.04 * i + 0.08}s` }}
            >
              {cards ? (
                <OptionCard option={o} on={on} multi={!!group.multi} groupId={group.id} onClick={() => onPick(o.id)} />
              ) : (
                <OptionChip label={o.label} on={on} multi={!!group.multi} groupId={group.id} onClick={() => onPick(o.id)} />
              )}
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}

/** Ripple from the tap point — a little physical feedback on every choice. */
function useRipple() {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const reduce = useReducedMotion();
  const add = (e: ReactPointerEvent<HTMLElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    const id = Date.now() + Math.random();
    setRipples((rs) => [...rs, { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
    window.setTimeout(() => setRipples((rs) => rs.filter((x) => x.id !== id)), 650);
  };
  const node = (
    <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          className="absolute h-10 w-10 rounded-full bg-accent/30"
          style={{ left: r.x - 20, top: r.y - 20 }}
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 9, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
    </span>
  );
  return { add, node };
}

function OptionCard({
  option,
  on,
  multi,
  groupId,
  onClick,
}: {
  option: FormStep["groups"][number]["options"][number];
  on: boolean;
  multi: boolean;
  groupId: string;
  onClick: () => void;
}) {
  const Icon = option.icon ? ICONS[option.icon] : Sparkles;
  const ripple = useRipple();
  return (
    <motion.button
      type="button"
      role={multi ? "checkbox" : "radio"}
      aria-checked={on}
      onClick={onClick}
      onPointerDown={ripple.add}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      className={`group relative flex h-full w-full flex-col items-start gap-3 rounded-xl border p-3.5 text-start transition-colors sm:p-4 ${
        on ? "border-accent/70 bg-accent/[0.08]" : "border-edge bg-surface-raised/60 hover:border-accent/40"
      }`}
    >
      {ripple.node}
      {/* Single-choice: the highlight glides from card to card. */}
      {on && !multi ? (
        <motion.span
          layoutId={`sel-${groupId}`}
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-accent"
          style={{ boxShadow: "0 0 24px -6px rgb(var(--color-accent) / 0.6)" }}
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
        />
      ) : null}
      {on && multi ? (
        <motion.span
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-accent"
          style={{ boxShadow: "0 0 24px -6px rgb(var(--color-accent) / 0.6)" }}
        />
      ) : null}

      <motion.span
        animate={on ? { rotate: [0, -10, 8, 0], scale: [1, 1.15, 1] } : { rotate: 0, scale: 1 }}
        transition={{ duration: 0.45 }}
        className={`relative grid h-10 w-10 place-items-center rounded-lg transition-colors ${
          on ? "bg-gradient-to-br from-accent to-accent-deep text-surface" : "bg-accent/10 text-accent"
        }`}
      >
        <Icon aria-hidden className="h-5 w-5" />
      </motion.span>
      <span className="relative">
        <span className="block font-display text-sm font-semibold leading-snug text-ink sm:text-[0.95rem]">
          {option.label}
        </span>
        {option.hint ? <span className="mt-0.5 block text-xs leading-snug text-ink-faint">{option.hint}</span> : null}
      </span>

      <AnimatePresence>
        {on ? (
          <motion.span
            aria-hidden
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 22 }}
            className="absolute end-2.5 top-2.5 grid h-5 w-5 place-items-center rounded-full bg-accent text-surface"
          >
            <Check className="h-3 w-3" strokeWidth={3} />
          </motion.span>
        ) : null}
      </AnimatePresence>
    </motion.button>
  );
}

function OptionChip({
  label,
  on,
  multi,
  groupId,
  onClick,
}: {
  label: string;
  on: boolean;
  multi: boolean;
  groupId: string;
  onClick: () => void;
}) {
  const ripple = useRipple();
  return (
    <motion.button
      type="button"
      role={multi ? "checkbox" : "radio"}
      aria-checked={on}
      onClick={onClick}
      onPointerDown={ripple.add}
      whileTap={{ scale: 0.95 }}
      className={`relative inline-flex h-10 items-center gap-1.5 rounded-full border px-4 text-sm font-semibold transition-colors ${
        on ? "border-transparent text-surface" : "border-edge-strong bg-surface-raised/60 text-ink-muted hover:border-accent/50 hover:text-ink"
      }`}
    >
      {on ? (
        <motion.span
          layoutId={multi ? undefined : `chip-${groupId}`}
          initial={multi ? { scale: 0.6, opacity: 0 } : false}
          animate={{ scale: 1, opacity: 1 }}
          aria-hidden
          className="absolute inset-0 rounded-full bg-gradient-to-r from-accent to-accent-deep shadow-glow"
          transition={{ type: "spring", stiffness: 420, damping: 32 }}
        />
      ) : null}
      {ripple.node}
      <AnimatePresence initial={false}>
        {on && multi ? (
          <motion.span
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="relative overflow-hidden"
          >
            <Check aria-hidden className="h-3.5 w-3.5" strokeWidth={3} />
          </motion.span>
        ) : null}
      </AnimatePresence>
      <span className="relative">{label}</span>
    </motion.button>
  );
}

function NextButton({
  enabled,
  label,
  icon,
  onClick,
}: {
  enabled: boolean;
  label: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={!enabled}
      whileHover={enabled ? { scale: 1.03 } : undefined}
      whileTap={enabled ? { scale: 0.97 } : undefined}
      animate={{ opacity: enabled ? 1 : 0.45 }}
      className="relative inline-flex h-11 shrink-0 items-center gap-2 overflow-hidden whitespace-nowrap rounded-xl bg-gradient-to-r from-accent to-accent-deep px-5 font-display sm:px-6 text-sm font-semibold text-surface shadow-glow disabled:cursor-not-allowed disabled:shadow-none"
    >
      {enabled ? <span aria-hidden className="wizard-shine" /> : null}
      <span className="relative">{label}</span>
      <span className="relative">{icon}</span>
    </motion.button>
  );
}

function SendButton({
  status,
  ui,
  onClick,
  rtl,
}: {
  status: Status;
  ui: UI;
  onClick: () => void;
  rtl: boolean;
}) {
  const sending = status === "sending";
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={sending}
      whileHover={sending ? undefined : { scale: 1.03 }}
      whileTap={sending ? undefined : { scale: 0.97 }}
      className="relative inline-flex h-11 min-w-[10.5rem] items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-accent to-accent-deep px-6 font-display text-sm font-semibold text-surface shadow-glow"
    >
      {!sending ? <span aria-hidden className="wizard-shine" /> : null}
      <AnimatePresence mode="wait" initial={false}>
        {sending ? (
          <motion.span key="s" className="relative inline-flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
            {ui.sending}
          </motion.span>
        ) : (
          <motion.span key="i" className="relative inline-flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: rtl ? -30 : 30, y: -20 }}>
            {ui.send}
            <Send aria-hidden className={`h-4 w-4 ${rtl ? "-scale-x-100" : ""}`} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

function Field({
  id,
  label,
  optional,
  error,
  children,
  ui,
  className,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  children: ReactNode;
  ui: UI;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 flex items-baseline gap-2 text-sm font-semibold text-ink">
        {label}
        {optional ? <span className="text-xs font-normal text-ink-faint">{ui.optional}</span> : null}
      </label>
      {children}
      <AnimatePresence>
        {error ? (
          <motion.p
            id={`${id}-err`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1.5 text-xs font-medium text-red-400"
          >
            {error}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

const inputCls =
  "h-11 w-full rounded-xl border border-edge-strong bg-surface-raised/70 px-3.5 text-base text-ink placeholder:text-ink-faint outline-none transition-[border-color,box-shadow] focus:border-accent focus:shadow-[0_0_0_3px_rgb(var(--color-accent)/0.18)] aria-[invalid=true]:border-red-400/70";

function DetailsStep({
  details,
  setDetails,
  errors,
  shake,
  headingRef,
  brief,
  onEdit,
  onSubmit,
  status,
  ui,
}: {
  details: Details;
  setDetails: (d: Details) => void;
  errors: Partial<Record<ErrorKey, string>>;
  shake: number;
  headingRef: React.RefObject<HTMLHeadingElement>;
  brief: { step: number; group: FormGroup; values: string[] }[];
  onEdit: (step: number) => void;
  onSubmit: (e: FormEvent) => void;
  status: Status;
  ui: UI;
}) {
  const set = <K extends keyof Details>(k: K, v: Details[K]) => setDetails({ ...details, [k]: v });
  const [pickerOpen, setPickerOpen] = useState(false);
  const reduce = useReducedMotion();
  const prefs: { id: Preferred; icon: ReactNode }[] = [
    { id: "email", icon: <Mail aria-hidden className="h-4 w-4" /> },
    { id: "whatsapp", icon: <MessageCircle aria-hidden className="h-4 w-4" /> },
    { id: "either", icon: <Sparkles aria-hidden className="h-4 w-4" /> },
  ];

  return (
    <form onSubmit={onSubmit} noValidate>
      <StepHeading headingRef={headingRef} title={ui.detailsTitle} subtitle={ui.detailsSubtitle} />

      {/* Compact brief for small screens (the side panel covers large ones). */}
      {brief.length ? (
        <div className="mt-5 flex flex-wrap gap-1.5 lg:hidden">
          {brief.map((r) => (
            <button
              key={r.group.id}
              type="button"
              onClick={() => onEdit(r.step)}
              className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs text-ink"
            >
              <span className="text-ink-faint">{r.group.summary}:</span>
              <span className="truncate font-semibold">{r.values.join(", ")}</span>
              <Pencil aria-hidden className="h-3 w-3 shrink-0 text-accent" />
              <span className="sr-only">{ui.edit}</span>
            </button>
          ))}
        </div>
      ) : null}

      <motion.div
        key={shake}
        animate={shake && !reduce ? { x: [0, -8, 8, -5, 5, 0] } : undefined}
        transition={{ duration: 0.4 }}
        className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 [&>*]:min-w-0"
      >
        <Field id="cf-name" label={ui.name} error={errors.name} ui={ui}>
          <input
            id="cf-name"
            className={inputCls}
            value={details.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder={ui.namePh}
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "cf-name-err" : undefined}
          />
        </Field>
        <Field id="cf-company" label={ui.company} optional ui={ui}>
          <input
            id="cf-company"
            className={inputCls}
            value={details.company}
            onChange={(e) => set("company", e.target.value)}
            placeholder={ui.companyPh}
            autoComplete="organization"
          />
        </Field>
        <Field id="cf-email" label={ui.email} error={errors.email ?? errors.contact} ui={ui}>
          <input
            id="cf-email"
            type="email"
            dir="ltr"
            inputMode="email"
            className={`${inputCls} rtl:text-right`}
            value={details.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder={ui.emailPh}
            autoComplete="email"
            aria-invalid={!!(errors.email || errors.contact)}
            aria-describedby={errors.email || errors.contact ? "cf-email-err" : undefined}
          />
        </Field>
        <Field
          id="cf-wa"
          label={ui.whatsapp}
          error={errors.whatsapp}
          ui={ui}
          // While the country list is open, use the full width so names fit.
          className={pickerOpen ? "sm:col-span-2" : undefined}
        >
          {/* Country code + number. Always left-to-right, as phone numbers are written. */}
          <div dir="ltr" className="flex flex-wrap gap-2">
            <CountryCodePicker
              value={details.waCountry}
              onChange={(iso) => set("waCountry", iso)}
              open={pickerOpen}
              onOpenChange={setPickerOpen}
              labels={{ countryCode: ui.countryCode, searchCountry: ui.searchCountry, noCountry: ui.noCountry }}
            />
            <input
              id="cf-wa"
              type="tel"
              inputMode="tel"
              className={`${inputCls} min-w-0 !w-auto flex-1`}
              value={details.whatsapp}
              onChange={(e) => {
                const v = e.target.value;
                // A full number ("+44 7700…") switches the country by itself.
                const found = countryFromNumber(v, details.waCountry);
                if (found) setDetails({ ...details, waCountry: found.iso, whatsapp: found.rest });
                else set("whatsapp", v);
              }}
              placeholder={ui.whatsappPh}
              autoComplete="tel-national"
              aria-invalid={!!(errors.whatsapp || errors.contact)}
              aria-describedby={errors.whatsapp ? "cf-wa-err" : undefined}
            />
          </div>
        </Field>

        <fieldset className="sm:col-span-2">
          <legend className="mb-2 text-sm font-semibold text-ink">{ui.preferred}</legend>
          <div role="radiogroup" className="inline-flex w-full rounded-xl border border-edge-strong bg-surface-raised/60 p-1 sm:w-auto">
            {prefs.map((p) => {
              const on = details.preferred === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => set("preferred", p.id)}
                  className={`relative flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg px-2 text-sm sm:px-4 font-semibold transition-colors sm:flex-none ${
                    on ? "text-surface" : "text-ink-muted hover:text-ink"
                  }`}
                >
                  {on ? (
                    <motion.span
                      layoutId="pref-pill"
                      aria-hidden
                      className="absolute inset-0 rounded-lg bg-gradient-to-r from-accent to-accent-deep"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  ) : null}
                  <span className="relative">{p.icon}</span>
                  <span className="relative">{ui.preferredOptions[p.id]}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="sm:col-span-2">
        <Field id="cf-msg" label={ui.message} optional ui={ui}>
          <textarea
            id="cf-msg"
            rows={3}
            className={`${inputCls} h-auto resize-none py-2.5`}
            value={details.message}
            onChange={(e) => set("message", e.target.value)}
            placeholder={ui.messagePh}
            maxLength={1500}
          />
        </Field>
        </div>
      </motion.div>

      {/* Honeypot: hidden from people and screen readers, tempting to bots. */}
      <div aria-hidden className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0 [clip:rect(0,0,0,0)]">
        <label htmlFor="cf-website">Website</label>
        <input
          id="cf-website"
          tabIndex={-1}
          autoComplete="off"
          value={details.website}
          onChange={(e) => set("website", e.target.value)}
        />
      </div>

      <p className="mt-4 text-xs text-ink-faint">{ui.privacy}</p>
      {/* Lets Enter submit from any field. */}
      <button type="submit" aria-hidden className="sr-only" tabIndex={-1} disabled={status === "sending"}>
        {ui.send}
      </button>
    </form>
  );
}

function Brief({
  brief,
  ui,
  label,
  done,
  onEdit,
}: {
  brief: { step: number; group: FormGroup; values: string[] }[];
  ui: UI;
  label: string;
  done: boolean;
  onEdit: (step: number) => void;
}) {
  return (
    <aside className="relative hidden lg:block" aria-label={ui.brief}>
      <div className="sticky top-28 overflow-hidden rounded-2xl border border-edge bg-surface/70 p-5">
        <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent to-accent-deep" />
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint rtl:tracking-normal">{ui.brief}</p>
        <p className="mt-1 font-display text-lg font-semibold text-ink">{label}</p>
        <div className="mt-4 border-t border-dashed border-edge-strong pt-4">
          {brief.length === 0 ? (
            <p className="text-sm text-ink-faint">{ui.briefEmpty}</p>
          ) : (
            <ul className="space-y-3">
              <AnimatePresence initial={false}>
                {brief.map((r) => (
                  <motion.li
                    key={r.group.id}
                    layout
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="group/row"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-ink-faint">{r.group.summary}</span>
                      {!done ? (
                        <button
                          type="button"
                          onClick={() => onEdit(r.step)}
                          className="text-xs font-semibold text-accent opacity-0 transition-opacity focus-visible:opacity-100 group-hover/row:opacity-100"
                        >
                          {ui.edit}
                          <span className="sr-only"> {r.group.summary}</span>
                        </button>
                      ) : null}
                    </div>
                    <motion.p
                      key={r.values.join("|")}
                      initial={{ opacity: 0.4 }}
                      animate={{ opacity: 1 }}
                      className="mt-0.5 text-sm font-semibold leading-snug text-ink"
                    >
                      {r.values.join(", ")}
                    </motion.p>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>
      </div>
    </aside>
  );
}

function Success({
  name,
  reference,
  hasEmail,
  headingRef,
  onReset,
  ui,
}: {
  name: string;
  reference: string;
  hasEmail: boolean;
  headingRef: React.RefObject<HTMLHeadingElement>;
  onReset: () => void;
  ui: UI;
}) {
  const reduce = useReducedMotion();
  const particles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => {
        const a = (i / 14) * Math.PI * 2;
        const d = 70 + (i % 3) * 18;
        return { x: Math.cos(a) * d, y: Math.sin(a) * d, s: 4 + (i % 3) * 2, delay: 0.35 + (i % 4) * 0.03 };
      }),
    [],
  );
  return (
    <div
      className="wizard-rise flex flex-col items-center py-8 text-center"
      role="status"
    >
      <div className="relative grid h-24 w-24 place-items-center">
        {!reduce
          ? particles.map((p, i) => (
              <motion.span
                key={i}
                aria-hidden
                className={`absolute rounded-full ${i % 2 ? "bg-accent" : "bg-accent-deep"}`}
                style={{ width: p.s, height: p.s }}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                animate={{ x: p.x, y: p.y, opacity: [0, 1, 0], scale: [0, 1.2, 0.6] }}
                transition={{ duration: 0.9, delay: p.delay, ease: "easeOut" }}
              />
            ))
          : null}
        <motion.div
          aria-hidden
          className="absolute inset-0 rounded-full bg-accent/20"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: [0.5, 1.35, 1], opacity: [0, 0.6, 0.35] }}
          transition={{ duration: 0.8, ease: EASE }}
        />
        <svg viewBox="0 0 52 52" className="relative h-20 w-20" aria-hidden>
          <motion.circle
            cx="26"
            cy="26"
            r="24"
            fill="none"
            stroke="rgb(var(--color-accent))"
            strokeWidth="2.5"
            initial={{ pathLength: reduce ? 1 : 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, ease: EASE }}
          />
            <motion.path
              d="M15 27 l7 7 l15 -16"
              fill="none"
              stroke="rgb(var(--color-accent))"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: reduce ? 1 : 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.35, delay: 0.45, ease: "easeOut" }}
            />
        </svg>
      </div>

      <h3
        ref={headingRef}
        tabIndex={-1}
        style={{ animationDelay: "0.55s" }}
        className="wizard-rise mt-6 font-display text-2xl font-semibold tracking-tight text-ink outline-none"
      >
        {ui.successTitle}
      </h3>
      <p
        style={{ animationDelay: "0.65s" }}
        className="wizard-rise mt-2 max-w-md text-ink-muted"
      >
        {ui.successText.replace("{name}", name)}
        {hasEmail ? <span className="mt-1 block text-sm text-ink-faint">{ui.successCopy}</span> : null}
      </p>
      {reference ? (
        <p
          style={{ animationDelay: "0.75s" }}
          className="wizard-rise mt-5 inline-flex items-center gap-2 rounded-full border border-dashed border-accent/40 px-4 py-1.5 text-xs text-ink-muted"
        >
          {ui.reference}
          <span dir="ltr" className="font-mono font-semibold tracking-wider text-accent">
            {reference}
          </span>
        </p>
      ) : null}
      <button
        type="button"
        onClick={onReset}
        style={{ animationDelay: "0.85s" }}
        className="wizard-rise mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted transition-colors hover:text-accent"
      >
        <RotateCcw aria-hidden className="h-3.5 w-3.5" />
        {ui.startOver}
      </button>
    </div>
  );
}
