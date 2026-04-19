const questions = [
  "Is the video generated or retrieved?",
  "Does the character have idle behavior when no one is speaking, and does that behavior vary?",
  "Can the character be interrupted mid-sentence without restarting?",
  "Where does my audio go, and is any of it stored by default?",
  "What happens when my tool call needs to hit my own backend?",
];

export function ChecklistList() {
  return (
    <ol className="my-8 space-y-4">
      {questions.map((q, i) => (
        <li key={i} className="flex gap-4">
          <span className="flex-shrink-0 font-mono text-[1rem] font-semibold tabular-nums text-accent">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="font-sans text-[1.05rem] leading-relaxed text-ink">{q}</span>
        </li>
      ))}
    </ol>
  );
}
