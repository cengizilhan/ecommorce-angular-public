export interface Product {
  id: number;
  quantity: number;
  productCode: string;
  brand: string;
  title: any;
  price: number;
  isFreeCargo: boolean;
  description: { en: string; tr: string; es: string };
  categoryId: number;
  images: string[];
}
