"use client";

// ===== ADMIN SECTION PAGE =====
// Rota dinamica que despacha para a secao correta

import { useParams } from "next/navigation";
import dynamic from "next/dynamic";

const AdminMusicos = dynamic(() => import("@components/admin/AdminMusicos"), {
  loading: () => <SectionLoader />,
});
const AdminPartituras = dynamic(() => import("@components/admin/AdminPartituras"), {
  loading: () => <SectionLoader />,
});
const AdminCategorias = dynamic(() => import("@components/admin/AdminCategorias"), {
  loading: () => <SectionLoader />,
});
const AdminRepertorio = dynamic(() => import("@components/admin/AdminRepertorio"), {
  loading: () => <SectionLoader />,
});
const AdminPresenca = dynamic(() => import("@components/admin/AdminPresenca"), {
  loading: () => <SectionLoader />,
});
const AdminConfig = dynamic(() => import("@components/admin/AdminConfig"), {
  loading: () => <SectionLoader />,
});

const SectionLoader = () => (
  <div style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "400px",
    width: "100%",
  }}>
    <div style={{
      width: "32px",
      height: "32px",
      border: "3px solid var(--border)",
      borderTop: "3px solid #D4AF37",
      borderRadius: "50%",
      animation: "spin 0.8s linear infinite",
    }} />
  </div>
);

export default function AdminSectionPage() {
  const params = useParams();
  const secao = params.secao as string;

  switch (secao) {
    case "musicos":
      return <AdminMusicos />;
    case "partituras":
      return <AdminPartituras />;
    case "categorias":
      return <AdminCategorias />;
    case "repertorio":
      return <AdminRepertorio />;
    case "presenca":
      return <AdminPresenca />;
    case "config":
      return <AdminConfig />;
    default:
      return (
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
          fontFamily: "Outfit, sans-serif",
          color: "var(--text-secondary)",
        }}>
          Secao nao encontrada
        </div>
      );
  }
}
