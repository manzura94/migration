"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  BackendProduct,
  MenuProduct,
  MergedProduct,
} from "../types/product.inteface";
import ProductModal from "./ProductModal";


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
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [error, setError] = useState(false);
  const [loader, setLoader] = useState(false);
  const [open, setOpen] = useState(false);

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

  const handleSelectProduct=(productid:number)=>{
  setSelectedProduct(productid)
  setOpen(true)
  }

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
        <div className="menu__wrapper">
          {filteredProducts.map((el) => (
            <div key={el.id} className="menu__wrapper-item" onClick={()=>handleSelectProduct(el.id)}>
               
              <div className="menu__wrapper-image">
                <Image
                  className="coffee-image"
                  width={100}
                  height={100}
                  alt={el.name}
                  src={`${el?.imageUrl ?? '/images/tea-2.jpg'}`}
                />
              </div>
              <div className="menu__wrapper-info">
                <h4 className="menu__wrapper-subtitle">{el.name}</h4>
                <p className="menu__wrapper-text">{el.description}</p>
                <div className="menu__price-container">{el.price}</div>
              </div>
            {open && <ProductModal open={open} setOpen={setOpen} selectedProduct={selectedProduct}/>}
            </div>
          ))}
        </div>
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
