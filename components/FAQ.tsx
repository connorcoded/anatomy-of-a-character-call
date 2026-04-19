"use client";

import { useEffect, useState } from "react";
import { faqEntries } from "@/lib/faq-schema";
import { PlaceholderCallout } from "./PlaceholderCallout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

export function FAQ() {
  const [openValue, setOpenValue] = useState<string>("");

  // Deep-link: if URL hash matches an item slug on load, open that item.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash.startsWith("faq-")) return;
    const slug = hash.slice(4);
    const match = faqEntries.find((e) => e.slug === slug);
    if (match) {
      setOpenValue(`faq-${slug}`);
      requestAnimationFrame(() => {
        const el = document.getElementById(`faq-${slug}`);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, []);

  return (
    <section id="faq" className="anchor-offset mt-20">
      <h2 className="mb-10 font-serif text-[1.65rem] font-semibold leading-tight tracking-tight text-ink md:text-[2rem]">
        Frequently asked
      </h2>

      {/* Reserved embed: Runway Character */}
      <div
        className="mb-10 border border-dashed border-ph-border bg-ph-bg px-5 py-8 text-center"
        aria-label="Reserved embed: Runway Character"
      >
        <p className="mb-2 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-ph-label">
          Character goes here
        </p>
        <p className="mx-auto max-w-[48ch] font-serif text-[0.98rem] italic leading-relaxed text-ink/80">
          Embed a Runway Character configured as a Characters product expert. Knowledge base: the
          Characters docs, this article, and the five-question checklist. The FAQ below seeds the
          common ground; the Character handles the long tail.
        </p>
      </div>

      <PlaceholderCallout>
        Embed Runway Character here. Avatar configured as a Characters product expert; knowledge
        base: the full Characters docs, this article, and the five-question checklist above. The
        FAQ below seeds the common ground; the Character handles the long tail.
      </PlaceholderCallout>

      <Accordion
        type="single"
        collapsible
        value={openValue}
        onValueChange={setOpenValue}
        className="mt-6"
      >
        {faqEntries.map((entry) => {
          const itemValue = `faq-${entry.slug}`;
          return (
            <AccordionItem key={entry.slug} value={itemValue} id={itemValue}>
              <AccordionTrigger>
                <h3 className="flex-1 font-serif text-[1.1rem] font-semibold leading-snug text-ink">
                  {entry.q}
                </h3>
              </AccordionTrigger>
              <AccordionContent>
                <p className="font-sans text-[1rem] leading-relaxed text-ink/85">{entry.a}</p>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </section>
  );
}
