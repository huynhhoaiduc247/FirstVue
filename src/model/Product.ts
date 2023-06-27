export class Product{
    name: string="";
    price: number=0;
    quantity: number=0;
    category: Array<any>= []; //checkbox
    status: string="";
    select: Array<any>= [];
    datetime: Date=new Date();
}