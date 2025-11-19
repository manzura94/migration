"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  BackendProduct,
  MenuProduct,
  MergedProduct,
} from "../types/product.inteface";
import { useAuth } from "../context/AuthContext";
import { CartItems } from "../types/cart.interface";

interface ProductModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedProduct: number | null;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function ProductModal({
  open,
  setOpen,
  selectedProduct,
}: ProductModalProps) {
  const [data, setData] = useState<MergedProduct | null>(null);
  const [activeSize, setActiveSize] = useState("s");
  const [selectedAdditives, setSelectedAdditives] = useState<string[]>([]);
  const [error, setError] = useState(false);
  const { isLoggedIn } = useAuth();

  const handleCloseModal = () => {
    setOpen(false);
    setData(null);
    setError(false);
    setSelectedAdditives([]);
    setActiveSize("s");
  };

  const handleSizeButtonClick = (item: string) => {
    setActiveSize(item);
    setSelectedAdditives([]);
  };

  const handleAdditiveButtonClick = (name: string) => {
    setSelectedAdditives((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name],
    );
  };

  const totalDiscountPrice = (() => {
    if (!data) return 0;
    const basePrice =
      isLoggedIn && data.sizes[activeSize].discountPrice
        ? parseFloat(data.sizes[activeSize].discountPrice)
        : parseFloat(data.sizes[activeSize].price);
    const additivesPrice = selectedAdditives.reduce((sum, additiveName) => {
      const additive = data.additives.find((a) => a.name === additiveName);
      const discountAdd = additive?.discountPrice ?? additive?.price;
      return additive ? sum + parseFloat(discountAdd!) : sum;
    }, 0);

    return basePrice + additivesPrice;
  })();

  const totalPrice = (() => {
    if (!data) return 0;
    const basePrice = parseFloat(data.sizes[activeSize].price);
    const additivesPrice = selectedAdditives.reduce((sum, additiveName) => {
      const additive = data.additives.find((a) => a.name === additiveName);
      return additive ? sum + parseFloat(additive.price) : sum;
    }, 0);

    return basePrice + additivesPrice;
  })();

  const handleAddToCart = (item: MergedProduct) => {
    const newItem = {
      cartId: crypto.randomUUID(),
      id: item.id,
      name: item.name,
      imageUrl: item.imageUrl,
      size: { name: activeSize, price: item.sizes[activeSize].price },
      additives: selectedAdditives,
      totalPrice: totalDiscountPrice ?? totalPrice,
      quantity: 1,
      isDiscounted: isLoggedIn,

      actualTotal: totalPrice,
      discountedTotal: totalDiscountPrice,
    };

    const cartItems = localStorage.getItem("cart");
    const cart = cartItems ? JSON.parse(cartItems) : [];

    const existingIndex = cart.findIndex(
      (item: CartItems) =>
        item.id === newItem.id &&
        item.size.name === newItem.size.name &&
        JSON.stringify(item.additives) === JSON.stringify(newItem.additives),
    );

    if (existingIndex !== -1) {
      const updatedItem = { ...cart[existingIndex] };
      updatedItem.quantity = cart[existingIndex].quantity + 1;
      updatedItem.totalPrice = Number(
        (cart[existingIndex].totalPrice + newItem.totalPrice).toFixed(2),
      );
      const newCart = [...cart];
      newCart[existingIndex] = updatedItem;

      localStorage.setItem("cart", JSON.stringify(newCart));
    } else {
      const items = [...cart, newItem];
      localStorage.setItem("cart", JSON.stringify(items));
    }

    setOpen(false);
    setSelectedAdditives([]);
    setActiveSize("s");
  };

  useEffect(() => {
    if (!open || !selectedProduct) return;

    async function getProductById(id: number) {
      try {
        const [backendRes, menuRes] = await Promise.all([
          fetch(`${BASE_URL}/products/${id}`),
          fetch("/data/menu.json"),
        ]);

        if (!backendRes.ok || !menuRes.ok) {
          setError(true);
        }

        const backendJson = await backendRes.json();
        const backendData: BackendProduct = backendJson.data;
        const menuData: MenuProduct[] = await menuRes.json();

        const menuProduct = menuData.find((item) => item.id === backendData.id);

        const mergedProduct: MergedProduct = {
          ...backendData,
          imageUrl: menuProduct?.image ?? null,
        };

        setData(mergedProduct);
        setError(false);
      } catch (error) {
        console.log(error);
        setError(true);
      }
    }
    getProductById(selectedProduct);
  }, [open, selectedProduct]);

  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={() => setOpen(false)}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {error ? (
          <div className="modal__wrapper">
            <p className="modal__error">Oops! Something went wrong.</p>
            <div
              className="modal__wrapper__closebtn"
              onClick={handleCloseModal}
            >
              <Image
                alt="close-button"
                width={50}
                height={50}
                src={"/images/icons/button-close.svg"}
                className="closebtn-image"
              />
            </div>
          </div>
        ) : data ? (
          <div className="modal__wrapper">
            <div className="modal__image">
              <div className="modal__image-wrap">
                <Image
                  alt="product-image"
                  src={`${data?.imageUrl ?? "/images/tea-2.jpg"}`}
                  className="modal-image"
                  width={400}
                  height={400}
                />
              </div>
            </div>
            <div className="modal__info">
              <div className="modal__textwrap">
                <h4 className="modal__title">{data?.name}</h4>
                <p className="modal__text">{data?.description}</p>
                <div className="modal__buttonwrap">
                  <p className="modal__subtitle">Sizes</p>
                  <div className="menu__buttons">
                    {Object.entries(data.sizes).map(([key, button]) => (
                      <button
                        key={key}
                        className={`menu-button size-button ${activeSize === key ? "active" : ""}`}
                        onClick={() => handleSizeButtonClick(key)}
                      >
                        <span className="menu__buttons-icon">{key}</span>
                        <span className="menu__buttons-text">
                          {button.size}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="modal__buttonwrap">
                  <p className="modal__subtitle">Additives</p>
                  <div className="menu__buttons">
                    {Object.values(data.additives).map((button, index) => (
                      <button
                        key={button.name}
                        className={`menu-button additives ${selectedAdditives.includes(button.name) ? "active" : ""}`}
                        onClick={() => handleAdditiveButtonClick(button.name)}
                      >
                        <span className="menu__buttons-icon">{index + 1}</span>
                        <span className="menu__buttons-text">
                          {button.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="modal__price">
                  <h4 className="modal__price-title">Total:</h4>
                  <h4 className="modal__price-num">
                    {isLoggedIn &&
                    totalDiscountPrice &&
                    totalDiscountPrice != totalPrice ? (
                      <>
                        <span className="modal__price-discount">
                          ${totalDiscountPrice.toFixed(2)}
                        </span>
                        <span className="modal__price-old">
                          ${totalPrice.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="modal__price-price">
                        ${totalPrice.toFixed(2)}
                      </span>
                    )}
                  </h4>
                </div>
              </div>
              <button
                className="modal__closebtn"
                onClick={() => handleAddToCart(data)}
              >
                Add to cart
              </button>
            </div>
            <div
              className="modal__wrapper__closebtn"
              onClick={handleCloseModal}
            >
              <Image
                alt="close-button"
                width={50}
                height={50}
                src={"/images/icons/button-close.svg"}
                className="closebtn-image"
              />
            </div>
          </div>
        ) : (
          <div className="loader"></div>
        )}
      </div>
    </div>
  );
}
