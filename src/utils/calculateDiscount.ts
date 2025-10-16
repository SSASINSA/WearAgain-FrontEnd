export function calculateDiscount(
  originalPrice: number,
  discountedPrice: number,
): number {
  if (originalPrice <= 0 || discountedPrice < 0) {
    return 0;
  }

  const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
  return Math.round(discount);
}

export function calculateDiscountedPrice(
  originalPrice: number,
  discountPercentage: number,
): number {
  if (
    originalPrice <= 0 ||
    discountPercentage < 0 ||
    discountPercentage > 100
  ) {
    return originalPrice;
  }

  const discountAmount = (originalPrice * discountPercentage) / 100;
  return Math.round(originalPrice - discountAmount);
}

export function formatPrice(price: number, currency: string = 'KRW'): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatPriceWithDiscount(
  originalPrice: number,
  discountedPrice: number,
  currency: string = 'KRW',
): {
  original: string;
  discounted: string;
  discountPercentage: number;
} {
  const discountPercentage = calculateDiscount(originalPrice, discountedPrice);

  return {
    original: formatPrice(originalPrice, currency),
    discounted: formatPrice(discountedPrice, currency),
    discountPercentage,
  };
}
