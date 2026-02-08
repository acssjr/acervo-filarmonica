"use client";

import { useMemo } from "react";
import { useData } from "@contexts/DataContext";
import { Icons } from "@constants/icons";
import Header from "@components/common/Header";
import EmptyState from "@components/common/EmptyState";
import FileCard from "@components/music/FileCard";

export default function FavoritosPage() {
  const { sheets, favorites, toggleFavorite, categoriesMap } = useData();

  const favoriteSheets = useMemo(
    () => sheets.filter((s) => favorites.includes(s.id)),
    [sheets, favorites],
  );

  return (
    <div>
      <Header
        title="Favoritos"
        subtitle={`${favoriteSheets.length} partitura${favoriteSheets.length !== 1 ? "s" : ""}`}
      />

      {favoriteSheets.length === 0 ? (
        <EmptyState
          icon={(props) => Icons.Heart(props ?? {})}
          title="Nenhum favorito ainda"
          subtitle="Toque no coracao para adicionar"
        />
      ) : (
        <div
          style={{
            padding: "0 20px",
            contentVisibility: "auto" as const,
            containIntrinsicSize: "0 2000px",
          }}
        >
          {favoriteSheets.map((sheet) => (
            <FileCard
              key={sheet.id}
              sheet={sheet}
              category={categoriesMap.get(sheet.category)}
              isFavorite={true}
              onToggleFavorite={() => toggleFavorite(sheet.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
