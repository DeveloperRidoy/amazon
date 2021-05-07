import styles from './Card2.module.scss';
import Link from 'next/link';
import { useRouter } from 'next/router';

function Card2 ({ link, title, text, img, style }) {
  const Router = useRouter();
    return (
      <div className="col px-3 mb-3" style={style}>
        <Link href={link || Router.asPath}>
          <a className={styles.card}>
            <div className="col">
              <img
                src={img && img.src || ''}
                alt={img && img.alt || 'amazon'}
                className="img-fluid rounded-circle"
              />
            </div>
            <div className="col-8 d-flex flex-column justify-content-center p-0">
              <h4>{title}</h4>
              <p className="mb-0" style={{ fontSize: "14px" }}>
                {text}
              </p>
            </div>
          </a>
        </Link>
      </div>
    );
}

export default Card2
