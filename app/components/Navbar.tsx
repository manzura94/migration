"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <header className={"header"}>
      <div className={"header__container"}>
        <Link href="/" className={"header__logo"}>
          <Image
            src="/images/logo.png"
            alt="header logo"
            width={90}
            height={60}
          />
        </Link>

        <nav className={`${"header__menu"} ${menuOpen ? "showMenu" : ""}`}>
          <ul className={"header__menu-items"}>
            <li className={"header__menu-item"}>
              <Link href="#favourite">Favorite coffee</Link>
            </li>
            <li className={"header__menu-item"}>
              <Link href="#about">About</Link>
            </li>
            <li className={"header__menu-item"}>
              <Link href="#mobile-app">Mobile app</Link>
            </li>
            <li className={"header__menu-item"}>
              <Link href="#contacts">Contact us</Link>
            </li>
          </ul>

          <div className={"burger__menu"}>
            <Link href="/menu" className={"menupath__link"}>
              Menu
            </Link>
            <Image
              src="/images/icons/coffee-cup.svg"
              alt="coffee cup"
              width={20}
              height={20}
              className={"menupath__icon"}
            />
          </div>
        </nav>

        <div className={"header__icons"}>
          <div className="header__shopping-cart">
            <Link href="/cart" className={"cartpath__link"}>
              <Image
                src="/images/icons/shopping-bag.svg"
                alt="shopping bag"
                width={23}
                height={23}
              />
            </Link>
            <span className={"cart-items"}>2</span>
          </div>

          <div className={"menupath"}>
            <Link href="/menu" className={"menupath__link"}>
              Menu
            </Link>
            <Image
              src="/images/icons/coffee-cup.svg"
              alt="coffee cup"
              width={20}
              height={20}
              className={"menupath__icon"}
            />
          </div>
        </div>

        <button className={"header__burger-button"} onClick={toggleMenu}>
          <span className={`${menuOpen ? "active-menu" : ""}`}></span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;