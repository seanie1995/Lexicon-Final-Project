import type { ProductWithRelations } from "./prisma";

export interface CartContextType {
  cartItems: ProductWithRelations[];
  addToCart: (product: ProductWithRelations) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  isInCart: (productId: number) => boolean;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}
