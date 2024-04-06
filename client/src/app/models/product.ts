export interface Product{
    id: number
    name: string
    description: string
    price: number
    pictureUrl: string
    type?: string
    brand: string
    quantityInStock?: number
}

// first step to add product parameters to the redux state. the goal will be to append query params to the /api/products(...) endpoint
export interface ProductParams{
    orderBy: string;
    searchTerm?: string;
    types: string[];
    brands: string[];
    pageNumber: number;
    pageSize: number;
}