# Before & After Comparison

## Code Duplication Eliminated

### 1. Date Constants (MONTHS, YEARS)

#### Before
```typescript
// In experience-editor.tsx
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const YEARS = Array.from({ length: 60 }, (_, i) => (new Date().getFullYear() - i).toString());

// In education-editor.tsx
const YEARS = Array.from({ length: 40 }, (_, i) => (new Date().getFullYear() + 5 - i).toString());
```

#### After
```typescript
// In lib/constants.ts (single source of truth)
export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
] as const;

export const YEARS = Array.from({ length: 60 }, (_, i) => (new Date().getFullYear() - i).toString());
export const EDUCATION_YEARS = Array.from({ length: 40 }, (_, i) => (new Date().getFullYear() + 5 - i).toString());
```

---

### 2. Date Parsing/Formatting Logic

#### Before (45 lines in experience-editor.tsx)
```typescript
const parseDate = (dateStr: string) => {
  if (!dateStr) return { month: "", year: "" };
  const parts = dateStr.trim().split(" ");
  if (parts.length === 2 && parts[0] !== "" && parts[1] !== "") {
    const [shortMonth, year] = parts;
    const fullMonth = MONTHS.find(m => m.startsWith(shortMonth));
    if (fullMonth) return { month: fullMonth, year };
  }
  // ... 30+ more lines
};

const formatDate = (month: string, year: string) => {
  const m = month ? month.slice(0, 3) : "";
  const y = year || "";
  return `${m} ${y}`.trim();
};
```

#### After (centralized in lib/date-utils.ts)
```typescript
// In experience-editor.tsx
import { parseDate, formatDate } from "@/lib/date-utils";

// Just use the functions!
const startDate = parseDate(item.startDate);
const formatted = formatDate(startDate.month, startDate.year);
```

---

### 3. Collapsible Card Component

#### Before (80+ lines duplicated in each editor)
```typescript
<Card className={cn("group/item border-zinc-200 shadow-sm transition-all duration-200 overflow-hidden", ...)}>
  <div className={cn("p-4 flex items-center gap-3 sm:gap-4 cursor-pointer select-none", ...)} onClick={() => toggleExpand(iIdx)}>
    <div className={cn('text-zinc-300', 'group-hover/item:text-zinc-500', 'transition-colors', 'hidden', 'sm:block')}>
      <GripVertical size={16} />
    </div>
    <div className={cn('flex-1', 'min-w-0')}>
      <div className={cn('flex', 'flex-col', 'sm:flex-row', 'sm:items-center', 'gap-1', 'sm:gap-2')}>
        <span className={cn("font-semibold truncate text-sm sm:text-base", !item.jobTitle && "text-zinc-400 italic")}>
          {item.jobTitle || "Job Title"}
        </span>
        {/* ... 60+ more lines of boilerplate ... */}
      </div>
    </div>
  </div>
  {isExpanded && (
    <CardContent className={cn('p-4', 'sm:p-6', 'space-y-6', 'sm:space-y-8', ...)}>
      {children}
    </CardContent>
  )}
</Card>
```

#### After (clean and reusable)
```typescript
<CollapsibleCard
  isExpanded={isExpanded}
  onToggle={() => toggleExpand(iIdx)}
  onRemove={(e) => removeItem(iIdx, e)}
  title={item.jobTitle || "Job Title"}
  subtitle={item.companyName}
  metadata={
    <>
      <div className="flex items-center gap-1">
        <Calendar size={12} className="shrink-0" />
        {formatDate(startDate.month, startDate.year)} — {item.isCurrent ? "Present" : formatDate(endDate.month, endDate.year)}
      </div>
      {item.location && (
        <div className="flex items-center gap-1 min-w-0">
          <MapPin size={12} className="shrink-0" />
          <span className="truncate">{item.location}</span>
        </div>
      )}
    </>
  }
>
  {/* Just the content! */}
</CollapsibleCard>
```

---

### 4. Excessive cn() Usage

#### Before
```typescript
<header
  className={cn(
    "no-print",
    "sticky",
    "top-0",
    "z-50",
    "bg-white/90",
    "backdrop-blur-xl",
    "border-b",
    "border-zinc-100",
    "px-6 sm:px-8",
    "py-3",
    "flex",
    "items-center",
    "justify-between",
    "gap-2 sm:gap-4",
  )}
>
```

#### After
```typescript
<header className="no-print sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-zinc-100 px-6 sm:px-8 py-3 flex items-center justify-between gap-2 sm:gap-4">
```

---

### 5. Theme Constants

#### Before
```typescript
// In header.tsx
interface HeaderProps {
  activeLayout: "minimalist" | "professional" | "international" | "executive";
  onLayoutChange: (layout: "minimalist" | "professional" | "international" | "executive") => void;
}

// Hardcoded array
{(["minimalist", "professional", "international", "executive"] as const).map((t) => (...))}
```

#### After
```typescript
// In lib/constants.ts
export const RESUME_THEMES = ["minimalist", "professional", "international", "executive"] as const;
export type ResumeTheme = typeof RESUME_THEMES[number];

// In header.tsx
interface HeaderProps {
  activeLayout: ResumeTheme;
  onLayoutChange: (layout: ResumeTheme) => void;
}

// Use the constant
{RESUME_THEMES.map((t) => (...))}
```

---

## Summary

### Lines of Code Saved
- **experience-editor.tsx**: 158 lines removed (38% reduction)
- **header.tsx**: ~50 lines simplified
- **Other components**: ~40 lines simplified
- **Total**: ~250 lines of duplicated/verbose code eliminated

### Files Created
1. `lib/constants.ts` - Extended with shared constants
2. `lib/date-utils.ts` - Date parsing and formatting utilities
3. `components/ui/collapsible-card.tsx` - Reusable card component
4. `components/ui/date-selector.tsx` - Reusable date selector

### Benefits
✅ Single source of truth for constants
✅ Reusable components reduce duplication
✅ Cleaner, more readable code
✅ Better type safety
✅ Easier to maintain and extend
✅ **No visual changes** - UI remains identical
