//import { useEffect } from "react";
//import { type Product } from "../../app/models/product";
import ProductList from "./ProductList";
import { useFetchProductsQuery } from "./catalogApi";

export default function Catalog() {
  // const [products, setProducts] = useState<Product[]>([]);
    const { data, isLoading } = useFetchProductsQuery();
   
      // useEffect(() => {
      //   fetch("https://localhost:5001/api/products")
      //     .then((response) => response.json())
      //     .then((data) => setProducts(data));
      // }, []);
 if (isLoading || !data) return <div>Loading...</div>;

  return (
    <>
      <ProductList products={data} />
    </>
  );
}
