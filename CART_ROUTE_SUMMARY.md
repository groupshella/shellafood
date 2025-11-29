# 🛒 Cart Route Summary

## 📍 Route Location
**Path:** `/cart`  
**Page File:** `src/app/cart/page.tsx`

---

## 📄 Main Page Component

### `src/app/cart/page.tsx`
**Purpose:** Server component that wraps the cart page with navigation and footer
- Sets up SEO metadata (Arabic/English)
- Includes NavBarCondition and ShellaFooter
- Renders the main CartPage component

---

## 🎨 Main Cart Component

### `src/components/Cart/CartPage.tsx` (624 lines)
**Purpose:** Main cart management component - handles all cart operations

**Key Features:**
- ✅ **Cart State Management** - Loads items from localStorage
- ✅ **Real-time Updates** - Listens to `cartUpdated` events
- ✅ **Store Grouping** - Groups products by store
- ✅ **Quantity Management** - Update/add/remove items
- ✅ **Clear All** - Remove all items with confirmation
- ✅ **Totals Calculation** - Subtotal, delivery fee, discounts, total
- ✅ **Checkout Flow** - Validates address & payment before checkout

**State Management:**
- `productItems` - Cart items array
- `selectedAddressId` - Selected delivery address
- `selectedPaymentMethod` - Payment method (apple_pay, stc_pay, card, cash, kaidha)
- `appliedCoupon` - Applied coupon
- `isLoading` / `isUpdating` / `isProcessing` - Loading states

**Key Functions:**
- `updateProductQuantity()` - Update item quantity with optimistic updates
- `removeProduct()` - Remove item from cart
- `clearAllProducts()` - Clear entire cart
- `handleCheckout()` - Validate and proceed to checkout
- `confirmCheckout()` - Final checkout confirmation

**UI Sections:**
1. Header with cart icon and item count
2. Promo banner (free delivery threshold)
3. Products grouped by store
4. Right sidebar: Coupon, Address, Payment, Order Summary

---

## 🧩 Supporting Components

### 1. `CartItemCard.tsx` (328 lines)
**Purpose:** Displays individual cart item with controls

**Features:**
- Product image, name, price
- Store header with logo
- Quantity controls (+/- buttons)
- Remove button with confirmation modal
- Stock warnings
- Special offer badges
- Subtotal calculation per item

**Props:**
- `item` - Cart product item
- `language` - en/ar
- `onUpdateQuantity` - Callback for quantity changes
- `onRemove` - Callback for removal

**Special Features:**
- Memoized for performance
- Animated remove confirmation modal
- Low stock warnings
- Responsive design

---

### 2. `AddressSelector.tsx` (445 lines)
**Purpose:** Select and manage delivery addresses

**Features:**
- Display selected address
- List all saved addresses
- Add new address (opens modal)
- View address on map
- Delete addresses
- Radio button selection UI
- Auto-selects first address if available

**Props:**
- `language` - en/ar
- `selectedAddressId` - Currently selected address
- `onAddressSelect` - Callback when address selected

**Modals:**
- Address list modal (radio selection)
- Add/Edit address modal
- Map view modal

**Integration:**
- Uses `AddEditAddressModal` from Profile components
- Uses `MapModal` for map view
- Reverse geocoding for address formatting

---

### 3. `PaymentOptions.tsx` (259 lines)
**Purpose:** Select payment method

**Features:**
- 5 payment methods:
  - Apple Pay
  - STC Pay
  - Credit/Debit Card (with form)
  - Cash on Delivery
  - Kaidha Wallet
- Card details form (when card selected)
- Visual selection with icons
- Security note

**Props:**
- `language` - en/ar
- `selectedMethod` - Currently selected method
- `onMethodSelect` - Callback when method selected

**Card Form Fields:**
- Card number (formatted: 1234 5678 9012 3456)
- Expiry date (MM/YY)
- CVV
- Cardholder name

---

### 4. `OrderSummary.tsx` (258 lines)
**Purpose:** Display order totals and checkout button

**Features:**
- Subtotal display
- Delivery fee
- Discount calculation
- Free delivery progress bar
- Total amount (large, animated)
- Estimated delivery time
- Checkout button
- Security badge

**Props:**
- `language` - en/ar
- `subtotal`, `deliveryFee`, `discount`, `total`
- `isLoading` - Processing state
- `onCheckout` - Checkout callback
- `canCheckout` - Enable/disable button
- `estimatedDeliveryTime` - Delivery estimate

**Special Features:**
- Sticky positioning on scroll (desktop)
- Expandable on mobile
- Animated price changes
- Free delivery threshold indicator (100 SAR)
- Savings message when discount applied

---

### 5. `CouponSection.tsx` (254 lines)
**Purpose:** Apply discount coupons

**Features:**
- Coupon code input
- Apply/Remove coupon buttons
- Validation with loading state
- Success/error feedback
- Applied coupon display
- Mock coupon validation (SAVE10, FIXED20, WELCOME15)

**Props:**
- `language` - en/ar
- `onCouponApplied` - Callback when coupon applied
- `onCouponRemoved` - Callback when removed
- `appliedCoupon` - Currently applied coupon

**Mock Coupons:**
- `SAVE10` - 10% discount
- `FIXED20` - 20 SAR off
- `WELCOME15` - 15% discount

---

### 6. `ConfirmCheckoutModal.tsx` (256 lines)
**Purpose:** Final checkout confirmation modal

**Features:**
- Order summary display
- Processing animation
- Step-by-step processing (validating → processing → success)
- Order details breakdown
- Cancel button (disabled during processing)
- Redirects to `/checkout/confirmation?type=products`

**Props:**
- `isOpen` - Modal visibility
- `language` - en/ar
- `isProcessing` - Processing state
- `onConfirm` - Confirm callback
- `onCancel` - Cancel callback
- `orderSummary` - Order totals object

**Processing Steps:**
1. Validating order
2. Processing payment
3. Success (redirects)

---

### 7. `EmptyCartState.tsx` (141 lines)
**Purpose:** Display when cart is empty

**Features:**
- Animated empty cart icon
- Friendly message
- Two CTA buttons:
  - Explore Products → `/categories`
  - Explore Services → `/serve-me`
- Decorative sparkles animation

**Props:**
- `language` - en/ar

---

### 8. `SkeletonLoader.tsx` (59 lines)
**Purpose:** Loading skeletons for cart items and summary

**Components:**
- `CartItemSkeleton` - Item card skeleton
- `OrderSummarySkeleton` - Summary skeleton

---

### 9. `CartServiceCard.tsx` (218 lines)
**Purpose:** Display service items in cart (if applicable)

*Note: Not currently used in main CartPage, but available for service cart items*

---

## 🔄 Data Flow

```
1. Page Load
   ↓
2. CartPage loads items from localStorage
   ↓
3. Items grouped by store
   ↓
4. User can:
   - Update quantities
   - Remove items
   - Apply coupons
   - Select address
   - Select payment
   ↓
5. Order summary calculates totals
   ↓
6. User clicks "Confirm & Checkout"
   ↓
7. Validation (address + payment required)
   ↓
8. ConfirmCheckoutModal opens
   ↓
9. Processing → Redirect to confirmation page
```

---

## 🎯 Key Features Summary

### Cart Management
- ✅ Add/Remove items
- ✅ Update quantities
- ✅ Clear all items
- ✅ Group by store
- ✅ Real-time updates

### Checkout Flow
- ✅ Address selection
- ✅ Payment method selection
- ✅ Coupon application
- ✅ Order summary
- ✅ Validation before checkout
- ✅ Confirmation modal

### UI/UX
- ✅ Responsive design
- ✅ Arabic/English support
- ✅ Dark mode support
- ✅ Animations (Framer Motion)
- ✅ Loading states
- ✅ Empty states
- ✅ Error handling
- ✅ Toast notifications

### Calculations
- ✅ Subtotal (sum of all items)
- ✅ Delivery fee (10 SAR if items exist)
- ✅ Discount (from coupons)
- ✅ Total (subtotal + delivery - discount)
- ✅ Free delivery threshold (100 SAR)

---

## 📱 Responsive Design

**Desktop (lg):**
- 2-column layout (items | summary)
- Sticky order summary
- Full address list

**Mobile:**
- Single column
- Collapsible order summary
- Compact item cards

---

## 🌐 Internationalization

All components support:
- **Arabic (RTL)** - `language === "ar"`
- **English (LTR)** - `language === "en"`

Text, layouts, and animations adapt based on language.

---

## 🔐 Data Storage

**Cart Items:** Stored in `localStorage` via `cartStorage` utility
- Key: Cart items array
- Updates trigger `cartUpdated` event
- Real-time sync across components

---

## 🎨 Design System

**Colors:**
- Primary: Emerald/Green (`emerald-600`, `green-600`)
- Success: Green shades
- Error: Red shades
- Warning: Orange/Yellow

**Components:**
- Rounded corners (`rounded-xl`, `rounded-2xl`)
- Shadows (`shadow-sm`, `shadow-lg`)
- Gradients (emerald to green)
- Border styles

**Animations:**
- Framer Motion for transitions
- Hover effects
- Loading spinners
- Modal animations

---

## 📊 Component Hierarchy

```
CartPage (Main)
├── Header
│   ├── Cart Icon + Count
│   └── Continue Shopping Button
├── Promo Banner (if subtotal < 100)
├── Products Section
│   ├── Clear All Button
│   └── Products by Store
│       └── CartItemCard (per item)
│           └── Remove Confirmation Modal
└── Sidebar (Right)
    ├── CouponSection
    ├── AddressSelector
    │   ├── Address List Modal
    │   ├── Add Address Modal
    │   └── Map Modal
    ├── PaymentOptions
    │   └── Card Form (if card selected)
    └── OrderSummary
        └── Checkout Button
            └── ConfirmCheckoutModal
```

---

## 🚀 Usage Example

```tsx
// User visits /cart
// CartPage loads items from localStorage
// User sees:
// - All cart items grouped by store
// - Can update quantities
// - Can apply coupon
// - Must select address
// - Must select payment
// - Sees order summary
// - Clicks "Confirm & Checkout"
// - Modal opens → Processing → Redirect
```

---

## 📝 Notes

- **Mock Data:** Coupon validation uses mock coupons
- **Storage:** Uses localStorage (client-side only)
- **Real-time:** Listens to `cartUpdated` window events
- **Validation:** Address and payment required before checkout
- **Redirect:** After checkout → `/checkout/confirmation?type=products`

---

**Total Components:** 10  
**Total Lines:** ~2,500+  
**Languages:** Arabic + English  
**Framework:** Next.js 14 (App Router) + React + TypeScript

