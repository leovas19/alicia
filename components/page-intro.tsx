type PageIntroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
};

export function PageIntro({ eyebrow, title, description, actions }: PageIntroProps) {
  return (
    <section className="fade-up mb-6 panel md:mb-8">
      {eyebrow ? (
        <p className="mb-3 text-xs uppercase tracking-[0.34em] text-[var(--muted)]">{eyebrow}</p>
      ) : null}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h1 className="title-font text-4xl leading-tight md:text-5xl">{title}</h1>
          <p className="mt-3 max-w-xl text-base leading-7 text-[var(--muted)]">{description}</p>
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </section>
  );
}
