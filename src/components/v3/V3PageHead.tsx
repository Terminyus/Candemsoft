export function V3PageHead({ kicker, title, deck }: { kicker: string; title: string; deck?: string }) {
  return (
    <header className="container-site border-b-2 border-news-ink pb-6 pt-8">
      <p className="v3-kicker text-ember">{kicker}</p>
      <h1 className="v3-headline mt-2 max-w-5xl text-[clamp(2.4rem,1.2rem+4.6vw,5.25rem)]">{title}</h1>
      {deck && <p className="mt-4 max-w-3xl text-[clamp(1.15rem,1rem+0.5vw,1.45rem)] italic leading-snug">{deck}</p>}
    </header>
  );
}
