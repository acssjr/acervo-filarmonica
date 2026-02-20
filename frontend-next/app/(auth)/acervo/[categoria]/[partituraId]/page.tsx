"use client";

import { useEffect, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@contexts/AuthContext";
import { useData } from "@contexts/DataContext";
import { useUI } from "@contexts/UIContext";
import { Icons } from "@constants/icons";
import Header from "@components/common/Header";
import IconButton from "@components/common/IconButton";
import EmptyState from "@components/common/EmptyState";
import FileCard from "@components/music/FileCard";

export default function PartituraPage() {
  const { categoria, partituraId } = useParams<{ categoria: string; partituraId: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const {
    sheets,
    categoriesMap,
    selectedCategory,
    setSelectedCategory,
    setSelectedComposer,
    favorites,
    toggleFavorite,
  } = useData();
  const { setSelectedSheet } = useUI();

  // Sync URL param to DataContext selectedCategory
  useEffect(() => {
    if (categoria) {
      const cat = categoriesMap.get(categoria);
      if (cat) {
        setSelectedCategory(cat.id);
        setSelectedComposer(null);
      }
    }
  }, [categoria, categoriesMap, setSelectedCategory, setSelectedComposer]);

  // Open sheet modal when sheets are loaded
  useEffect(() => {
    if (partituraId && sheets.length > 0) {
      const sheet = sheets.find(
        (s) => s.id === partituraId || s.id === String(partituraId)
      );
      if (sheet) {
        setSelectedSheet(sheet);
      }
    }
  }, [partituraId, sheets, setSelectedSheet]);

  const currentCategory = categoriesMap.get(selectedCategory ?? categoria ?? "");

  const filteredSheets = useMemo(() => {
    const catId = selectedCategory ?? categoria;
    if (!catId) return sheets;
    return sheets.filter((s) => s.category === catId);
  }, [sheets, selectedCategory, categoria]);

  const handleBack = useCallback(() => {
    setSelectedCategory(null);
    router.push("/acervo");
  }, [setSelectedCategory, router]);

  const title = currentCategory?.name ?? categoria ?? "Acervo";
  const subtitle = `${filteredSheets.length} partituras`;

  return (
    <div>
      <Header
        title={title}
        subtitle={subtitle}
        showBack
        onBack={handleBack}
        actions={
          user?.is_admin ? (
            <IconButton
              icon={Icons.Plus}
              primary
              onClick={() => router.push("/admin/partituras")}
            />
          ) : undefined
        }
      />

      {filteredSheets.length === 0 ? (
        <EmptyState icon={(props) => Icons.Folder(props ?? {})} title="Nenhuma partitura encontrada" />
      ) : (
        <div
          style={{
            padding: "0 20px",
            contentVisibility: "auto" as const,
            containIntrinsicSize: "0 2000px",
          }}
        >
          {filteredSheets.map((sheet) => (
            <FileCard
              key={sheet.id}
              sheet={sheet}
              category={currentCategory}
              isFavorite={favorites.includes(sheet.id)}
              onToggleFavorite={() => toggleFavorite(sheet.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
