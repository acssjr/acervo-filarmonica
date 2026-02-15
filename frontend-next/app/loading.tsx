export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary">
      <div className="flex flex-col items-center gap-4">
        <div
          className="h-10 w-10 rounded-full border-3 border-border border-t-primary"
          style={{ animation: "spin 0.8s linear infinite" }}
        />
        <p className="text-sm text-text-muted">Carregando...</p>
      </div>
    </div>
  );
}
