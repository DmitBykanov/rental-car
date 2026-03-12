import css from "./Header.module.css";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className={css.header}>
      <Link href="/" aria-label="Home" className={css.logo}>
        <Image
          src="/Logo.svg"
          alt="Rental Car Logo"
          width={104}
          height={16}
          className={css.logo}
        />
      </Link>
      <nav aria-label="Navigation">
        <ul className={css.navigation}>
          <li className={css.navigationItem}>
            <Link href="/" className={css.navigationLink}>
              Home
            </Link>
          </li>
          <li className={css.navigationItem}>
            <Link href="/catalog" className={css.navigationLink}>
              Catalog
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
