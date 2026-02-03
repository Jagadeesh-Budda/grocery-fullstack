/**
 * IFLI Surface Renderer
 * Maps surfaces[] from useIFLI to visible UI elements.
 * Uses specialized surface components for each intent type.
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * GLASSMORPHISM UPGRADE (v2.0)
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * BEFORE (v1.x):
 * - Basic white background with opacity (bg-white/70)
 * - Simple box-shadow
 * - Single slideUp animation
 * - Inconsistent blur levels across cards
 * 
 * AFTER (v2.0):
 * - Premium multi-layer glassmorphism with backdrop-blur-2xl (24px)
 * - Layered translucent gradients for depth perception
 * - Soft outer glow + crisp inner highlight border
 * - Combined fade + slide animation with staggered timing
 * - Consistent design tokens across all surface types
 * - Mobile-optimized touch targets (min 44px)
 * - Enhanced focus states for accessibility
 * 
 * Design Tokens:
 * - Blur: backdrop-blur-2xl (24px) for premium glass effect
 * - Background: Multi-stop gradient with white/95 → white/80 → white/90
 * - Border: 1px white/60 outer + inset white/80 highlight
 * - Shadow: Soft 32px spread + subtle color tint per intent
 * - Animation: 400ms ease-out with 8px slide distance
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, AlertTriangle, ShoppingBag, X, ArrowRight, Package, RefreshCw, Plus, HelpCircle, ArrowRightLeft, Sparkles, Zap } from "lucide-react";

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * REUSABLE GLASS SURFACE COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * A premium glassmorphism container for IFLI intent surfaces.
 * Provides consistent styling, animations, and accessibility across all cards.
 * 
 * Props:
 * - children: Card content
 * - variant: 'default' | 'success' | 'warning' | 'info' | 'accent' - color theme
 * - priority: 1 | 2 | 3 - affects shadow intensity (1 = most prominent)
 * - ariaLive: 'polite' | 'assertive' - screen reader announcement priority
 * - className: Additional classes to merge
 * 
 * Features:
 * - Multi-layer glass effect with 24px backdrop blur
 * - Subtle gradient background for depth
 * - Soft colored shadow based on variant
 * - Smooth fade + slide entrance animation
 * - Mobile-safe width (92vw max, 380px ideal)
 */
function GlassSurface({ 
  children, 
  variant = "default", 
  priority = 2,
  ariaLive = "polite",
  className = "" 
}) {
  // Variant-specific accent colors for shadows and highlights
  const variantStyles = {
    default: {
      shadow: "shadow-[0_8px_32px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)]",
      glow: "",
      gradient: "from-white/95 via-white/85 to-slate-50/90",
    },
    success: {
      shadow: "shadow-[0_8px_32px_rgba(16,185,129,0.12),0_2px_8px_rgba(16,185,129,0.06)]",
      glow: "ring-1 ring-emerald-500/10",
      gradient: "from-white/95 via-emerald-50/30 to-white/90",
    },
    warning: {
      shadow: "shadow-[0_8px_32px_rgba(245,158,11,0.12),0_2px_8px_rgba(245,158,11,0.06)]",
      glow: "ring-1 ring-amber-500/10",
      gradient: "from-white/95 via-amber-50/30 to-white/90",
    },
    info: {
      shadow: "shadow-[0_8px_32px_rgba(59,130,246,0.12),0_2px_8px_rgba(59,130,246,0.06)]",
      glow: "ring-1 ring-blue-500/10",
      gradient: "from-white/95 via-blue-50/30 to-white/90",
    },
    accent: {
      shadow: "shadow-[0_8px_32px_rgba(139,92,246,0.12),0_2px_8px_rgba(139,92,246,0.06)]",
      glow: "ring-1 ring-violet-500/10",
      gradient: "from-white/95 via-violet-50/30 to-white/90",
    },
  };

  const style = variantStyles[variant] || variantStyles.default;
  
  // Priority affects shadow intensity
  const priorityShadow = priority === 1 
    ? "shadow-lg" 
    : priority === 3 
      ? "shadow-sm" 
      : "";

  return (
    <div
      className={`
        relative w-[min(380px,92vw)] rounded-2xl p-5
        
        /* Glass layers */
        bg-gradient-to-br ${style.gradient}
        backdrop-blur-2xl
        
        /* Border: outer stroke + inner highlight */
        border border-white/60
        before:absolute before:inset-0 before:rounded-2xl
        before:border before:border-white/40
        before:pointer-events-none
        
        /* Shadow + optional glow */
        ${style.shadow} ${priorityShadow} ${style.glow}
        
        /* Inner highlight for depth */
        after:absolute after:inset-[1px] after:rounded-[15px]
        after:bg-gradient-to-b after:from-white/50 after:to-transparent
        after:h-[40%] after:pointer-events-none
        
        /* Animation: fade + slide, no bounce */
        animate-[glassSlideIn_400ms_ease-out_both]
        
        ${className}
      `}
      role="status"
      aria-live={ariaLive}
    >
      {/* Content layer - above pseudo-elements */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

/**
 * Dismiss button - consistent across all surfaces
 * 44px touch target for mobile accessibility
 */
function DismissButton({ onDismiss, surfaceId }) {
  return (
    <button
      onClick={() => onDismiss(surfaceId)}
      className="
        absolute top-2 right-2 z-20
        w-8 h-8 rounded-full
        flex items-center justify-center
        text-slate-400 
        hover:text-slate-600 hover:bg-slate-900/5
        focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/50
        transition-all duration-200
        
        /* 44px touch target (button is 32px, but has padding) */
        before:absolute before:inset-[-6px] before:content-['']
      "
      aria-label="Dismiss notification"
    >
      <X size={16} strokeWidth={2.5} />
    </button>
  );
}

/**
 * Primary action button - glassmorphism style
 */
function PrimaryButton({ onClick, children, variant = "emerald", className = "" }) {
  const variantClasses = {
    emerald: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25 focus-visible:ring-emerald-500/50",
    amber: "bg-amber-600 hover:bg-amber-700 shadow-amber-600/25 focus-visible:ring-amber-500/50",
    violet: "bg-violet-600 hover:bg-violet-700 shadow-violet-600/25 focus-visible:ring-violet-500/50",
    blue: "bg-blue-600 hover:bg-blue-700 shadow-blue-600/25 focus-visible:ring-blue-500/50",
  };

  return (
    <button
      onClick={onClick}
      className={`
        flex-1 inline-flex items-center justify-center gap-2
        min-h-[44px] rounded-full px-5 py-2.5
        text-sm font-semibold text-white
        ${variantClasses[variant] || variantClasses.emerald}
        shadow-md hover:shadow-lg
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1
        transition-all duration-200
        ${className}
      `}
    >
      {children}
    </button>
  );
}

/**
 * Secondary/dismiss action button
 */
function SecondaryButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="
        min-h-[44px] rounded-full px-4 py-2.5
        text-sm font-medium text-slate-600
        hover:bg-slate-900/5 hover:text-slate-700
        focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/50
        transition-all duration-200
      "
    >
      {children}
    </button>
  );
}

/**
 * Icon badge - glassmorphism style
 */
function IconBadge({ icon: Icon, variant = "emerald", pulse = false, size = "md" }) {
  const variantClasses = {
    emerald: "bg-emerald-100/90 text-emerald-600 ring-emerald-500/20",
    amber: "bg-amber-100/90 text-amber-600 ring-amber-500/20",
    violet: "bg-violet-100/90 text-violet-600 ring-violet-500/20",
    blue: "bg-blue-100/90 text-blue-600 ring-blue-500/20",
    orange: "bg-orange-100/90 text-orange-600 ring-orange-500/20",
    sky: "bg-sky-100/90 text-sky-600 ring-sky-500/20",
  };

  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-11 w-11",
    lg: "h-14 w-14",
  };

  const iconSizes = { sm: 18, md: 22, lg: 26 };

  return (
    <div 
      className={`
        flex-shrink-0 grid place-items-center rounded-xl
        ${sizeClasses[size]}
        ${variantClasses[variant] || variantClasses.emerald}
        ring-1 shadow-sm
        backdrop-blur-sm
        ${pulse ? "animate-pulse" : ""}
      `}
    >
      <Icon size={iconSizes[size]} strokeWidth={2} />
    </div>
  );
}

/**
 * Product preview thumbnails for abandoned cart
 */
function ProductPreview({ products }) {
  if (!products || products.length === 0) return null;

  const visibleProducts = products.slice(0, 3);
  const remainingCount = Math.max(0, products.length - 3);

  return (
    <div className="flex items-center gap-2 mt-4">
      {visibleProducts.map((product, idx) => (
        <div
          key={product.id || idx}
          className="
            h-11 w-11 rounded-xl 
            border border-white/70
            bg-white/60 backdrop-blur-sm
            ring-1 ring-slate-900/5
            flex items-center justify-center
            overflow-hidden
            shadow-sm
          "
        >
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name || "Product"}
              className="h-full w-full object-cover"
            />
          ) : (
            <Package size={16} className="text-slate-400" />
          )}
        </div>
      ))}
      {remainingCount > 0 && (
        <div className="h-11 w-11 rounded-xl bg-slate-100/80 ring-1 ring-slate-900/5 flex items-center justify-center shadow-sm">
          <span className="text-xs font-semibold text-slate-500">+{remainingCount}</span>
        </div>
      )}
    </div>
  );
}

/**
 * Specialized abandoned cart surface with product preview
 */
function AbandonedCartCard({ surface, onDismiss, navigate }) {
  const cart = surface.payload?.cart || { items: [], total: 0 };
  const itemCount = cart.items?.length || 0;

  return (
    <GlassSurface variant="warning" priority={2}>
      <DismissButton onDismiss={onDismiss} surfaceId={surface.id} />

      {/* Icon + Header */}
      <div className="flex items-start gap-3 pr-8">
        <IconBadge icon={ShoppingCart} variant="amber" />
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold text-slate-800 leading-snug">
            Continue where you left off
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {itemCount} item{itemCount !== 1 ? "s" : ""} waiting
            {cart.total > 0 && ` · $${cart.total.toFixed(2)}`}
          </p>
        </div>
      </div>

      {/* Product Preview */}
      <ProductPreview products={cart.items} />

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2">
        <PrimaryButton
          onClick={() => {
            navigate("/groceries/cart");
            onDismiss(surface.id);
          }}
          variant="emerald"
        >
          View cart
          <ArrowRight size={16} />
        </PrimaryButton>
        <SecondaryButton onClick={() => onDismiss(surface.id)}>
          Later
        </SecondaryButton>
      </div>
    </GlassSurface>
  );
}

/**
 * Specialized Running Low surface with product info and reason
 * Shows WHY the surface appeared (purchase pattern) and Quick Add button
 */
function RunningLowCard({ surface, onDismiss, onAction }) {
  const payload = surface.payload || {};
  const productName = payload.productName || "Item";
  const reasonText = payload.reasonText || "Time to restock?";
  const imageUrl = payload.imageUrl;
  const price = payload.price || 0;
  const daysOverdue = payload.daysOverdue || 0;

  // Determine urgency styling based on how overdue
  const isUrgent = daysOverdue >= 3;
  const iconVariant = isUrgent ? "orange" : "sky";

  const handleQuickAdd = () => {
    onAction(surface.id, "QUICK_ADD_TO_CART");
  };

  return (
    <GlassSurface variant={isUrgent ? "warning" : "info"} priority={isUrgent ? 1 : 2}>
      <DismissButton onDismiss={onDismiss} surfaceId={surface.id} />

      {/* Product with image/icon */}
      <div className="flex items-start gap-3 pr-8">
        {/* Product image or placeholder */}
        {imageUrl ? (
          <div className="flex-shrink-0 h-14 w-14 rounded-xl overflow-hidden ring-1 ring-slate-900/10 shadow-sm">
            <img
              src={imageUrl}
              alt={productName}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <IconBadge icon={RefreshCw} variant={iconVariant} size="lg" />
        )}

        {/* Product info */}
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold text-slate-800 leading-snug line-clamp-1">
            {productName}
          </p>
          {/* Dynamic reason — WHY this surface is shown */}
          <p className="mt-1 text-sm text-slate-500 leading-relaxed">
            {reasonText}
          </p>
          {price > 0 && (
            <p className="mt-1.5 text-sm font-semibold text-emerald-600">
              ${price.toFixed(2)}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2">
        <PrimaryButton onClick={handleQuickAdd} variant="emerald">
          <Plus size={16} />
          Quick Add
        </PrimaryButton>
        <SecondaryButton onClick={() => onDismiss(surface.id)}>
          Not now
        </SecondaryButton>
      </div>
    </GlassSurface>
  );
}

/**
 * Decision Paralysis surface — helps users who are browsing but not deciding
 * Shows "Having trouble deciding?" with a "Compare top picks" CTA
 */
function DecisionParalysisCard({ surface, onDismiss, onAction }) {
  const payload = surface.payload || {};
  const dwellSeconds = payload.dwellSeconds || 60;
  const revisitCount = payload.revisitCount || 2;

  // Format dwell time for display
  const dwellMinutes = Math.floor(dwellSeconds / 60);
  const dwellDisplay = dwellMinutes >= 1 
    ? `${dwellMinutes}+ min browsing` 
    : `${dwellSeconds}s browsing`;

  const handleCompare = () => {
    onAction(surface.id, "COMPARE_PRODUCTS");
  };

  return (
    <GlassSurface variant="accent" priority={2}>
      <DismissButton onDismiss={onDismiss} surfaceId={surface.id} />

      {/* Icon + Header */}
      <div className="flex items-start gap-3 pr-8">
        <IconBadge icon={HelpCircle} variant="violet" />
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold text-slate-800 leading-snug">
            Having trouble deciding?
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {dwellDisplay} · {revisitCount} items revisited
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2">
        <PrimaryButton onClick={handleCompare} variant="violet">
          <ArrowRightLeft size={16} />
          Compare top picks
        </PrimaryButton>
        <SecondaryButton onClick={() => onDismiss(surface.id)}>
          Just browsing
        </SecondaryButton>
      </div>
    </GlassSurface>
  );
}

/**
 * Bundle Opportunity surface — suggests complementary products
 * Shows "Looks like you're making pasta — add parmesan?" with one-tap add
 */
function BundleOpportunityCard({ surface, onDismiss, onAction }) {
  const payload = surface.payload || {};
  const contextName = payload.contextName || "your meal";
  const suggestedProduct = payload.suggestedProduct || "something";
  const triggerItems = payload.triggerItems || [];

  // Build trigger items display (e.g., "pasta, sauce")
  const triggerDisplay = triggerItems
    .slice(0, 2)
    .map(item => item.name)
    .join(", ");

  const handleQuickAdd = () => {
    onAction(surface.id, "QUICK_ADD_BUNDLE");
  };

  return (
    <GlassSurface variant="warning" priority={2}>
      <DismissButton onDismiss={onDismiss} surfaceId={surface.id} />

      {/* Icon + Header */}
      <div className="flex items-start gap-3 pr-8">
        <IconBadge icon={Sparkles} variant="amber" />
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold text-slate-800 leading-snug">
            Looks like you're making {contextName}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Add {suggestedProduct}?
            {triggerDisplay && <span className="text-slate-400"> · Based on {triggerDisplay}</span>}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2">
        <PrimaryButton onClick={handleQuickAdd} variant="amber">
          <Plus size={16} />
          Add {suggestedProduct}
        </PrimaryButton>
        <SecondaryButton onClick={() => onDismiss(surface.id)}>
          No thanks
        </SecondaryButton>
      </div>
    </GlassSurface>
  );
}

/**
 * Velocity Checkout surface — fast shopper ready to checkout
 * Shows "You're on a roll" with Express Checkout CTA
 * Highest priority (1), auto-dismiss after 30 seconds
 */
function VelocityCheckoutCard({ surface, onDismiss, navigate }) {
  const payload = surface.payload || {};
  const cartTotal = payload.cartTotal || 0;
  const cartItemCount = payload.cartItemCount || 0;
  const itemsPerMinute = payload.itemsPerMinute || 3;

  const handleExpressCheckout = () => {
    navigate("/groceries/checkout");
    onDismiss(surface.id);
  };

  return (
    <GlassSurface variant="success" priority={1} ariaLive="assertive">
      <DismissButton onDismiss={onDismiss} surfaceId={surface.id} />

      {/* Icon + Header */}
      <div className="flex items-start gap-3 pr-8">
        <IconBadge icon={Zap} variant="emerald" pulse />
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold text-slate-800 leading-snug">
            You're on a roll — ready to checkout?
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {cartItemCount} item{cartItemCount !== 1 ? "s" : ""} · ${cartTotal.toFixed(2)}
            <span className="ml-1.5 text-emerald-600 font-semibold">
              ⚡ {itemsPerMinute} adds/min
            </span>
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2">
        <PrimaryButton onClick={handleExpressCheckout} variant="emerald">
          <Zap size={16} />
          Express Checkout
        </PrimaryButton>
        <SecondaryButton onClick={() => onDismiss(surface.id)}>
          Keep shopping
        </SecondaryButton>
      </div>
    </GlassSurface>
  );
}

/**
 * Generic surface card for other intent types
 * Uses GlassSurface for consistent styling
 */
function GenericSurfaceCard({ surface, onDismiss, onAction, navigate }) {
  const iconMap = {
    checkout_ready: ShoppingBag,
    running_low: AlertTriangle,
  };

  const IconComponent = iconMap[surface.intentId] || AlertTriangle;

  const primaryText =
    surface.contentComponents?.find((c) => c.type === "text")?.data?.body ||
    "Suggestion";

  const handleAction = (handler) => {
    switch (handler) {
      case "NAVIGATE_CART":
        navigate("/groceries/cart");
        onDismiss(surface.id);
        break;
      case "NAVIGATE_GROCERIES":
        navigate("/groceries");
        onDismiss(surface.id);
        break;
      case "DISMISS_SURFACE":
        onDismiss(surface.id);
        break;
      default:
        onAction(surface.id, handler);
    }
  };

  return (
    <GlassSurface variant="default" priority={surface.priority || 2}>
      {surface.dismissable && (
        <DismissButton onDismiss={onDismiss} surfaceId={surface.id} />
      )}

      <div className="flex items-start gap-3 pr-8">
        <IconBadge icon={IconComponent} variant="emerald" />
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold text-slate-800 leading-snug">{primaryText}</p>
          {surface.contentComponents
            ?.filter((c) => c.type === "text" && c.data?.variant === "muted")
            .map((c, i) => (
              <p key={i} className="mt-1 text-sm text-slate-500">
                {c.data.body}
              </p>
            ))}
        </div>
      </div>

      {surface.allowedActions?.length > 0 && (
        <div className="mt-4 flex items-center gap-2">
          {surface.allowedActions
            .filter((a) => a.type !== "dismiss")
            .map((action) => (
              action.type === "primary" ? (
                <PrimaryButton
                  key={action.id}
                  onClick={() => handleAction(action.handler)}
                  variant="emerald"
                >
                  {action.label}
                </PrimaryButton>
              ) : (
                <SecondaryButton
                  key={action.id}
                  onClick={() => handleAction(action.handler)}
                >
                  {action.label}
                </SecondaryButton>
              )
            ))}
        </div>
      )}
    </GlassSurface>
  );
}

/**
 * Render appropriate surface card based on intentId
 */
function SurfaceCard({ surface, onDismiss, onAction }) {
  const navigate = useNavigate();

  // Log when this surface mounts (becomes visible)
  useEffect(() => {
    console.log("[IFLI][SURFACE_VISIBLE]", {
      id: surface.id,
      intentId: surface.intentId,
      relevanceScore: surface.relevanceScore,
    });
  }, [surface.id, surface.intentId, surface.relevanceScore]);

  // Use specialized component for abandoned cart
  if (surface.intentId === "cart_abandoned") {
    return (
      <AbandonedCartCard
        surface={surface}
        onDismiss={onDismiss}
        navigate={navigate}
      />
    );
  }

  // Use specialized component for running low
  if (surface.intentId === "running_low") {
    return (
      <RunningLowCard
        surface={surface}
        onDismiss={onDismiss}
        onAction={onAction}
      />
    );
  }

  // Use specialized component for decision paralysis
  if (surface.intentId === "decision_paralysis") {
    return (
      <DecisionParalysisCard
        surface={surface}
        onDismiss={onDismiss}
        onAction={onAction}
      />
    );
  }

  // Use specialized component for bundle opportunity
  if (surface.intentId === "bundle_opportunity") {
    return (
      <BundleOpportunityCard
        surface={surface}
        onDismiss={onDismiss}
        onAction={onAction}
      />
    );
  }

  // Use specialized component for velocity checkout (fast shopper)
  if (surface.intentId === "velocity_checkout") {
    return (
      <VelocityCheckoutCard
        surface={surface}
        onDismiss={onDismiss}
        navigate={navigate}
      />
    );
  }

  // Generic card for other intents
  return (
    <GenericSurfaceCard
      surface={surface}
      onDismiss={onDismiss}
      onAction={onAction}
      navigate={navigate}
    />
  );
}

/**
 * IFLISurfaceRenderer
 * Container that renders all active IFLI surfaces.
 *
 * @param {Object} props
 * @param {Array} props.surfaces - Array of Surface objects from useIFLI
 * @param {(id: string) => void} props.onDismiss - Dismiss handler
 * @param {(id: string, handler: string) => void} props.onAction - Action handler
 */
export default function IFLISurfaceRenderer({ surfaces, onDismiss, onAction }) {
  const prevCountRef = useRef(0);

  // Log when surfaces array changes
  useEffect(() => {
    if (surfaces.length !== prevCountRef.current) {
      console.log("[IFLI][SURFACES_CHANGED]", {
        count: surfaces.length,
        intents: surfaces.map((s) => s.intentId),
      });
      prevCountRef.current = surfaces.length;
    }
  }, [surfaces]);

  if (!surfaces || surfaces.length === 0) {
    return null;
  }

  return (
    <>
      {/* 
        ═══════════════════════════════════════════════════════════════════════
        GLASSMORPHISM ANIMATION KEYFRAMES
        ═══════════════════════════════════════════════════════════════════════
        
        glassSlideIn: Premium entrance animation
        - Combines opacity fade with subtle vertical slide
        - Uses ease-out for natural deceleration
        - 8px slide distance (subtle, not jarring)
        - 400ms duration for smooth perception
        
        No bounce or aggressive motion - maintains premium feel.
        ═══════════════════════════════════════════════════════════════════════
      */}
      <style>{`
        @keyframes glassSlideIn {
          0% {
            opacity: 0;
            transform: translateY(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Legacy fallback for older references */
        @keyframes slideUp {
          0% {
            opacity: 0;
            transform: translateY(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div
        className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[55] flex flex-col gap-3 pointer-events-none"
        role="complementary"
        aria-label="Smart suggestions"
      >
        {surfaces.map((surface) => (
          <div key={surface.id} className="pointer-events-auto">
            <SurfaceCard
              surface={surface}
              onDismiss={onDismiss}
              onAction={onAction}
            />
          </div>
        ))}
      </div>
    </>
  );
}
