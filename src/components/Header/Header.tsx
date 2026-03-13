"use client";
import css from "./Header.module.css";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className={css.header}>
      <Link href="/" aria-label="Home">
        <Image src="/Logo.svg" alt="Rental Car Logo" width={104} height={16} />
      </Link>
      <nav aria-label="Navigation">
        <ul className={css.navigation}>
          <li className={css.navigationItem}>
            <Link
              href="/"
              className={`${css.navigationLink} ${pathname === "/" ? css.active : ""}`}
            >
              Home
            </Link>
          </li>
          <li className={css.navigationItem}>
            <Link
              href="/catalog"
              className={`${css.navigationLink} ${pathname === "/catalog" ? css.active : ""}`}
            >
              Catalog
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
