"use client";

import Form from "next/form";
import Link from "next/link";
import { useRef } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

type Option = { value: string; label: string };

/**
 * Filter form for listings. It is a plain GET form (works without JavaScript,
 * every filtered view has a shareable URL); next/form adds client navigation
 * and selects submit on change.
 */
export function FilterBar({
  action,
  values,
  searchLabel,
  categories,
  years,
  dateRange = false,
  hiddenCategory = false,
}: {
  action: string;
  values: { q?: string; category?: string; from?: string; to?: string; year?: string };
  searchLabel?: string;
  categories?: Option[];
  years?: string[];
  dateRange?: boolean;
  hiddenCategory?: boolean;
}) {
  const { t } = useI18n();
  const formRef = useRef<HTMLFormElement>(null);
  const hasFilters = Boolean(values.q || (!hiddenCategory && values.category) || values.from || values.to || values.year);
  const submit = () => formRef.current?.requestSubmit();

  // Search field takes whatever the other controls leave on the 12-column grid
  const showCategory = Boolean(categories && !hiddenCategory);
  const compactButton = Boolean(dateRange || years);
  const used = (showCategory ? 3 : 0) + (years ? 2 : 0) + (dateRange ? 4 : 0) + (compactButton ? 1 : 3);
  const span: Record<number, string> = { 3: "md:col-span-3", 4: "md:col-span-4", 5: "md:col-span-5", 6: "md:col-span-6", 7: "md:col-span-7", 8: "md:col-span-8", 9: "md:col-span-9" };
  const qSpan = span[Math.min(9, Math.max(3, 12 - used))];

  return (
    <Form ref={formRef} action={action} role="search" className="border border-line bg-paper p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-brand-800">
        <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
        {t.common.filter}
      </div>
      <div className="grid gap-4 md:grid-cols-12 md:items-end">
        <div className={qSpan}>
          <label htmlFor="f-q" className="field-label">
            {searchLabel ?? t.common.search}
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
            <input id="f-q" name="q" type="search" defaultValue={values.q} placeholder={t.common.searchPlaceholder} className="field pl-9" />
          </div>
        </div>

        {showCategory && categories && (
          <div className="md:col-span-3">
            <label htmlFor="f-cat" className="field-label">
              {t.common.category}
            </label>
            <select id="f-cat" name="category" defaultValue={values.category ?? ""} onChange={submit} className="field">
              <option value="">{t.common.allCategories}</option>
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        )}
        {hiddenCategory && values.category && <input type="hidden" name="category" value={values.category} />}

        {years && (
          <div className="md:col-span-2">
            <label htmlFor="f-year" className="field-label">
              {t.common.year}
            </label>
            <select id="f-year" name="year" defaultValue={values.year ?? ""} onChange={submit} className="field">
              <option value="">{t.common.allYears}</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        )}

        {dateRange && (
          <>
            <div className="md:col-span-2">
              <label htmlFor="f-from" className="field-label">
                {t.common.from}
              </label>
              <input id="f-from" name="from" type="date" defaultValue={values.from} max={values.to} className="field" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="f-to" className="field-label">
                {t.common.to}
              </label>
              <input id="f-to" name="to" type="date" defaultValue={values.to} min={values.from} className="field" />
            </div>
          </>
        )}

        <div className={`flex gap-2 ${compactButton ? "md:col-span-1" : "md:col-span-3"}`}>
          <button type="submit" className="btn-primary h-[46px] flex-1 px-4" aria-label={t.common.filter}>
            <Search className="h-4 w-4" aria-hidden="true" />
            <span className={compactButton ? "md:sr-only" : ""}>{t.common.filter}</span>
          </button>
        </div>
      </div>
      {hasFilters && (
        <Link href={action + (hiddenCategory && values.category ? `?category=${values.category}` : "")} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline">
          <X className="h-4 w-4" aria-hidden="true" />
          {t.common.reset}
        </Link>
      )}
    </Form>
  );
}
