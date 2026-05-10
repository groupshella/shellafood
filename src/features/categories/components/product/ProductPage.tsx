"use client";

import ProductViewComponent, { type ProductDetailPayload } from "./ProductView";

interface ProductPageProps {
  productResponse: ProductDetailPayload;
  departmentId?: number;
}

export default function ProductPage({ productResponse, departmentId }: ProductPageProps) {
  return <ProductViewComponent product={productResponse} departmentId={departmentId} />;
}

