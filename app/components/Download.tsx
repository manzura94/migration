import Image from "next/image";
import IconsItemOne from "./icons/IconsItemOne";
import IconsItemTwo from "./icons/IconsItemTwo";

const Download = () => {
  return (
    <section id="mobile-app" className="download download__container">
      <div className="download__info">
        <h2 className="download__info__title">
          <i>Download </i>
          our apps to start ordering
        </h2>
        <p className="download__info-desc">
          Download the Resource app today and experience the comfort of ordering
          your favorite coffee from wherever you are
        </p>
        <div className="download__info-icons icons">
          <IconsItemOne />
          <IconsItemTwo />
        </div>
      </div>
      <div className="download__banner">
        <Image
          width={500}
          height={500}
          src="/images/mobile-screens.png"
          alt="mobile-screens"
          className="download__banner-img"
        />
      </div>
    </section>
  );
};

export default Download;
