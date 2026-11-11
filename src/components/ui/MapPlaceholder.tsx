import Image from "next/image";
import { asset } from "@/lib/env";
import { MapPin } from "lucide-react";

/** Static map placeholder — replace with an embedded map (e.g. OpenStreetMap iframe) once the address is approved. */
export function MapPlaceholder({ label, note }: { label: string; note: string }) {
  return (
    <figure className="relative h-full min-h-[22rem] overflow-hidden border border-line bg-navy-50">
      <Image src={asset("/images/map-placeholder.svg")} alt="" fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
      <div className="absolute left-1/2 top-[44%] flex -translate-x-1/2 -translate-y-full flex-col items-center">
        <span className="whitespace-nowrap bg-navy-900 px-3 py-1.5 text-[0.8rem] font-semibold text-white shadow-lg">{label}</span>
        <MapPin className="mt-1 h-9 w-9 fill-gold-500 text-navy-900" aria-hidden="true" />
      </div>
      <figcaption className="absolute inset-x-0 bottom-0 bg-white/90 px-5 py-3 text-[0.85rem] text-ink-muted backdrop-blur-sm">{note}</figcaption>
    </figure>
  );
}
