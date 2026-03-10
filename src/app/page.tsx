import css from "./page.module.css";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className={css.heroContainer}>
      <Image
        className={css.mainImg}
        src="/Hero-image.jpg"
        alt="Hero image"
        fill
        priority
      />

      <div className={css.content}>
        <h1 className={css.title}>Find your perfect rental car</h1>
        <h2 className={css.subtitle}>
          Reliable and budget-friendly rentals for any journey
        </h2>
        <Link className={css.mainBtn} href="/catalog">
          View catalog
        </Link>
      </div>
    </div>
  );
}
