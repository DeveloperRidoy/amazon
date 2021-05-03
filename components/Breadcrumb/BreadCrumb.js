import Link from "next/link";
import { useRouter } from 'next/router';

function BreadCrumb () {
    const router = useRouter();
    console.log(router.route, router.query);
    const routes = router.route.split("/").slice(1);
  return (
    <div>
      <ol className="breadcrumb font-weight-bold">
        {routes.map((route, i) => (
          <li
            className={`breadcrumb-item ${
              i === routes.length - 1 ? "active" : ""
            }`}
            key={i}
          >
            {i === routes.length - 1 ? (
              route.replaceAll('-', ' ').replaceAll('and', '&')
            ) : (
              <Link href={`${i === 0 ? "/" : ""}${route}`}>
                <a style={{ color: "#007bff" }}>{route.replaceAll('-', ' ').replaceAll('and', '&')}</a>
              </Link>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default BreadCrumb;
