"use client";

import type { CSSProperties } from "react";

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  variant?: "rectangular" | "circular" | "text";
  count?: number;
  gap?: string;
  className?: string;
  style?: CSSProperties;
}

const Skeleton = ({
  width = "100%",
  height = "20px",
  borderRadius = "8px",
  variant = "rectangular",
  count = 1,
  gap = "8px",
  className = "",
  style = {},
}: SkeletonProps) => {
  const getVariantStyles = (): CSSProperties => {
    switch (variant) {
      case "circular":
        return { borderRadius: "50%", width, height: width };
      case "text":
        return { borderRadius: "4px", height: "14px" };
      default:
        return { borderRadius };
    }
  };

  const baseStyle: CSSProperties = {
    background: "linear-gradient(90deg, var(--skeleton-base, rgba(255,255,255,0.05)) 0%, var(--skeleton-shine, rgba(255,255,255,0.1)) 50%, var(--skeleton-base, rgba(255,255,255,0.05)) 100%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s ease-in-out infinite",
    width, height,
    ...getVariantStyles(),
    ...style,
  };

  if (count === 1) {
    return <div className={className} style={baseStyle} />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={className} style={{
          ...baseStyle,
          width: variant === "text" && i === count - 1 ? "60%" : width,
        }} />
      ))}
    </div>
  );
};

export const UserCardSkeleton = () => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "16px 20px", background: "var(--bg-secondary)",
    borderRadius: "16px", border: "1px solid var(--border)",
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
      <Skeleton variant="circular" width="52px" />
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <Skeleton width="140px" height="16px" borderRadius="6px" />
        <Skeleton width="180px" height="12px" borderRadius="4px" />
        <Skeleton width="100px" height="10px" borderRadius="4px" />
      </div>
    </div>
    <div style={{ display: "flex", gap: "8px" }}>
      <Skeleton width="40px" height="40px" borderRadius="10px" />
      <Skeleton width="40px" height="40px" borderRadius="10px" />
      <Skeleton width="40px" height="40px" borderRadius="10px" />
    </div>
  </div>
);

export const UserListSkeleton = ({ count = 5 }: { count?: number }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} style={{ animation: "fadeIn 0.3s ease-out forwards", animationDelay: `${i * 0.05}s`, opacity: 0 }}>
        <UserCardSkeleton />
      </div>
    ))}
  </div>
);

export const SheetCardSkeleton = () => (
  <div style={{
    padding: "16px", background: "var(--bg-secondary)", borderRadius: "16px", border: "1px solid var(--border)",
  }}>
    <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
      <Skeleton width="48px" height="48px" borderRadius="10px" />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
        <Skeleton width="70%" height="16px" borderRadius="6px" />
        <Skeleton width="50%" height="12px" borderRadius="4px" />
      </div>
    </div>
    <Skeleton width="100%" height="1px" style={{ margin: "12px 0" }} />
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <Skeleton width="80px" height="24px" borderRadius="6px" />
      <Skeleton width="32px" height="32px" borderRadius="8px" />
    </div>
  </div>
);

export const SheetGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} style={{ animation: "fadeIn 0.3s ease-out forwards", animationDelay: `${i * 0.05}s`, opacity: 0 }}>
        <SheetCardSkeleton />
      </div>
    ))}
  </div>
);

export const StatCardSkeleton = () => (
  <div style={{
    padding: "20px", background: "var(--bg-secondary)", borderRadius: "16px", border: "1px solid var(--border)",
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
      <Skeleton width="40px" height="40px" borderRadius="10px" />
      <Skeleton width="60%" height="14px" borderRadius="4px" />
    </div>
    <Skeleton width="50%" height="28px" borderRadius="6px" />
  </div>
);

export const ParteItemSkeleton = () => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "6px 8px", background: "var(--bg-secondary)",
    borderRadius: "6px", border: "1px solid var(--border)", minHeight: "32px",
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: "6px", flex: 1 }}>
      <Skeleton width="12px" height="12px" borderRadius="2px" />
      <Skeleton width="80px" height="12px" borderRadius="4px" />
    </div>
    <div style={{ display: "flex", gap: "4px", marginLeft: "8px" }}>
      <Skeleton width="24px" height="24px" borderRadius="4px" />
      <Skeleton width="24px" height="24px" borderRadius="4px" />
    </div>
  </div>
);

export const PartesGridSkeleton = ({ count = 12 }: { count?: number }) => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "6px", marginBottom: "8px" }}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} style={{ animation: "listItemIn 0.3s ease-out forwards", animationDelay: `${i * 0.02}s`, opacity: 0 }}>
        <ParteItemSkeleton />
      </div>
    ))}
  </div>
);

export const CategoryCardSkeleton = () => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "16px 20px", background: "var(--bg-secondary)", borderRadius: "16px", border: "1px solid var(--border)",
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
      <Skeleton width="48px" height="48px" borderRadius="12px" />
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <Skeleton width="120px" height="16px" borderRadius="6px" />
        <Skeleton width="60px" height="12px" borderRadius="4px" />
      </div>
    </div>
    <div style={{ display: "flex", gap: "8px" }}>
      <Skeleton width="40px" height="40px" borderRadius="10px" />
      <Skeleton width="40px" height="40px" borderRadius="10px" />
    </div>
  </div>
);

export const CategoryListSkeleton = ({ count = 5 }: { count?: number }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} style={{ animation: "listItemIn 0.3s ease-out forwards", animationDelay: `${i * 0.05}s`, opacity: 0 }}>
        <CategoryCardSkeleton />
      </div>
    ))}
  </div>
);

export default Skeleton;
