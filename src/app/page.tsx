import { copy } from "@/content/copy";

export default function HomePage() {
  return (
    <main className="p-8">
      <h1 className="font-display text-4xl mb-4">{copy.hero.h1}</h1>
      <p className="font-body text-muted">{copy.hero.body}</p>
    </main>
  );
}
