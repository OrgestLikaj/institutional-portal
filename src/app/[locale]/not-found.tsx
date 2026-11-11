"use client";

import Link from "next/link";
import Form from "next/form";
import { ArrowLeft, Search } from "lucide-react";
import { href } from "@/i18n/config";
import { useI18n } from "@/i18n/I18nProvider";

export default function NotFound() {
  const { locale, t } = useI18n();
  return (
    <section className="relative overflow-hidden bg-paper">
      <div className="container-inst grid min-h-[60vh] items-center gap-12 py-20 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="eyebrow mb-5">404</p>
          <h1 className="text-[2.4rem] font-semibold sm:text-[3rem]">{t.states.notFoundTitle}</h1>
          <p className="mt-5 max-w-xl text-[1.1rem] text-ink-muted">{t.states.notFoundText}</p>
          <Form action={href(locale, "/search")} role="search" className="mt-8 flex max-w-lg">
            <label htmlFor="nf-q" className="sr-only">
              {t.search.label}
            </label>
            <input id="nf-q" name="q" type="search" placeholder={t.common.searchPlaceholder} className="field h-12" />
            <button type="submit" className="btn-primary h-12 shrink-0" aria-label={t.states.notFoundSearch}>
              <Search className="h-4 w-4" aria-hidden="true" />
            </button>
          </Form>
          <Link href={href(locale)} className="link-arrow mt-8">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {t.states.notFoundHome}
          </Link>
        </div>
        <div aria-hidden="true" className="hidden select-none lg:col-span-5 lg:block">
          <p className="font-serif text-[12rem] font-semibold leading-none text-navy-100">404</p>
          <div className="mt-2 h-1 w-32 bg-gold-500" />
        </div>
      </div>
    </section>
  );
}
