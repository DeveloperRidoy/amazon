import Link from 'next/link';
import styles from './Slider2.module.scss';
import {BsChevronRight, BsChevronLeft} from 'react-icons/bs'
import { useRef } from 'react';
import { useRouter } from 'next/router';

function Slider2 ({ title = "title", centerText, linkButton, link="/shop", linkText = "See more", images }) {
  const Router = useRouter();
  const imagesContainerRef = useRef(null);

  const scrollHorizontal = (ref, direction) => {
    ref.current.scrollLeft += direction === 'right'
    ? - ref.current.offsetWidth
    : + ref.current.offsetWidth
  }
  return (
    <div className={`bg-white p-3 my-4  ${styles.slider}`}>
   
      <div
        className="mb-4"
        style={
          {
            display: centerText ? 'flex': 'block',
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
            padding: centerText ? "25px 0 0 0": 0,
          }
        }
      >
        <h2 className="d-inline text-dark">{title}</h2>
        <Link href={link || Router.asPath}>
          <a
            className="ml-3 text-dark rounded"
            style={
              {background: linkButton ? "#ffcf86": 'none',
              textDecoration: linkButton ? 'none': 'inherit',
              padding: linkButton ? "5px": 0}
            }
          >
            <h5 className="d-inline">{linkText}</h5>
          </a>
        </Link>
      </div>
      <div className={styles.imagesContainer} ref={imagesContainerRef}>
        {images &&
          images.length > 0 &&
          images.map((img, i) => (
            <Link href={img.link || "/shop"} key={i}>
              <a>
                <img src={img.src} alt={img.alt || `image ${i + 1}`} />
              </a>
            </Link>
          ))}
      </div>
      <div
        className={styles.controlLeft}
        onClick={() => scrollHorizontal(imagesContainerRef, "right")}
      >
        <BsChevronLeft />
      </div>
      <div
        className={styles.controlRight}
        onClick={() => scrollHorizontal(imagesContainerRef)}
      >
        <BsChevronRight />
      </div>
    </div>
  );
}

export default Slider2
