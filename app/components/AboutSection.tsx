import Image from "next/image";

export default function AboutSection() {
  return (
    <section id="about" className="gallery gallery__container">
      <h2 className="gallery__title">
        Resource is <i> the perfect and cozy place</i> where you can enjoy a
        variety of hot beverages, relax, catch up with friends, or get some work
        done.
      </h2>

      <div className="gallery__collection">
        <div className="gallery__image image-1">
          <Image
            src="/images/about-1.jpg"
            alt="about-1"
            fill={false}
            width={500}
            height={500}
            className="gallery__item"
          />
        </div>

        <div className="gallery__image image-2">
          <Image
            src="/images/about-2.jpg"
            alt="about-2"
            width={500}
            height={500}
            className="gallery__item"
          />
        </div>

        <div className="gallery__image image-3">
          <Image
            src="/images/about-3.jpg"
            alt="about-3"
            width={500}
            height={500}
            className="gallery__item"
          />
        </div>

        <div className="gallery__image image-4">
          <Image
            src="/images/about-4.jpg"
            alt="about-4"
            width={500}
            height={500}
            className="gallery__item"
          />
        </div>
      </div>
    </section>
  );
}
