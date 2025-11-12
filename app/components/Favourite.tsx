"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";

interface Coffee {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

const placeholders = [
  "/images/coffee-slider-1.png",
  "/images/coffee-slider-2.png",
  "/images/coffee-slider-3.png",
];

const Favorite = () => {
  const [coffees, setCoffees] = useState<Coffee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoffees = async () => {
      try {
        const res = await fetch(
          "https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/products/favorites",
        );
        if (!res.ok) throw new Error("Error fetching coffees");

        const data = await res.json();
        const mapped = data.data.map((item: Coffee, i: number) => ({
          ...item,
          imageUrl: placeholders[i % placeholders.length],
        }));
        setCoffees(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCoffees();
  }, []);

  if (loading) {
    return (
      <section id="favourite" className="favourite favourite__container">
        <h2 className="favourite__title">
          Choose your <i>favourite</i> coffee
        </h2>
        <div className="loader"></div>
      </section>
    );
  }

  return (
    <section id="favourite" className="favourite favourite__container">
      <h2 className="favourite__title">
        Choose your <i>favourite</i> coffee
      </h2>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        // autoplay={{ delay: 6000, disableOnInteraction: false }}
        // loop
        className="favourite__slider"
      >
        {coffees.map((coffee) => (
          <SwiperSlide key={coffee.id} className="fade">
            <div className="fade__image">
              <Image
                src={coffee.imageUrl}
                alt={coffee.name}
                width={450}
                height={450}
                priority
              />
            </div>
            <h3 className="fade__title">{coffee.name}</h3>
            <p className="fade__desc">{coffee.description}</p>
            <span className="fade__price">${coffee.price}</span>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Favorite;
