"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  BackendProduct,
  MenuProduct,
  MergedProduct,
} from "../types/product.inteface";
import ProductCard from "./ProductCard";


const categoryButtons = [
  { id: 1, name: "coffee", image: "/images/icons/coffe.svg", alt: "coffee" },
  { id: 2, name: "tea", image: "/images/icons/tea.svg", alt: "tea" },
  { id: 3, name: "dessert", image: "/images/icons/cake.svg", alt: "cake" },
];





const BASE_URL = "https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com";
const FAVORITES_ENDPOINT = `${BASE_URL}/products`;

export default function MenuPage() {
  const [category, setCategory] = useState("coffee");
  const [products, setProducts] = useState<MergedProduct[]>([]);
  const [error, setError] = useState(false);
  const [loader, setLoader] = useState(false);

  async function getAllProducts(): Promise<MergedProduct[]> {
    try {
      const [backendRes, menuRes] = await Promise.all([
        fetch(FAVORITES_ENDPOINT),
        fetch("/data/menu.json"),
      ]);

      if (!backendRes.ok || !menuRes.ok) {
        setError(true);
        return [];
      }

      const backendJson = await backendRes.json();
      const backendData: BackendProduct[] = backendJson.data;
      const menuData: MenuProduct[] = await menuRes.json();

      const allProducts: MergedProduct[] = backendData.map(
        (product: BackendProduct) => {
          const menuItem = menuData.find((item) => item.id === product.id);
          return {
            ...product,
            imageUrl: menuItem?.image ?? null,
          };
        },
      );

      setProducts(allProducts);
      return allProducts;
    } catch (e) {
      console.error(e);
      setError(true);
      return [];
    } finally {
      setLoader(false);
    }
  }

  const onChangeCategory = (item: string) => {
    setLoader(true);
    setCategory(item);
    setTimeout(() => {
      setLoader(false);
    }, 3000);
  };



  useEffect(() => {
    getAllProducts();
  }, []);

  const filteredProducts = products.filter(
    (item) => item.category === category,
  );


  return (
    <main className="menu menu__container">
      <h1 className="menu__title">
        Behind each of our cups hides an <i>amazing surprise</i>
      </h1>
      <div className="menu__buttons">
        {categoryButtons.map((item) => (
          <button
            className={`menu-button ${item.name === category && "active"}`}
            key={item.id}
            onClick={() => onChangeCategory(item.name)}
          >
            <span className="menu__buttons-icon">
              <Image width={30} height={30} src={item.image} alt={item.alt} />
            </span>
            <span className="menu__buttons-text">{item.name}</span>
          </button>
        ))}
      </div>
      {loader ? (
        <div className="loader"></div>
      ) : !filteredProducts.length && error ? (
        <div className="menu__error">
          ⚠ Failed to load menu. Try again later.
        </div>
      ) : (
        <ProductCard filteredProducts={filteredProducts}/>
      )}
      <button className="menu__showmore">
        <Image
          width={50}
          height={50}
          src="/images/icons/showmore-button.svg"
          alt="showmore button"
        />
      </button>
    </main>
  );
}
