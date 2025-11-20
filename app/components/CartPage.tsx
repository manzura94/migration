"use client";

import { useEffect, useState } from "react";
import { UserInfo } from "../types/auth.interface";
import { CartItem } from "../types/cart.interface";
import CartItemPage from "./CartItem";
import { useCart } from "../context/CartContext";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
    const { updateCart } = useCart();
  

  useEffect(() => {
  if (notification) {
    const timer = setTimeout(() => setNotification(null), 4000);
    return () => clearTimeout(timer);
  }
}, [notification]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    setCart(storedCart ? JSON.parse(storedCart) : []);
    setUserInfo(storedUser ? JSON.parse(storedUser) : null);
    setToken(storedToken);
  }, []);

  const isLoggedIn = !!token;
 

  const totalActual = cart.reduce(
    (acc, item) => acc + Number(item.actualTotal ?? item.totalPrice ?? 0),
    0,
  );
  const totalDiscounted = cart.reduce(
    (acc, item) => acc + Number(item.discountedTotal ?? item.totalPrice ?? 0),
    0,
  );

  const handleConfirmOrder = async () => {
    if (!isLoggedIn || cart.length === 0) return;

    setLoading(true);

    const items = cart.map((item) => ({
      productId: item.id,
      size: item.size?.name ?? "",
      additives: item.additives?.map((a) => a.name) ?? [],
      quantity: item.quantity ?? 1,
    }));

    const body = {
      items,
      totalPrice: Number(totalDiscounted.toFixed(2)),
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await fetch(`${BASE_URL}/orders/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error("Order failed");

      localStorage.removeItem("cart");
      setCart([]);
    
      setNotification({
        message:
          "Thank you for your order! Our manager will contact you shortly.",
        type: "success",
      });
    } catch {
      setNotification({
        message: "Something went wrong. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
      updateCart();
  };

  const handleAuthRedirect = (path: string) => {
    window.location.href = `/${path}`;
  };

  return (
    <main className="cart cart__container">
      <h1 className="cart__title">Cart</h1>

      {notification && (
        <div   className={`notification ${notification.type} ${
    notification ? "show" : ""
  }`}>
          {notification.message}
        </div>
      )}

      <div className="cart__wrapper">
        {cart.length === 0 ? (
          <p className="cart-empty">Your cart is empty.</p>
        ) : (
          <div className="cart__wrap">
            <CartItemPage cart={cart} setCart={setCart} />
          </div>
        )}
        <div className="cart__info-wrap">
          <div className="totalprice-wrap">
            <p className="totalprice-title">Total:</p>

            {totalDiscounted < totalActual ? (
              <div className="totalprice">
                <span className="old-price">${totalActual.toFixed(2)}</span>
                <span className="new-price">${totalDiscounted.toFixed(2)}</span>
              </div>
            ) : (
              <p className="totalprice">${totalActual.toFixed(2)}</p>
            )}
          </div>

          {isLoggedIn && userInfo && (
            <>
              <div className="address-cont">
                <p className="address-text">Address:</p>
                <p className="address-info">
                  {[userInfo.city, userInfo.street, userInfo.houseNumber]
                    .filter(Boolean)
                    .join(" ")}
                </p>
              </div>

              <div className="payment-wrap">
                <p className="address-text">Pay by:</p>
                <p className="address-info">{userInfo.paymentMethod ?? "—"}</p>
              </div>
            </>
          )}

          <div className="cart__buttons-wrap">
            {cart.length > 0 && (
              <>
                {isLoggedIn ? (
                  <button
                    className="confirm confirm-btn"
                    onClick={handleConfirmOrder}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Confirm"}
                  </button>
                ) : (
                  <>
                    <button
                      className="registerbtn confirm-btn"
                      onClick={() => handleAuthRedirect("register")}
                    >
                      Register
                    </button>
                    <button
                      className="signin confirm-btn"
                      onClick={() => handleAuthRedirect("login")}
                    >
                      Sign In
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
