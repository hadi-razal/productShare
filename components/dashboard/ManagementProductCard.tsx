import Image from "next/image";
import Link from "next/link";
import { Package, Pencil } from "lucide-react";
import { categoryLabel } from "@/lib/product-categories";
import type { ProductType } from "@/type";

export default function ManagementProductCard({ product, href, price, selected, onSelect }: {
  product: Partial<ProductType> & { id: string };
  href: string;
  price: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <article className="ps-product-card">
      <div className="ps-product-image">
        {product.images?.[0] ? (
          <Image src={product.images[0]} alt={product.name || "Product"} fill sizes="(max-width: 600px) 90vw, 300px" unoptimized />
        ) : <Package size={40} />}
        <label>
          <input type="checkbox" checked={selected} onChange={onSelect} aria-label={`Select ${product.name || "product"}`} />
        </label>
      </div>
      <div className="ps-product-info">
        <span className={`ds-status-pill ${product.isHidden ? "hidden" : "active"}`}>
          {product.isHidden ? "Hidden" : "Active"}
        </span>
        <Link href={href}><h2>{product.name || "Untitled product"}</h2></Link>
        <p>{categoryLabel(product.category || "") || "Uncategorized"}</p>
        <div><strong>{price}</strong><span>{Number(product.views || 0).toLocaleString("en-IN")} views</span></div>
        <Link className="ps-product-edit" href={href}><Pencil size={14} /> Edit product</Link>
      </div>
    </article>
  );
}
