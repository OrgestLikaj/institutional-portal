"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { href } from "@/i18n/config";
import { useI18n } from "@/i18n/I18nProvider";
import { ErrorState } from "@/components/ui/States";

/** Error boundary for every page: shown when the CMS or a page throws. */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { locale, t } = useI18n();
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="container-inst py-20">
      <ErrorState
        title={t.states.errorTitle}
        text={t.states.errorText}
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <button type="button" onClick={reset} className="btn-primary">
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              {t.states.retry}
            </button>
            <Link href={href(locale)} className="btn-outline">
              {t.states.notFoundHome}
            </Link>
          </div>
        }
      />
    </div>
  );
}
