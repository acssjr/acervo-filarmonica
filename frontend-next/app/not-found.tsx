import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg-primary">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <p className="text-lg text-text-secondary mb-8">
        Página não encontrada
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-3 text-white font-medium hover:bg-primary-dark transition-colors"
      >
        Voltar ao início
      </Link>
    </div>
  );
}
