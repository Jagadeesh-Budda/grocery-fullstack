/**
 * Home Dashboard Sections
 * 
 * UI components for rendering home dashboard data.
 * These components are read-only renderers with NO business logic.
 * 
 * Rules:
 * ❌ No sorting
 * ❌ No filtering  
 * ❌ No calculations
 * ❌ No threshold checks
 * ✅ Render backend data as-is
 * ✅ Respect backend ordering
 * 
 * UX Features:
 * ✅ Loading skeletons during fetch
 * ✅ Friendly empty states
 * ✅ Visual hierarchy with emphasized titles
 * ✅ Subtle hover/focus states (<200ms)
 */

import React from "react";
import { RotateCcw, CalendarDays, AlertTriangle, ShoppingCart, Package, Inbox, CheckCircle, BarChart3 } from "lucide-react";
import BuyAgainCard from "./BuyAgainCard";

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE FLAG - Safe rollout control
// ─────────────────────────────────────────────────────────────────────────────

export const ENABLE_HOME_DASHBOARD = true;

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Skeleton pulse animation styles (inline for isolation)
 */
const skeletonBaseClass = "bg-slate-200/60 rounded animate-pulse";

/**
 * Single item skeleton - matches ItemCard layout
 */
function ItemSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/30 border border-slate-100/30">
      {/* Thumbnail skeleton */}
      <div className={`h-12 w-12 rounded-lg ${skeletonBaseClass}`} />
      
      {/* Text skeleton */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className={`h-4 w-3/4 ${skeletonBaseClass}`} />
        <div className={`h-3 w-1/2 ${skeletonBaseClass}`} />
      </div>
      
      {/* Button skeleton */}
      <div className={`h-9 w-9 rounded-full ${skeletonBaseClass}`} />
    </div>
  );
}

/**
 * Section skeleton - matches DashboardSection layout
 */
function SectionSkeleton({ itemCount = 3 }) {
  return (
    <div className="rounded-2xl border border-white/30 bg-white/40 backdrop-blur-sm p-5">
      {/* Header skeleton */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`h-10 w-10 rounded-xl ${skeletonBaseClass}`} />
        <div className={`h-5 w-32 ${skeletonBaseClass}`} />
      </div>
      
      {/* Items skeleton */}
      <div className="space-y-2">
        {Array.from({ length: itemCount }).map((_, i) => (
          <ItemSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

/**
 * Full dashboard skeleton - shows during initial load
 */
function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <SectionSkeleton itemCount={2} />
      <SectionSkeleton itemCount={2} />
      <SectionSkeleton itemCount={2} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EMPTY STATE COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Friendly empty state with icon and message
 */
function EmptyState({ icon: Icon, iconClassName, message }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className={`grid h-12 w-12 place-items-center rounded-full mb-3 ${iconClassName}`}>
        <Icon size={24} />
      </div>
      <p className="text-sm text-slate-500 max-w-[200px]">{message}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Section wrapper with consistent styling and visual hierarchy
 * Uses .glass-soft token for subtle, functional appearance
 */
function DashboardSection({ title, icon: Icon, iconClassName, children, isEmpty, emptyState }) {
  return (
    <section className="rounded-2xl glass-soft glass-border p-5">
      {/* Section header with emphasized title */}
      <div className="flex items-center gap-3 mb-4">
        {Icon && (
          <div className={`grid h-10 w-10 place-items-center rounded-xl shrink-0 shadow-sm ${iconClassName}`}>
            <Icon size={20} strokeWidth={2.25} />
          </div>
        )}
        <h2 
          className="text-lg font-bold text-white tracking-tight"
          style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.25)" }}
        >
          {title}
        </h2>
      </div>
      
      {/* Content or empty state */}
      {isEmpty && emptyState ? emptyState : children}
    </section>
  );
}

/**
 * Individual item card with improved interaction states
 */
function ItemCard({ variantId, children, onClick }) {
  return (
    <div
      className="
        flex items-center gap-3 p-3 rounded-xl
        glass-card
        focus-within:ring-2 focus-within:ring-emerald-500/20
        cursor-pointer
      "
      onClick={() => onClick?.(variantId)}
    >
      {children}
    </div>
  );
}

/**
 * Product thumbnail placeholder
 * In a real app, this would fetch product details by variantId
 */
function ProductThumbnail({ variantId }) {
  return (
    <div className="h-12 w-12 rounded-lg bg-slate-100/80 flex items-center justify-center shrink-0 ring-1 ring-slate-900/5">
      <Package size={20} className="text-slate-400" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BUY AGAIN SECTION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Buy Again Section
 * Renders products the user has ordered before.
 * Uses BuyAgainCard with confirmation flow for add-to-cart.
 * 
 * @param items - Array of BuyAgain items from backend (unmodified)
 * @param onItemClick - Optional callback when item is clicked (navigation)
 * @param showEmpty - Whether to show empty state (default: false)
 */
export function BuyAgainSection({ items, onItemClick, showEmpty = false }) {
  const isEmpty = !items || items.length === 0;

  // Hide section entirely if empty and showEmpty is false
  if (isEmpty && !showEmpty) return null;

  return (
    <DashboardSection
      title="Buy Again"
      icon={RotateCcw}
      iconClassName="bg-slate-100/80 text-slate-600"
      isEmpty={isEmpty}
      emptyState={
        <EmptyState
          icon={Inbox}
          iconClassName="bg-slate-100/60 text-slate-400"
          message="No recent purchases yet"
        />
      }
    >
      <div className="space-y-2">
        {items?.map((item) => (
          <BuyAgainCard
            key={item.productVariantId}
            item={item}
            onNavigate={onItemClick}
          />
        ))}
      </div>
    </DashboardSection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MONTHLY STOCK SECTION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Monthly Stock Section
 * Renders products the user buys on a monthly basis.
 * 
 * @param items - Array of MonthlyStock items from backend (unmodified)
 * @param onItemClick - Optional callback when item is clicked
 * @param showEmpty - Whether to show empty state (default: false)
 */
export function MonthlyStockSection({ items, onItemClick, showEmpty = false }) {
  const isEmpty = !items || items.length === 0;

  // Hide section entirely if empty and showEmpty is false
  if (isEmpty && !showEmpty) return null;

  return (
    <DashboardSection
      title="Monthly Stock"
      icon={CalendarDays}
      iconClassName="bg-emerald-100/80 text-emerald-600"
      isEmpty={isEmpty}
      emptyState={
        <EmptyState
          icon={BarChart3}
          iconClassName="bg-emerald-100/60 text-emerald-400"
          message="Usage insights will appear once you place orders"
        />
      }
    >
      <div className="space-y-2">
        {items?.map((item) => (
          <ItemCard
            key={item.productVariantId}
            variantId={item.productVariantId}
            onClick={onItemClick}
          >
            <ProductThumbnail variantId={item.productVariantId} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">
                Product #{item.productVariantId}
              </p>
              <p className="text-xs text-slate-500">
                {item.monthlyUsage} per month
              </p>
            </div>
            <button
              type="button"
              className="
                shrink-0 p-2.5 rounded-full 
                bg-emerald-100/80 text-emerald-600 
                hover:bg-emerald-200/80 hover:scale-105
                focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40
                transition-all duration-150 ease-out
              "
              aria-label="Add to cart"
            >
              <ShoppingCart size={16} />
            </button>
          </ItemCard>
        ))}
      </div>
    </DashboardSection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LOW STOCK SECTION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Low Stock Section
 * Renders products that are running low based on backend thresholds.
 * Uses warning amber accent (not red) for low-stock indicators.
 * 
 * @param items - Array of LowStock items from backend (unmodified)
 * @param onItemClick - Optional callback when item is clicked
 * @param showEmpty - Whether to show empty state (default: false)
 */
export function LowStockSection({ items, onItemClick, showEmpty = false }) {
  const isEmpty = !items || items.length === 0;

  // Hide section entirely if empty and showEmpty is false
  if (isEmpty && !showEmpty) return null;

  return (
    <DashboardSection
      title="Running Low"
      icon={AlertTriangle}
      iconClassName="bg-amber-100/80 text-amber-600"
      isEmpty={isEmpty}
      emptyState={
        <EmptyState
          icon={CheckCircle}
          iconClassName="bg-emerald-100/60 text-emerald-400"
          message="All items are well stocked"
        />
      }
    >
      <div className="space-y-2">
        {items?.map((item) => (
          <ItemCard
            key={item.productVariantId}
            variantId={item.productVariantId}
            onClick={onItemClick}
          >
            <ProductThumbnail variantId={item.productVariantId} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">
                Product #{item.productVariantId}
              </p>
              {/* Warning amber accent for low stock indicator */}
              <p className="text-xs text-amber-600 font-medium">
                {item.stock} left
              </p>
            </div>
            <button
              type="button"
              className="
                shrink-0 p-2.5 rounded-full 
                bg-amber-100/80 text-amber-600 
                hover:bg-amber-200/80 hover:scale-105
                focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40
                transition-all duration-150 ease-out
              "
              aria-label="Restock"
            >
              <ShoppingCart size={16} />
            </button>
          </ItemCard>
        ))}
      </div>
    </DashboardSection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMBINED DASHBOARD VIEW
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Home Dashboard View
 * Renders all dashboard sections when data is available.
 * Shows skeleton during loading for better perceived performance.
 * 
 * @param data - HomeDashboard response from backend (unmodified)
 * @param isLoading - Whether data is being fetched
 * @param onItemClick - Optional callback when any item is clicked
 * @param showEmptyStates - Whether to show friendly empty states (default: true)
 */
export function HomeDashboardView({ data, isLoading, onItemClick, showEmptyStates = true }) {
  // Feature flag check
  if (!ENABLE_HOME_DASHBOARD) return null;

  // Loading state - show skeleton for better UX
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // No data state - show empty states if enabled
  if (!data) {
    if (!showEmptyStates) return null;
    
    return (
      <div className="space-y-4">
        <BuyAgainSection items={[]} showEmpty={true} />
      </div>
    );
  }

  // Check if all sections are empty
  const hasContent =
    data.buyAgain.length > 0 ||
    data.monthlyStock.length > 0 ||
    data.lowStock.length > 0;

  // Show empty states if no content but showEmptyStates is enabled
  if (!hasContent && !showEmptyStates) return null;

  return (
    <div className="space-y-4">
      <BuyAgainSection 
        items={data.buyAgain} 
        onItemClick={onItemClick} 
        showEmpty={showEmptyStates}
      />
      <MonthlyStockSection 
        items={data.monthlyStock} 
        onItemClick={onItemClick}
        showEmpty={showEmptyStates}
      />
      <LowStockSection 
        items={data.lowStock} 
        onItemClick={onItemClick}
        showEmpty={showEmptyStates}
      />
    </div>
  );
}

// Export skeleton for external use (e.g., Suspense fallback)
export { DashboardSkeleton };
