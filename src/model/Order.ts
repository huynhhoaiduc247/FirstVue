import type { Product } from "./Product";

export class Order{
    id: number=0;
    createdDate: Date = new Date();
    listProduct: Array<Product>=[]
}