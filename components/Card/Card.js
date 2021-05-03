import Link from "next/link";

function Card({text, img, link, linkText= 'Shop now'}) {
    return (
      <div className="col p-3">
        <div className="bg-white h-100 p-4">
          <h4 className="mb-3">{text}</h4>
          <div className="mb-3" style={{ overflow: "hidden" }}>
            <Link href={link}>
              <a>
                <img
                  src={`img/categories/${img}.jpg`}
                  alt="beauty"
                  style={{ width: "100%", height: "280px", objectFit: "cover" }}
                />
              </a>
            </Link>
          </div>
          <Link href={link}>
            <a>
              <h5>{linkText}</h5>
            </a>
          </Link>
        </div>
      </div>
    );
}

export default Card
