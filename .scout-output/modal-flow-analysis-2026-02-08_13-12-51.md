# Codebase Report: Modal Flow Analysis - Sheet Detail Modal Not Opening
Generated: 2026-02-08 13:12:51

## Summary

**ROOT CAUSE FOUND:** The SheetDetailModal is NOT being rendered anywhere in the Next.js application.

In the ORIGINAL working version, the modal is rendered globally in App.jsx (line 333).
In the MIGRATED broken version, the modal is completely missing from the component tree.

## Detailed Comparison

### ORIGINAL (Working) Flow

```
App.jsx (lines 332-336)
│
├─ <SheetDetailModal />  ← RENDERED GLOBALLY
├─ <NotificationsPanel />
└─ <ShareCartModal />
```

**Location:** `frontend/src/App.jsx:333`

```jsx
{/* Modals (globais) */}
<SheetDetailModal />
<NotificationsPanel />
<ShareCartModal />
```

**How it works:**

1. **FileCard onClick** (`frontend/src/components/music/FileCard.jsx:22-25`)
   - Calls `setSelectedSheet(sheet)` from UIContext
   - Navigates to `/acervo/${category}/${id}`

2. **SheetDetailModal renders** (`frontend/src/components/modals/SheetDetailModal.jsx:132`)
   - Checks if `selectedSheet` exists
   - Conditional render: `{selectedSheet && (...)}`

3. **Modal opens automatically** when `selectedSheet` is set

### MIGRATED (Broken) Flow

```
RootLayout (app/layout.tsx)
│
└─ Providers
   │
   ├─ AuthProvider
   ├─ DataProvider
   ├─ UIProvider
   └─ NotificationProvider
      │
      └─ {children}  ← Pages render here

AuthLayout (app/(auth)/layout.tsx)
│
├─ DesktopLayout
│  └─ {children}
└─ BottomNav

❌ NO MODALS RENDERED ANYWHERE
```

**What happens:**

1. **FileCard onClick works** (`frontend-next/src/components/music/FileCard.tsx:22-25`)
   - Calls `setSelectedSheet(sheet)` ✓
   - Navigates to `/acervo/${category}/${id}` ✓

2. **SheetDetailModal exists** (`frontend-next/src/components/modals/SheetDetailModal.tsx:27`)
   - Component is fully implemented ✓
   - Has all logic to read from UIContext ✓
   - Conditional render logic: `{selectedSheet && (...)}` ✓

3. **BUT: Modal is never rendered in the component tree** ❌
   - Not in `app/layout.tsx`
   - Not in `app/(auth)/layout.tsx`
   - Not in `Providers.tsx`
   - Not in any page

## Architecture Map

### Original Architecture
```
[App.jsx]
    │
    ├─ Routes (pages)
    │   └─ FileCard → setSelectedSheet()
    │
    └─ Global Modals (always rendered)
        ├─ SheetDetailModal → reads selectedSheet
        ├─ NotificationsPanel
        └─ ShareCartModal
```

### Migrated Architecture (BROKEN)
```
[RootLayout]
    │
    └─ Providers
        └─ Pages
            └─ FileCard → setSelectedSheet()

❌ Modals not rendered anywhere
   (SheetDetailModal component exists but not in tree)
```

## Key Files

| File | Purpose | Status |
|------|---------|--------|
| `frontend/src/App.jsx:333` | Renders SheetDetailModal globally | ✓ Working |
| `frontend-next/app/layout.tsx` | Root layout | ❌ Missing modal |
| `frontend-next/app/(auth)/layout.tsx` | Auth layout | ❌ Missing modal |
| `frontend-next/src/components/Providers.tsx` | Context providers | ❌ Missing modal |
| `frontend-next/src/components/modals/SheetDetailModal.tsx` | Modal component | ✓ Implemented |
| `frontend-next/src/components/music/FileCard.tsx:23` | Sets selectedSheet | ✓ Working |
| `frontend-next/src/contexts/UIContext.tsx:78` | selectedSheet state | ✓ Working |

## Verification

### Working Components

✓ **UIContext** - Has `selectedSheet` state (`frontend-next/src/contexts/UIContext.tsx:78`)
```typescript
const [selectedSheet, setSelectedSheet] = useState<any>(null);
```

✓ **FileCard onClick** - Sets selectedSheet (`frontend-next/src/components/music/FileCard.tsx:22-25`)
```typescript
const handleCardClick = useCallback(() => {
  setSelectedSheet(sheet);
  router.push(`/acervo/${sheet.category}/${sheet.id}`);
}, [sheet, setSelectedSheet, router]);
```

✓ **SheetDetailModal** - Reads selectedSheet (`frontend-next/src/components/modals/SheetDetailModal.tsx:32`)
```typescript
const {
  selectedSheet,
  setSelectedSheet,
  // ...
} = useUI();
```

### Missing Component

❌ **SheetDetailModal NOT rendered in component tree**

Expected location (following original pattern):
- Option 1: `app/(auth)/layout.tsx` (after BottomNav)
- Option 2: `src/components/Providers.tsx` (inside UIProvider)
- Option 3: `app/layout.tsx` (inside Providers)

## Solution

Add the following modals to the component tree:

```tsx
// In app/(auth)/layout.tsx or Providers.tsx
import SheetDetailModal from "@components/modals/SheetDetailModal";
import NotificationsPanel from "@components/modals/NotificationsPanel";
import ShareCartModal from "@components/modals/ShareCartModal";

// Then render them globally:
<>
  {/* Existing layout */}
  
  {/* Global Modals */}
  <SheetDetailModal />
  <NotificationsPanel />
  <ShareCartModal />
</>
```

### Recommended Location

**Best approach:** Add to `app/(auth)/layout.tsx` (line 89, after BottomNav)

This matches the original pattern where modals are rendered alongside authenticated routes.

```tsx
// app/(auth)/layout.tsx
return (
  <>
    <DesktopLayout activeTab={activeTab}>
      <div style={{ paddingBottom: isDesktop ? "0" : "100px" }}>
        {children}
      </div>
    </DesktopLayout>
    {!isDesktop && <BottomNav activeTab={activeTab} />}
    
    {/* Global Modals - following original App.jsx pattern */}
    <SheetDetailModal />
    <NotificationsPanel />
    <ShareCartModal />
  </>
);
```

## Additional Findings

### Other Missing Global Components

Checking original `App.jsx`, these are also missing from Next.js:

1. **Toast** (`App.jsx:338-344`) - Toast notifications
2. **UpdateNotification** (`App.jsx:346`) - PWA update notification
3. **ShareCartFAB** (`App.jsx:348-352`) - Floating action button for share cart
4. **GlobalUserWalkthrough** (`App.jsx:354`) - Onboarding walkthrough

All of these should be added to maintain feature parity.

## Conventions Discovered

### Modal Pattern
- **Original:** Global modals rendered at app root level (after routes)
- **State management:** UIContext provides `selectedSheet` state
- **Navigation:** URL changes with modal (`/acervo/:category/:id`)
- **Opening:** Setting `selectedSheet` automatically opens modal (conditional render)
- **Closing:** Clearing `selectedSheet` closes modal

### File Organization
| Pattern | Original | Migrated |
|---------|----------|----------|
| Modals location | `src/components/modals/` | `src/components/modals/` ✓ |
| Global render point | `App.jsx` | **Missing** ❌ |
| Context usage | `useUI()` → `selectedSheet` | `useUI()` → `selectedSheet` ✓ |

## Testing Checklist

After adding SheetDetailModal to the component tree:

- [ ] Click on a FileCard
- [ ] Verify `setSelectedSheet` is called (React DevTools)
- [ ] Verify URL changes to `/acervo/:category/:id`
- [ ] Verify SheetDetailModal appears
- [ ] Verify modal shows correct partitura data
- [ ] Click close/backdrop - modal should close
- [ ] Verify `selectedSheet` is cleared

## References

- Original modal rendering: `frontend/src/App.jsx:332-336`
- Modal component: `frontend-next/src/components/modals/SheetDetailModal.tsx`
- UIContext: `frontend-next/src/contexts/UIContext.tsx`
- FileCard onClick: `frontend-next/src/components/music/FileCard.tsx:22-31`
- Auth layout: `frontend-next/app/(auth)/layout.tsx`
