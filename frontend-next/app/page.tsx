export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bg-primary">
      <div className="text-center animate-in">
        <h1 className="text-4xl font-bold text-text-primary mb-4">
          Acervo Digital
        </h1>
        <p className="text-lg text-text-secondary mb-8">
          Filarmônica 25 de Março
        </p>
        <div className="inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-3 text-white font-medium">
          Setup completo — Next.js 16 + Tailwind v4
        </div>
      </div>
    </main>
  );
}
