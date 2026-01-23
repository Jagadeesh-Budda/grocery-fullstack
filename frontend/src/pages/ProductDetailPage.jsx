import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import axios from "axios";

const ProductDetailPage = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const { addItem } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ---------- helpers ----------
  const getVariantId = (v) => v?.id ?? v?.variantId;

  // ---------- fetch product ----------
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/products/${productId}`);
        setProduct(res.data);
        setSelectedVariant(null); // 🔒 explicit user selection required
        setQuantity(1);
      } catch (err) {
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // ---------- handlers ----------
  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    setQuantity(1);
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) return;

    const variantId = getVariantId(selectedVariant);

    try {
      await addItem(
        {
          variantId,
          productName: product.name,
          variantName: selectedVariant.variantName,
          price: selectedVariant.price,
          imageUrl:
            selectedVariant.imageUrl ||
            product.imageUrl ||
            "https://via.placeholder.com/400x300?text=No+Image",
        },
        quantity
      );
    } catch (err) {
      console.error("Add to cart failed", err);
    }
  };

  // ---------- UI states ----------
  if (loading) {
    return <div className="p-6 text-center">Loading product…</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  if (!product) return null;

  // ---------- render ----------
  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-blue-600 mr-3"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-semibold">{product.name}</h1>
      </div>

      {/* Main */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image */}
        <img
          src={product.imageUrl || "https://via.placeholder.com/400x300"}
          alt={product.name}
          className="w-full rounded-lg object-cover"
        />

        {/* Details */}
        <div>
          <p className="text-gray-600 mb-4">{product.description}</p>

          {/* Price */}
          {selectedVariant ? (
            <p className="text-3xl font-bold text-emerald-600 mb-4">
              ₹{selectedVariant.price}
            </p>
          ) : (
            <p className="text-gray-500 mb-4">
              Select a size to see price
            </p>
          )}

          {/* Variants */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Available Sizes</h3>
            <div className="flex flex-wrap gap-2">
              {product.variants?.map((variant) => {
                const isSelected =
                  selectedVariant &&
                  getVariantId(selectedVariant) === getVariantId(variant);

                return (
                  <button
                    key={getVariantId(variant)}
                    onClick={() => handleVariantSelect(variant)}
                    className={`px-4 py-2 rounded border text-sm ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    {variant.variantName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="font-medium">Quantity</span>
            <div className="flex items-center border rounded">
              <button
                className="px-3 py-1"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span className="px-4">{quantity}</span>
              <button
                className="px-3 py-1"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            disabled={!selectedVariant}
            onClick={handleAddToCart}
            className={`w-full py-3 rounded text-white font-medium ${
              selectedVariant
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Nutrition (optional / safe) */}
      {product.nutrients && (
        <div className="mt-8">
          <h3 className="font-semibold mb-2">Nutritional Information</h3>
          <ul className="text-sm text-gray-600 list-disc pl-5">
            {Object.entries(product.nutrients).map(([key, value]) => (
              <li key={key}>
                {key}: {value}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
