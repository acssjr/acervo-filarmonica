"use client";

import { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@contexts/AuthContext";
import { useData } from "@contexts/DataContext";
import { Icons } from "@constants/icons";
import Header from "@components/common/Header";
import IconButton from "@components/common/IconButton";
import EmptyState from "@components/common/EmptyState";
import CategoryCard from "@components/music/CategoryCard";
import FileCard from "@components/music/FileCard";

export default function AcervoPage() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    sheets,
    categories,
    categoriesMap,
    selectedCategory,
    setSelectedCategory,
    selectedComposer,
    setSelectedComposer,
    favorites,
    toggleFavorite,
  } = useData();

  const filteredSheets = useMemo(() => {
    let result = sheets;
    if (selectedCategory) {
      result = result.filter((s) => s.category === selectedCategory);
    }
    if (selectedComposer) {
      result = result.filter((s) => s.composer === selectedComposer);
    }
    return result;
  }, [sheets, selectedCategory, selectedComposer]);

  const currentCategory = categoriesMap.get(selectedCategory ?? "");

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const sheet of sheets) {
      const catId = sheet.category;
      counts.set(catId, (counts.get(catId) || 0) + 1);
    }
    return counts;
  }, [sheets]);

  const getCategoryCount = useCallback(
    (categoryId: string): number => categoryCounts.get(categoryId) || 0,
    [categoryCounts],
  );

  const handleBack = useCallback(() => {
    if (selectedComposer) {
      setSelectedComposer(null);
      router.push("/compositores");
    } else if (selectedCategory) {
      setSelectedCategory(null);
      router.push("/generos");
    }
  }, [selectedComposer, selectedCategory, setSelectedComposer, setSelectedCategory, router]);

  const handleCategoryClick = useCallback(
    (catId: string) => {
      setSelectedCategory(catId);
      setSelectedComposer(null);
      router.push(`/acervo/${catId}`);
    },
    [setSelectedCategory, setSelectedComposer, router],
  );

  const getTitle = (): string => {
    if (selectedComposer) return selectedComposer;
    if (currentCategory) return currentCategory.name;
    return "Acervo";
  };

  const getSubtitle = (): string => {
    if (selectedComposer || selectedCategory)
      return `${filteredSheets.length} partituras`;
    return "Todas as categorias";
  };

  return (
    <div>
      <Header
        title={getTitle()}
        subtitle={getSubtitle()}
        showBack={!!(selectedCategory || selectedComposer)}
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

      {!selectedCategory && !selectedComposer ? (
        <div style={{ padding: "0 20px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "12px",
              width: "100%",
            }}
          >
            {categories.map((cat, i) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                count={getCategoryCount(cat.id)}
                index={i}
                onClick={() => handleCategoryClick(cat.id)}
              />
            ))}
          </div>
        </div>
      ) : filteredSheets.length === 0 ? (
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
