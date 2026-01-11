import { resolvePrice } from "../utils/priceResolver";

type Props = {
  product: any;
  locale?: string;
  currency?: string;
};

export default function ProductPrice({ product, locale, currency }: Props) {
  const price = resolvePrice(product, { locale, currency });

  return <span>{price.formatted ?? "—"}</span>;
}
