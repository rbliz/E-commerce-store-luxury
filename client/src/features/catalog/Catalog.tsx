import { Product } from "../../app/models/product";
import ProductList from "./ProductList";
import { useState, useEffect } from "react";
// import "../../app/layout/styles.css"


export default function Catalog(){
    const [products, setProducts] = useState<Product[]>([]);

useEffect(()=>{
  fetch("http://localhost:5000/api/products")
  .then(response => response.json())
  .then(data => setProducts(data))
}, [])


    return(
        <>
            <ProductList products={products} />
        </>
    )
}
