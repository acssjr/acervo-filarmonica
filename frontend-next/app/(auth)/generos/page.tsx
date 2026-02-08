"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useData } from "@contexts/DataContext";
import Header from "@components/common/Header";
import CategoryCard from "@components/music/CategoryCard";

export default function GenerosPage() {
  const router = useRouter();
  const { sheets, categories, setSelectedCategory } = useData();

  const getCategoryCount = useCallback(
    (catId: string): number => sheets.filter((s) => s.category === catId).length,
    [sheets],
  );

  const handleCategoryClick = useCallback(
    (categoryId: string) => {
      setSelectedCategory(null);
      router.push(`/acervo/${categoryId}`);
    },
    [setSelectedCategory, router],
  );

  return (
    <div>
      <Header
        title="Gêneros"
        subtitle={`${categories.length} gêneros musicais`}
      />

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
    </div>
  );
}
