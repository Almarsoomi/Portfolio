"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { useLang } from "./i18n";

/**
 * Every country's dialling code, as "ISO2:code". Country names come from the
 * browser (Intl.DisplayNames) in English or Arabic, flags from the ISO code,
 * so the list stays small and is translated for free.
 */
const DIAL =
  "AF:93 AL:355 DZ:213 AS:1684 AD:376 AO:244 AI:1264 AG:1268 AR:54 AM:374 AW:297 AU:61 AT:43 AZ:994 " +
  "BS:1242 BH:973 BD:880 BB:1246 BY:375 BE:32 BZ:501 BJ:229 BM:1441 BT:975 BO:591 BA:387 BW:267 BR:55 " +
  "BN:673 BG:359 BF:226 BI:257 KH:855 CM:237 CA:1 CV:238 KY:1345 CF:236 TD:235 CL:56 CN:86 CO:57 KM:269 " +
  "CG:242 CD:243 CK:682 CR:506 CI:225 HR:385 CU:53 CW:599 CY:357 CZ:420 DK:45 DJ:253 DM:1767 DO:1809 " +
  "EC:593 EG:20 SV:503 GQ:240 ER:291 EE:372 SZ:268 ET:251 FK:500 FO:298 FJ:679 FI:358 FR:33 GF:594 " +
  "PF:689 GA:241 GM:220 GE:995 DE:49 GH:233 GI:350 GR:30 GL:299 GD:1473 GP:590 GU:1671 GT:502 GG:44 " +
  "GN:224 GW:245 GY:592 HT:509 HN:504 HK:852 HU:36 IS:354 IN:91 ID:62 IR:98 IQ:964 IE:353 IM:44 IL:972 " +
  "IT:39 JM:1876 JP:81 JE:44 JO:962 KZ:7 KE:254 KI:686 XK:383 KW:965 KG:996 LA:856 LV:371 LB:961 LS:266 " +
  "LR:231 LY:218 LI:423 LT:370 LU:352 MO:853 MG:261 MW:265 MY:60 MV:960 ML:223 MT:356 MH:692 MQ:596 " +
  "MR:222 MU:230 YT:262 MX:52 FM:691 MD:373 MC:377 MN:976 ME:382 MS:1664 MA:212 MZ:258 MM:95 NA:264 " +
  "NR:674 NP:977 NL:31 NC:687 NZ:64 NI:505 NE:227 NG:234 NU:683 KP:850 MK:389 NO:47 OM:968 PK:92 PW:680 " +
  "PS:970 PA:507 PG:675 PY:595 PE:51 PH:63 PL:48 PT:351 PR:1787 QA:974 RE:262 RO:40 RU:7 RW:250 KN:1869 " +
  "LC:1758 VC:1784 WS:685 SM:378 ST:239 SA:966 SN:221 RS:381 SC:248 SL:232 SG:65 SX:1721 SK:421 SI:386 " +
  "SB:677 SO:252 ZA:27 KR:82 SS:211 ES:34 LK:94 SD:249 SR:597 SE:46 CH:41 SY:963 TW:886 TJ:992 TZ:255 " +
  "TH:66 TL:670 TG:228 TO:676 TT:1868 TN:216 TR:90 TM:993 TC:1649 TV:688 UG:256 UA:380 AE:971 GB:44 " +
  "US:1 UY:598 UZ:998 VU:678 VA:379 VE:58 VN:84 VG:1284 VI:1340 YE:967 ZM:260 ZW:263";

/** Shown first, in this order. */
const PINNED = ["AE", "SA", "OM", "QA", "KW", "BH"];

/** For codes several countries share, the one to suggest first. */
const MAIN_FOR_CODE = new Set(["GB", "US", "RU", "AU", "RE", "CW", "GP"]);
const rank = (iso: string) => (MAIN_FOR_CODE.has(iso) ? 0 : 1);

const DIAL_BY_ISO: Record<string, string> = Object.fromEntries(DIAL.split(" ").map((p) => p.split(":")));

export const DEFAULT_COUNTRY = "AE";

export function dialCode(iso: string): string {
  return DIAL_BY_ISO[iso] ?? DIAL_BY_ISO[DEFAULT_COUNTRY];
}

/** "United Arab Emirates" / "الإمارات العربية المتحدة". */
export function countryName(iso: string, lang: string): string {
  try {
    return new Intl.DisplayNames([lang], { type: "region" }).of(iso) ?? iso;
  } catch {
    return iso;
  }
}

export function flagOf(iso: string): string {
  return String.fromCodePoint(0x1f1e6 + iso.charCodeAt(0) - 65, 0x1f1e6 + iso.charCodeAt(1) - 65);
}

/**
 * Country for a number typed in full ("+44 7700…", "0044…"): the longest
 * matching code wins, preferring the visitor's current pick on ties (US/CA).
 */
export function countryFromNumber(raw: string, current: string): { iso: string; rest: string } | null {
  const m = raw.trim().match(/^(?:\+|00)\s*([\d\s-]+)/);
  if (!m) return null;
  const digits = m[1].replace(/\D/g, "");
  let best: string | null = null;
  for (const [iso, code] of Object.entries(DIAL_BY_ISO)) {
    if (!digits.startsWith(code)) continue;
    if (!best) {
      best = iso;
      continue;
    }
    const bestCode = DIAL_BY_ISO[best];
    if (code.length > bestCode.length) best = iso;
    else if (code.length === bestCode.length && code === bestCode) {
      // Same code (e.g. +44): keep the visitor's pick, else the main country.
      if (best === current) continue;
      if (iso === current || rank(iso) < rank(best)) best = iso;
    }
  }
  if (!best) return null;
  return { iso: best, rest: digits.slice(DIAL_BY_ISO[best].length) };
}

const normalise = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ًͯ-ٰٟ]/g, "") // Latin accents + Arabic diacritics
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي");

interface Country {
  iso: string;
  code: string;
  flag: string;
  name: string;
  search: string;
}

function useCountries(lang: string): Country[] {
  return useMemo(() => {
    const names = (l: string) => {
      try {
        return new Intl.DisplayNames([l], { type: "region" });
      } catch {
        return null;
      }
    };
    const en = names("en");
    const ar = names("ar");
    const list = Object.entries(DIAL_BY_ISO).map(([iso, code]) => {
      const nameEn = en?.of(iso) ?? iso;
      const nameAr = ar?.of(iso) ?? nameEn;
      const name = lang === "ar" ? nameAr : nameEn;
      return {
        iso,
        code,
        flag: flagOf(iso),
        name,
        // Search both languages, the ISO code and the dial code.
        search: normalise(`${nameEn} ${nameAr} ${iso}`),
      };
    });
    const collator = new Intl.Collator(lang);
    const pinned = PINNED.map((iso) => list.find((c) => c.iso === iso)!);
    const rest = list.filter((c) => !PINNED.includes(c.iso)).sort((a, b) => collator.compare(a.name, b.name));
    return [...pinned, ...rest];
  }, [lang]);
}

export default function CountryCodePicker({
  value,
  onChange,
  open,
  onOpenChange,
  labels,
}: {
  value: string;
  onChange: (iso: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  labels: { countryCode: string; searchCountry: string; noCountry: string };
}) {
  const lang = useLang();
  const countries = useCountries(lang);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listId = useId();
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const results = useMemo(() => {
    const q = normalise(query.trim());
    if (!q) return countries;
    const digits = q.replace(/^(\+|00)/, "").replace(/\D/g, "");
    const byDigits = /^(\+|00)?\d[\d\s-]*$/.test(q);
    if (byDigits) {
      // "+20" / "20": exact code first, then codes that start with it.
      return countries
        .filter((c) => c.code.startsWith(digits))
        .sort((a, b) => a.code.length - b.code.length || rank(a.iso) - rank(b.iso));
    }
    const starts = countries.filter((c) => normalise(c.name).startsWith(q));
    const contains = countries.filter((c) => !starts.includes(c) && c.search.includes(q));
    return [...starts, ...contains];
  }, [countries, query]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActive(0);
    // Focus the search box; preventScroll stops iOS jumping the page.
    requestAnimationFrame(() => searchRef.current?.focus({ preventScroll: true }));
  }, [open]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const choose = (iso: string) => {
    onChange(iso);
    onOpenChange(false);
    buttonRef.current?.focus({ preventScroll: true });
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(results.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[active]) choose(results[active].iso);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onOpenChange(false);
      buttonRef.current?.focus({ preventScroll: true });
    }
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => onOpenChange(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${labels.countryCode}: +${dialCode(value)}`}
        className={`flex h-11 shrink-0 items-center gap-1.5 rounded-xl border bg-surface-raised/70 pl-3 pr-2 text-base text-ink transition-colors ${
          open ? "border-accent shadow-[0_0_0_3px_rgb(var(--color-accent)/0.18)]" : "border-edge-strong hover:border-accent/50"
        }`}
      >
        <span aria-hidden className="text-lg leading-none">
          {flagOf(value)}
        </span>
        <span>+{dialCode(value)}</span>
        <ChevronDown aria-hidden className={`h-4 w-4 text-ink-faint transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        // Opens inline (not floating) so it never gets cut off and pushes the form down instead.
        <div
          dir={lang === "ar" ? "rtl" : "ltr"}
          className="wizard-rise order-last basis-full overflow-hidden rounded-xl border border-edge-strong bg-surface-raised/80"
        >
          <div className="relative border-b border-edge">
            <Search aria-hidden className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
            <input
              ref={searchRef}
              type="search"
              role="combobox"
              aria-expanded
              aria-controls={listId}
              aria-activedescendant={results[active] ? `${listId}-${results[active].iso}` : undefined}
              aria-label={labels.searchCountry}
              placeholder={labels.searchCountry}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKey}
              autoComplete="off"
              enterKeyHint="done"
              className="h-11 w-full bg-transparent pe-3 ps-9 text-base text-ink outline-none placeholder:text-ink-faint"
            />
          </div>
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            aria-label={labels.countryCode}
            data-lenis-prevent
            className="max-h-60 overflow-y-auto overscroll-contain py-1"
          >
            {results.length === 0 ? (
              <li className="px-3 py-3 text-sm text-ink-faint">{labels.noCountry}</li>
            ) : (
              results.map((c, i) => {
                const selected = c.iso === value;
                const divider = !query && i === PINNED.length;
                return (
                  <li
                    key={c.iso}
                    id={`${listId}-${c.iso}`}
                    data-index={i}
                    role="option"
                    aria-selected={selected}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => choose(c.iso)}
                    className={`flex cursor-pointer items-center gap-3 px-3 py-2.5 text-[0.95rem] ${
                      divider ? "mt-1 border-t border-edge pt-3" : ""
                    } ${i === active ? "bg-accent/10" : ""}`}
                  >
                    <span aria-hidden className="text-lg leading-none">
                      {c.flag}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-ink">{c.name}</span>
                    <span dir="ltr" className="shrink-0 tabular-nums text-ink-muted">
                      +{c.code}
                    </span>
                    {selected ? <Check aria-hidden className="h-4 w-4 shrink-0 text-accent" /> : null}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      ) : null}
    </>
  );
}
