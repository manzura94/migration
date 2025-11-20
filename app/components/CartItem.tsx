"use client";

import Image from "next/image";
import { CartItem } from "../types/cart.interface";
import { Dispatch, SetStateAction } from "react";
import { useCart } from "../context/CartContext";

interface ChildProps {
    cart: CartItem[];
    setCart:Dispatch<SetStateAction<CartItem[]>>
}

export default function CartItemPage({ cart, setCart }: ChildProps) {
    const { updateCart } = useCart();
  
  const removeItem = (id: number | string) => {
    const updated = cart.filter((item) => item.cartId !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
      updateCart();
  };

  return (
    <div className="cart__wrap">
      {cart.map((item) => (
        <div key={item.cartId} className="cart__items">
          <div className="cart__item">
            <div className="cart__items-left">
              <div
                className="cart__items-deleteicon"
                onClick={() => removeItem(item.cartId!)}
              >
                <Image
                  width={30}
                  height={30}
                  src="/images/icons/trash.svg"
                  alt="delete"
                />
              </div>
              <div className="cart__left-image">
                <Image
                  width={100}
                  height={100}
                  src={item.imageUrl}
                  alt={item.name}
                  className="cart__left-img"
                />
              </div>
              <div className="cart__left-info">
                <h6 className="cart__info-title">{item.name}</h6>
                <p className="cart__info-description">
                  {[
                    item.size?.name.toUpperCase(),
                    ...(item.additives?.map((a) => a) ?? []),
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            </div>

            <div className="cart__items-right">
              {item.discountedTotal &&
              item.discountedTotal < (item.actualTotal ?? 0) ? (
                <>
                  <p className="cart__price old-price">
                    ${item.actualTotal?.toFixed(2)}
                  </p>
                  <p className="cart__price new-price">
                    ${item.discountedTotal?.toFixed(2)}
                  </p>
                </>
              ) : (
                <p className="cart__price">
                  ${(item.actualTotal ?? item.totalPrice ?? 0).toFixed(2)}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
