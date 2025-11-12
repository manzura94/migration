"use client";

import Image from "next/image";
import { MergedProduct } from "../types/product.inteface";
import { useState } from "react";
import ProductModal from "./ProductModal";
import { useAuth } from "../context/AuthContext";


interface ProductsProps {
  filteredProducts: MergedProduct[];
}




export default function ProductCard({filteredProducts}: ProductsProps
) {
   const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const {isLoggedIn} = useAuth();
 
 
    
  const handleSelectProduct=(productid:number)=>{
  setSelectedProduct(productid)
  setOpen(true)
  }
 

  return (
   
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
                <div className="menu__price-container">
                    {isLoggedIn && (el.discountPrice !== undefined || el.discountPrice !== null) ?
                    <>
                    <span className="menu__price menu__price--old">${el.price}</span>
                    <span className="menu__price menu__price--discount">${el.discountPrice ?? el.price}</span>
                    </> :
                    <span className="menu__wrapper-price">${el.price}</span>
                    }

                </div>
              </div>
            </div>
          ))}
          <ProductModal open={open} setOpen={setOpen} selectedProduct={selectedProduct}/>
        </div>
     
  );
}
