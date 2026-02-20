"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@contexts/AuthContext";
import { useData } from "@contexts/DataContext";
import { useIsMobile } from "@hooks/useResponsive";

import HomeHeader from "@components/common/HomeHeader";
import HeaderActions from "@components/common/HeaderActions";
import FeaturedSheets from "@components/music/FeaturedSheets";
import CategoryCard from "@components/music/CategoryCard";
import FileCard from "@components/music/FileCard";
import ComposerCarousel from "@components/music/ComposerCarousel";
import PresenceStats from "@components/stats/PresenceStats";
import { APP_VERSION } from "@constants/version";

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { sheets, favorites, toggleFavorite, categories, categoriesMap } = useData();
  const isMobile = useIsMobile();

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    sheets.forEach((s: { category: string }) => {
      counts[s.category] = (counts[s.category] || 0) + 1;
    });
    return counts;
  }, [sheets]);

  const getCategoryCount = (catId: string) => categoryCounts[catId] || 0;

  const mainGenres = useMemo(() => {
    const desiredIds = ["dobrados", "marchas", "arranjos", "fantasias"];
    const filtered = desiredIds
      .map((id) => categories.find((cat: { id: string }) => cat.id === id))
      .filter((cat): cat is { id: string; name: string } => cat != null);

    if (filtered.length === 0 && categories.length > 0) {
      return categories.slice(0, 4);
    }

    return filtered;
  }, [categories]);

  const recentSheets = useMemo(
    () =>
      [...sheets]
        .sort((a: { downloads?: number }, b: { downloads?: number }) => (b.downloads || 0) - (a.downloads || 0))
        .slice(0, 6),
    [sheets]
  );

  const topComposers = useMemo(() => {
    const composerCounts: Record<string, number> = {};
    sheets.forEach((s: { composer?: string }) => {
      if (s.composer && s.composer.trim()) {
        composerCounts[s.composer] = (composerCounts[s.composer] || 0) + 1;
      }
    });
    return Object.entries(composerCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [sheets]);

  return (
    <div style={{ width: "100%", overflow: "visible" }}>
      <HomeHeader
        userName={user?.nome || "Visitante"}
        instrument={user?.instrumento || "Músico"}
        actions={<HeaderActions />}
      />

      <div style={{ paddingTop: "8px", overflow: "visible" }}>
        <FeaturedSheets sheets={sheets} favorites={favorites} onToggleFavorite={toggleFavorite} />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 20px",
          marginBottom: "16px",
        }}
      >
        <h2 style={{ fontFamily: "var(--font-sans)", fontSize: "18px", fontWeight: "700" }}>
          Gêneros Musicais
        </h2>
        <button
          style={{
            background: "none",
            border: "none",
            color: "var(--primary)",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
            fontFamily: "var(--font-sans)",
          }}
          onClick={() => router.push("/generos")}
        >
          Ver Todos
        </button>
      </div>

      <div data-walkthrough="categories" style={{ padding: "0 20px", marginBottom: "24px" }}>
        <div
          className="categories-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "12px",
            width: "100%",
          }}
        >
          {mainGenres.map((cat: { id: string; name: string }, i: number) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              count={getCategoryCount(cat.id)}
              index={i}
              onClick={() => router.push(`/acervo/${cat.id}`)}
            />
          ))}
        </div>
      </div>

      {isMobile && <ComposerCarousel composers={topComposers} />}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 20px",
          marginBottom: "12px",
        }}
      >
        <h2 style={{ fontFamily: "var(--font-sans)", fontSize: "18px", fontWeight: "700" }}>
          Partituras Populares
        </h2>
        <button
          style={{
            background: "none",
            border: "none",
            color: "var(--primary)",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
            fontFamily: "var(--font-sans)",
          }}
          onClick={() => router.push("/acervo")}
        >
          Ver Todas
        </button>
      </div>

      <div className="sheets-grid" style={{ padding: "0 20px" }}>
        {recentSheets.map(
          (
            sheet: {
              id: string;
              title: string;
              composer: string;
              category: string;
              downloads?: number;
              featured?: boolean;
            },
            index: number
          ) => (
            <FileCard
              key={sheet.id}
              sheet={sheet}
              category={categoriesMap.get(sheet.category)}
              isFavorite={favorites.includes(sheet.id)}
              onToggleFavorite={() => toggleFavorite(sheet.id)}
              index={index}
            />
          )
        )}
      </div>

      <div style={{ padding: "32px 20px" }}>
        <PresenceStats />
      </div>

      <div
        style={{
          padding: "24px 20px 120px",
          textAlign: "center",
          borderTop: "1px solid var(--border)",
          margin: "0 20px",
        }}
      >
        <p
          style={{
            fontSize: "13px",
            color: "var(--text-muted)",
            fontFamily: "var(--font-sans)",
            marginBottom: "8px",
          }}
        >
          Filarmônica 25 de Março
        </p>
        <p
          style={{
            fontSize: "12px",
            color: "var(--text-muted)",
            fontFamily: "var(--font-sans)",
            opacity: 0.7,
          }}
        >
          Acervo Digital de Partituras • Versão {APP_VERSION}
        </p>
      </div>
    </div>
  );
}
