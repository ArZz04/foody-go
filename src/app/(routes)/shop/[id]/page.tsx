"use client";

import { ArrowLeft, ChevronLeft, ChevronRight, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
<<<<<<< Updated upstream
<<<<<<< Updated upstream
import { useEffect, useState, useMemo, useCallback } from "react";
=======
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
>>>>>>> Stashed changes
=======
import { useCallback, useEffect, useMemo, useState } from "react";
import AddressRequiredDialog, {
  type SavedAddress,
} from "@/components/address/AddressRequiredDialog";
import { SupportChatWidget } from "@/components/support/SupportChatWidget";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";

const CART_STORAGE_KEY = "gogi:cart";
const CART_UPDATED_EVENT = "gogi-cart-updated";
>>>>>>> Stashed changes

type Business = {
  id: number | string;
  name: string;
  avatar_url?: string | null;
  city?: string;
  district?: string;
  address?: string;
  category?: string;
  category_name?: string;
  slogan?: string;
  description_long?: string;
  estimated_delivery_minutes?: number;
  is_open_now?: boolean;
};

type Product = {
  id: number;
  business_id: number;
  sku: string;
  barcode: string | null;
  name: string;
  description_long: string | null;
  description_short: string | null;
  product_category_id: number;
  product_subcategory_id: number | null;
  price: number;
  discount_price: number | null;
  currency: string;
  sale_format: string | null;
  price_per_unit: number | null;
  tax_included: boolean;
  tax_rate: number | null;
  commission_rate: number | null;
  is_stock_available: boolean;
  max_per_order: number | null;
  min_per_order: number | null;
  promotion_id: number | null;
  image_url: string | null;
  thumbnail_url: string | null;
  stock_average: number;
  stock_danger: number;
  created_at: string | Date;
  updated_at: string | Date;
  expires_at: string | Date | null;
  status_id: number;

  // Campos opcionales que pueden venir del JOIN
  category_name?: string;
  business_name?: string;
  category_id?: number;
};

type StoredCartItem = {
  id: string;
  productId?: number;
  nombre: string;
  negocio: string;
  ciudad?: string;
  image: string;
  extras: string[];
  tags?: string[];
  quantity: number;
  unitPrice?: number;
  price?: number;
  notes?: string;
  customizations?: {
    selectedOptions: SelectedOptionPayload[];
    extrasTotal: number;
    totalPrice: number;
  };
};

type CustomizationOption = {
  id: string;
  name: string;
  extraPrice: number;
  isDefault?: boolean;
};

type CustomizationGroup = {
  id: string;
  name: string;
  maxSelections: number | null;
  minSelections?: number;
  isRequired?: boolean;
  source?: string;
  options: CustomizationOption[];
};

type SelectedOptionPayload = {
  groupId: string;
  groupName: string;
  optionId: string;
  optionName: string;
  extraPrice: number;
};

function getUniqueProducts(products: Product[]) {
  const uniqueProducts = new Map<number, Product>();

  products.forEach((product) => {
    if (!uniqueProducts.has(product.id)) {
      uniqueProducts.set(product.id, product);
    }
  });

  return Array.from(uniqueProducts.values());
}

function getProductImageSrc(
  imageUrl: string | null | undefined,
  thumbnailUrl?: string | null,
) {
  const rawValue = imageUrl ?? thumbnailUrl ?? null;

  if (!rawValue) {
    return "/items/thumbnails/generic-item.png";
  }

  const normalizedUrl = rawValue.trim();

  if (!normalizedUrl) {
    return "/items/thumbnails/generic-item.png";
  }

  if (normalizedUrl.startsWith("/public/")) {
    return normalizedUrl.replace(/^\/public/, "");
  }

  return normalizedUrl;
}

function isExternalImageSrc(src: string) {
  return /^https?:\/\//i.test(src);
}

function getCookieValue(name: string) {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(
    new RegExp(
      `(?:^|; )${name.replace(/[$()*+.?[\\\]^{|}]/g, "\\$&")}=([^;]*)`,
    ),
  );

  return match ? decodeURIComponent(match[1]) : null;
}

function getStoredSession() {
  if (typeof window === "undefined") {
    return {
      token: null as string | null,
      user: null as { id?: number } | null,
    };
  }

  const localToken = window.localStorage.getItem("token");
  const cookieToken = getCookieValue("authToken");
  const rawUser =
    window.localStorage.getItem("user") ??
    window.sessionStorage.getItem("user");

  let parsedUser: { id?: number } | null = null;

  if (rawUser) {
    try {
      parsedUser = JSON.parse(rawUser) as { id?: number };
    } catch (error) {
      console.error("No se pudo leer la sesión guardada", error);
    }
  }

  return {
    token: localToken || cookieToken,
    user: parsedUser,
  };
}

function buildDefaultSelections(groups: CustomizationGroup[]) {
  return groups.reduce<Record<string, string[]>>((acc, group) => {
    const defaultOptions = group.options
      .filter((option) => option.isDefault)
      .map((option) => option.id);

    acc[group.id] = defaultOptions;
    return acc;
  }, {});
}

function formatCustomizationSummary(
  selectedOptions: SelectedOptionPayload[],
  notes: string,
) {
  const enabledOptions = selectedOptions.map((option) =>
    option.extraPrice > 0
      ? `${option.groupName}: ${option.optionName} +$${option.extraPrice.toFixed(2)}`
      : `${option.groupName}: ${option.optionName}`,
  );

  if (notes.trim()) {
    enabledOptions.push(`Notas: ${notes.trim()}`);
  }

  return enabledOptions;
}

function buildCartItemKey(
  productId: number,
  selectedOptions: SelectedOptionPayload[],
  notes: string,
) {
  const normalizedOptions = [...selectedOptions]
    .map((option) => ({
      groupId: option.groupId,
      optionId: option.optionId,
    }))
    .sort((a, b) =>
      `${a.groupId}:${a.optionId}`.localeCompare(`${b.groupId}:${b.optionId}`),
    );

  return JSON.stringify({
    productId,
    selectedOptions: normalizedOptions,
    notes: notes.trim(),
  });
}

function hasOfferPrice(product: Product) {
  return (
    product.discount_price !== null &&
    product.discount_price !== undefined &&
    Number.isFinite(product.discount_price) &&
    product.discount_price > 0 &&
    product.discount_price < product.price
  );
}

// Número de productos por página
const ITEMS_PER_PAGE = 12;

export default function BusinessDetailPage() {
  const { user } = useAuth();
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
  const params = useParams<{ id: string }>();
  const businessId = Number(params?.id ?? NaN);
  const [business, setBusiness] = useState<Business | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmed, setConfirmed] = useState<Record<number, boolean>>({});
<<<<<<< Updated upstream
  const [cartId, setCartId] = useState<number | null>(null);



=======
  const [mainPhotoPreview, setMainPhotoPreview] = useState<string | null>(null);
  const [cartMessage, setCartMessage] = useState<string | null>(null);
  const [cartError, setCartError] = useState<string | null>(null);
  const [addingProductId, setAddingProductId] = useState<number | null>(null);
  const [customizeModalOpen, setCustomizeModalOpen] = useState(false);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [savedAddress, setSavedAddress] = useState<SavedAddress | null>(
    user?.address ?? null,
  );
  const [customizationNotes, setCustomizationNotes] = useState("");
  const [modalQuantity, setModalQuantity] = useState(1);
  const [customizationGroups, setCustomizationGroups] = useState<
    CustomizationGroup[]
  >([]);
  const [selectedOptionsByGroup, setSelectedOptionsByGroup] = useState<
    Record<string, string[]>
  >({});
  const [loadingCustomizations, setLoadingCustomizations] = useState(false);
>>>>>>> Stashed changes
  const addToCart = (productId: number) => {
    setCartMessage(null);
    setCartError(null);
    setQuantities((prev) => ({
      ...prev,
      [productId]: prev[productId] ? prev[productId] + 1 : 1,
    }));
  };

  const decrement = (productId: number) => {
    setCartMessage(null);
    setCartError(null);
    setQuantities((prev) => {
      const current = prev[productId] || 1;
      if (current <= 1) return prev;
      return { ...prev, [productId]: current - 1 };
    });
  };

  const increment = (productId: number) => {
    setCartMessage(null);
    setCartError(null);
    setQuantities((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 1) + 1,
    }));
  };

<<<<<<< Updated upstream
  const confirmQuantity = async (productId: number) => {
  const qty = quantities[productId] ?? 1;

  await sendToCart(productId, qty);

  setConfirmed(prev => ({ ...prev, [productId]: true }));

  // Reinicia después de 1.5s
  setTimeout(() => {
    setConfirmed(prev => ({ ...prev, [productId]: false }));
  }, 1500);
};

useEffect(() => {
  if (!user) return;

  async function loadCart() {
    try {
      if (!user) return;

      const uid = user.id;
      // Obtener carrito existente
      const res = await fetch(`/api/cart?user_id=${uid}`);
      const data = await res.json();

      if (data.cart) {
        setCartId(data.cart.id);
      } else {
        // Crear carrito si no existe
        const createRes = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: uid })
        });

        const newCart = await createRes.json();
        setCartId(newCart.cart_id);
      }
    } catch (err) {
      console.error("Error cargando carrito:", err);
    }
  }

  loadCart();
}, [user]);

const sendToCart = async (productId: number, quantity: number) => {
  if (!user || !cartId) {
    alert("Inicia sesión para agregar productos al carrito.");
    return;
  }

  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const priceToUse = product.discount_price ?? product.price;

  try {
    await fetch("/api/cart/add-product", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cart_id: cartId,
        product_id: productId,
        quantity,
        discount: 0, // lo puedes cambiar después
      }),
    });

  } catch (err) {
    console.error("Error agregando al carrito:", err);
  }
};
=======
  const selectedOptions = useMemo(() => {
    return customizationGroups.flatMap((group) =>
      (selectedOptionsByGroup[group.id] ?? [])
        .map((optionId) => {
          const option = group.options.find((item) => item.id === optionId);
          if (!option) return null;
>>>>>>> Stashed changes

          return {
            groupId: group.id,
            groupName: group.name,
            optionId: option.id,
            optionName: option.name,
            extraPrice: option.extraPrice,
          } satisfies SelectedOptionPayload;
        })
        .filter((value): value is SelectedOptionPayload => Boolean(value)),
    );
  }, [customizationGroups, selectedOptionsByGroup]);

  const extrasTotal = useMemo(
    () =>
      selectedOptions.reduce((total, option) => total + option.extraPrice, 0),
    [selectedOptions],
  );

  const baseUnitPrice =
    selectedProduct?.discount_price ?? selectedProduct?.price ?? 0;
  const finalUnitPrice = baseUnitPrice + extrasTotal;
  const totalPrice = finalUnitPrice * modalQuantity;

  const openCustomizationModal = async (product: Product) => {
    setSelectedProduct(product);
    setCustomizationNotes("");
    setCustomizationGroups([]);
    setSelectedOptionsByGroup({});
    setModalQuantity(quantities[product.id] || 1);
    setCustomizeModalOpen(true);
    setLoadingCustomizations(true);
    setCartMessage(null);
    setCartError(null);

    try {
      const response = await fetch(
        `/api/products/${product.id}/customizations`,
        {
          cache: "no-store",
        },
      );
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.error || "No pudimos cargar las opciones");
      }

      const groups = Array.isArray(data.groups)
        ? (data.groups as CustomizationGroup[])
        : [];

      setCustomizationGroups(groups);
      setSelectedOptionsByGroup(buildDefaultSelections(groups));
    } catch (error) {
      console.error(error);
      setCartError("No pudimos cargar las opciones del producto.");
    } finally {
      setLoadingCustomizations(false);
    }
  };

  const persistCartLocally = useCallback(
    (
      product: Product,
      quantity: number,
      notes: string,
      chosenOptions: SelectedOptionPayload[],
      unitPrice: number,
      optionExtrasTotal: number,
    ) => {
      if (typeof window === "undefined") return;

      const existingRawCart = window.localStorage.getItem(CART_STORAGE_KEY);
      const existingCart = existingRawCart
        ? (JSON.parse(existingRawCart) as StoredCartItem[])
        : [];
      const itemKey = buildCartItemKey(product.id, chosenOptions, notes);
      const nextItemTotal = unitPrice * quantity;

      const existingIndex = existingCart.findIndex(
        (item) => item.id === itemKey,
      );

      if (existingIndex >= 0) {
        const nextQuantity = existingCart[existingIndex].quantity + quantity;
        existingCart[existingIndex] = {
          ...existingCart[existingIndex],
          quantity: nextQuantity,
          unitPrice,
          price: unitPrice,
          notes,
          customizations: {
            selectedOptions: chosenOptions,
            extrasTotal: optionExtrasTotal,
            totalPrice: unitPrice * nextQuantity,
          },
          extras: formatCustomizationSummary(chosenOptions, notes),
        };
      } else {
        existingCart.push({
          id: itemKey,
          productId: product.id,
          nombre: product.name,
          negocio: business?.name ?? "Gogi Eats",
          ciudad: business?.city,
          image: getProductImageSrc(product.image_url, product.thumbnail_url),
          extras: formatCustomizationSummary(chosenOptions, notes),
          tags: product.category_name ? [product.category_name] : [],
          quantity,
          unitPrice,
          price: unitPrice,
          notes,
          customizations: {
            selectedOptions: chosenOptions,
            extrasTotal: optionExtrasTotal,
            totalPrice: nextItemTotal,
          },
        });
      }

      window.localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(existingCart),
      );
      window.dispatchEvent(new Event(CART_UPDATED_EVENT));
    },
    [business],
  );

  const handleAddToCart = async () => {
    if (!selectedProduct) return;

    const session = getStoredSession();
    const token = session.token;
    const storedUserId = session.user?.id;
    const activeUserId = user?.id ?? storedUserId;

    setCartMessage(null);
    setCartError(null);

    if (!activeUserId) {
      setCartError("Debes iniciar sesión para agregar productos.");
      return;
    }

    if (!savedAddress?.fullAddress) {
      setCartError(
        "Necesitas registrar tu dirección antes de agregar productos.",
      );
      setAddressDialogOpen(true);
      return;
    }

    try {
      setAddingProductId(selectedProduct.id);

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          user_id: activeUserId,
          product_id: selectedProduct.id,
          quantity: modalQuantity,
          notes: customizationNotes,
          selected_options: selectedOptions,
          unit_price: baseUnitPrice,
          extras_total: extrasTotal,
          total_price: totalPrice,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const message =
          data?.error || "No pudimos agregar el producto al carrito.";
        setCartError(message);
        console.error(message);
        return;
      }

      persistCartLocally(
        selectedProduct,
        modalQuantity,
        customizationNotes,
        selectedOptions,
        finalUnitPrice,
        extrasTotal,
      );
      setQuantities((prev) => ({
        ...prev,
        [selectedProduct.id]: modalQuantity,
      }));
      setConfirmed((prev) => ({ ...prev, [selectedProduct.id]: true }));
      setCartMessage("Producto agregado al carrito");
      setCustomizeModalOpen(false);
    } catch (error) {
      console.error(error);
      setCartError("No pudimos agregar el producto al carrito.");
    } finally {
      setAddingProductId(null);
    }
  };

  const loadSavedAddress = useCallback(async () => {
    const session = getStoredSession();

    if (!session.token) return;

    try {
      const response = await fetch("/api/account/address", {
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      setSavedAddress((data.address as SavedAddress | null) ?? null);
    } catch (error) {
      console.error("No se pudo cargar la dirección guardada", error);
    }
  }, []);

  const toggleGroupOption = (group: CustomizationGroup, optionId: string) => {
    setSelectedOptionsByGroup((prev) => {
      const currentSelection = prev[group.id] ?? [];
      const isSelected = currentSelection.includes(optionId);

      if (isSelected) {
        return {
          ...prev,
          [group.id]: currentSelection.filter((id) => id !== optionId),
        };
      }

      if (group.maxSelections === 1) {
        return {
          ...prev,
          [group.id]: [optionId],
        };
      }

      if (
        typeof group.maxSelections === "number" &&
        group.maxSelections > 0 &&
        currentSelection.length >= group.maxSelections
      ) {
        return prev;
      }

      return {
        ...prev,
        [group.id]: [...currentSelection, optionId],
      };
    });
  };

  // Extraer categorías únicas de los productos
  const categories = useMemo(() => {
    const unique = [
      { id: "all", name: "Todos los productos", count: products.length },
    ];

    const categoryMap = new Map<number, { name: string; count: number }>();

    products.forEach((product) => {
      const categoryId = product.product_category_id;
      const categoryName = product.category_name ?? "Sin categoría";

      if (!categoryMap.has(categoryId)) {
        categoryMap.set(categoryId, { name: categoryName, count: 1 });
      } else {
        const currentCategory = categoryMap.get(categoryId);
        if (currentCategory) {
          currentCategory.count += 1;
        }
      }
    });

    categoryMap.forEach((value, key) => {
      unique.push({
        id: key.toString(),
        name: value.name,
        count: value.count,
      });
    });

    return unique;
  }, [products]);

  // Filtrar productos por categoría y búsqueda
  const filteredProducts = useMemo(() => {
    let filtered = getUniqueProducts(products);

    // Filtrar por categoría
    if (activeCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.product_category_id.toString() === activeCategory,
      );
    }

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description_short?.toLowerCase().includes(query) ||
          product.category_name?.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [products, activeCategory, searchQuery]);

  // Calcular paginación
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return getUniqueProducts(filteredProducts).slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);

  const fetchBusinessData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/shop/business/${businessId}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("No pudimos cargar el negocio.");
      const data = await res.json();

      setBusiness(data.business ?? null);
      setProducts(data.products ?? []);
    } catch (error) {
      console.error("Error en shop page:", error);

      const stack = error instanceof Error ? error.stack : null;

      if (stack) console.error(stack);
      setError("No pudimos cargar el menú del negocio.");
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    if (Number.isNaN(businessId)) {
      setError("Negocio no válido.");
      setLoading(false);
      return;
    }

    setMainPhotoPreview(
      localStorage.getItem(`business-main-photo-${businessId}`),
    );
    fetchBusinessData();
  }, [businessId, fetchBusinessData]);

  useEffect(() => {
    setSavedAddress(user?.address ?? null);
  }, [user]);

  useEffect(() => {
    if (!user?.id || user.address) return;
    loadSavedAddress();
  }, [user, loadSavedAddress]);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const businessTitle = business?.name ?? "Negocio local";
  const businessSubtitle =
    business?.slogan ??
    business?.description_long ??
    "Pide tus favoritos y recíbelos en minutos.";

  return (
    <div className="min-h-screen bg-[#f8f8f8] text-slate-950">
      <main className="pb-16">
        {loading ? (
          <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
            <section className="relative h-[260px] overflow-hidden rounded-b-[28px] bg-slate-200" />
            <div className="mx-auto -mt-10 max-w-5xl">
              <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
                <div className="h-8 w-48 animate-pulse rounded-full bg-slate-200" />
                <div className="mt-4 h-12 w-2/3 animate-pulse rounded-2xl bg-slate-200" />
                <div className="mt-3 h-5 w-1/2 animate-pulse rounded-full bg-slate-100" />
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 rounded-[28px] border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm">
              <span className="font-semibold">{error}</span>
              <button
                type="button"
                onClick={fetchBusinessData}
                className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-red-700 shadow-sm hover:bg-red-50"
              >
                Reintentar
              </button>
            </div>
          </div>
        ) : business ? (
          <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8">
            <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">
              <div className="px-5 pb-6 pt-6 sm:px-8 sm:pt-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                  <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
                    <div className="relative h-[90px] w-[90px] shrink-0 overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-lg sm:h-[120px] sm:w-[120px]">
                      {business.avatar_url || mainPhotoPreview ? (
                        <Image
                          src={business.avatar_url || mainPhotoPreview || ""}
                          alt={`Logo de ${businessTitle}`}
                          fill
                          unoptimized
                          className="bg-white object-contain p-2.5"
                          sizes="(max-width: 640px) 90px, 120px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-white text-2xl font-extrabold uppercase tracking-wide text-slate-700 sm:text-3xl">
                          {businessTitle
                            .split(/\s+/)
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((part) => part.charAt(0))
                            .join("")
                            .toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="text-center sm:pt-2 sm:text-left">
                      <p className="text-sm font-semibold text-slate-500">
                        {business.category_name ??
                          business.category ??
                          "Aliado local"}
                      </p>
                      <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
                        {businessTitle}
                      </h1>
                      <p className="mt-3 max-w-3xl text-base leading-7 text-slate-500">
                        {businessSubtitle}
                      </p>
                      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
                        <span>
                          {business.address ?? "Dirección no disponible"}
                          {business.city ? `, ${business.city}` : ""}
                          {business.district ? `, ${business.district}` : ""}
                        </span>
                        <span className="font-semibold text-slate-950">
                          4.8
                        </span>
                        <span>
                          {business.estimated_delivery_minutes ?? 15} min
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${
                        business.is_open_now
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {business.is_open_now ? "Entrega disponible" : "Cerrado"}
                    </span>
                    <Link
                      href="/shop"
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Regresar
                    </Link>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 border-t border-slate-100 pt-5 md:grid-cols-3">
                  <div className="rounded-3xl bg-slate-50 px-5 py-4">
                    <p className="text-sm font-semibold text-emerald-600">
                      Costo de envío
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Promociones disponibles para nuevos usuarios
                    </p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 px-5 py-4">
                    <p className="text-sm font-semibold text-slate-950">
                      {business.estimated_delivery_minutes ?? 15} min
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Llegada estimada
                    </p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 px-5 py-4">
                    <p className="text-sm font-semibold text-slate-950">
                      {products.length} productos
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Menú disponible
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section id="menu" className="mt-6">
              <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
                <aside className="h-fit rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-6">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="search"
                      placeholder="Buscar productos..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                    />
                  </div>

                  <div className="mt-5 space-y-1">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => {
                          setActiveCategory(category.id);
                          setCurrentPage(1);
                        }}
                        className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                          activeCategory === category.id
                            ? "bg-slate-950 text-white"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span className="pr-4">{category.name}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs ${
                            activeCategory === category.id
                              ? "bg-white/15 text-white"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {category.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </aside>

                <section className="rounded-[28px] border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
                  {cartMessage ? (
                    <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                      {cartMessage}
                    </div>
<<<<<<< Updated upstream
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-medium text-yellow-800 hover:bg-yellow-200"
                      >
                        Limpiar búsqueda
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                      {paginatedProducts.map((product) => (
                        <div
                          key={product.id}
                          className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
                        >
                          <div className="relative w-full overflow-hidden rounded-xl bg-slate-100">
                            <div className="relative aspect-[4/3] w-full">
                              <Image
                                src={product.thumbnail_url || "/items/thumbnails/generic-item.png"}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-300 hover:scale-105"
                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              />
                              {product.discount_price && (
                                <div className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-1 text-[10px] font-bold text-white">
                                  OFERTA
                                </div>
                              )}
                            </div>
<<<<<<< Updated upstream
=======
                            
                            {/* Stock */}
<div
  className={`text-xs font-medium ${
    product.is_stock_available
      ? product.stock_average > product.stock_danger
        ? "text-emerald-600"
        : "text-amber-600"
      : "text-red-600"
  }`}
>
  {product.is_stock_available
    ? `Disponible: ${product.stock_average} unidades`
    : "Agotado"}
</div>

{/* Botón + selector */}
<div className="mt-3 flex justify-center">
  {quantities[product.id] ? (
    /* Selector + botón confirmar */
    <div className="flex items-center gap-2 rounded-full border border-slate-300 bg-slate-100 px-3 py-1">

      {/* Botón menos */}
      <button
        type="button"
        onClick={() => decrement(product.id)}
        className="rounded-full bg-slate-200 px-2 py-1 text-sm font-semibold hover:bg-slate-300"
      >
        -
      </button>

      {/* Cantidad */}
      <span className="w-6 text-center text-sm font-semibold">
        {quantities[product.id]}
      </span>

      {/* Botón más */}
      <button
        type="button"
        onClick={() => increment(product.id)}
        className="rounded-full bg-slate-200 px-2 py-1 text-sm font-semibold hover:bg-slate-300"
      >
        +
      </button>

      {/* Botón confirmar */}
      <button
        type="button"
        onClick={() => confirmQuantity(product.id)}
        className={`
          ml-1 flex items-center justify-center rounded-full px-2 py-1 text-white text-xs font-bold shadow
          ${confirmed[product.id] ? "bg-emerald-600" : "bg-emerald-500 hover:bg-emerald-600"}
        `}
      >
        ✓
      </button>

    </div>
  ) : (
    /* Botón agregar */
    <button
  type="button"
  onClick={() => {
    addToCart(product.id);     // muestra selector
    sendToCart(product.id, 1); // agrega 1 a la BD
  }}
  className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-600"
>
  Agregar al carrito
</button>

  )}
</div>


>>>>>>> Stashed changes
                          </div>

                          <div className="flex w-full flex-col gap-1.5 text-center">
                            <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 sm:text-base">{product.name}</h3>
                            {product.category_name && (
                              <span className="self-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] text-slate-600">{product.category_name}</span>
                            )}
                            <div className="flex items-center justify-center gap-2 text-sm sm:text-lg">
                              {product.discount_price ? (
                                <>
                                  <span className="font-bold text-orange-600">${product.discount_price.toFixed(2)}</span>
                                  <span className="text-xs text-slate-400 line-through sm:text-sm">${product.price.toFixed(2)}</span>
                                </>
                              ) : (
                                <span className="font-bold text-slate-900">${product.price.toFixed(2)}</span>
                              )}
                            </div>
                            <div
                              className={`inline-flex self-center rounded-full bg-slate-50 px-2 py-0.5 text-[11px] font-semibold sm:px-2.5 sm:text-xs ${
                                product.is_stock_available
                                  ? product.stock_average > product.stock_danger
                                    ? "text-orange-600"
                                    : "text-amber-600"
                                  : "text-red-600"
                              }`}
                            >
                              {product.is_stock_available
                                ? `Disponible: ${product.stock_average} unidades`
                                : "Agotado"}
                            </div>

                            <div className="mt-2 flex w-full justify-between gap-2">
                              {quantities[product.id] ? (
                                <div className="flex flex-1 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1">
                                  <button
                                    type="button"
                                    onClick={() => decrement(product.id)}
                                    className="rounded-full bg-slate-200 px-2 py-1 text-xs font-semibold hover:bg-slate-300"
                                  >
                                    -
                                  </button>
                                  <span className="w-6 text-center text-xs font-semibold">{quantities[product.id]}</span>
                                  <button
                                    type="button"
                                    onClick={() => increment(product.id)}
                                    className="rounded-full bg-slate-200 px-2 py-1 text-xs font-semibold hover:bg-slate-300"
                                  >
                                    +
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => confirmQuantity(product.id)}
                                    className={`ml-1 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white shadow ${confirmed[product.id] ? "bg-orange-600" : "bg-orange-500 hover:bg-orange-600"}`}
                                  >
                                    ✓
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => addToCart(product.id)}
                                  disabled={!product.is_stock_available || product.stock_average <= 0}
                                  className="ml-auto flex h-9 items-center justify-center rounded-full bg-orange-500 px-4 text-sm font-semibold text-white shadow transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                                >
                                  {product.is_stock_available && product.stock_average > 0 ? "Agregar" : "Agotado"}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
=======
                  ) : null}
                  {cartError ? (
                    <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                      {cartError}
>>>>>>> Stashed changes
                    </div>
                  ) : null}
                  {products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-[28px] border border-orange-100 bg-orange-50/90 p-8 text-center text-orange-800">
                      <div className="text-lg font-semibold">
                        Aún no hay productos publicados.
                      </div>
                      <p className="text-sm">
                        Cuando el negocio añada productos, los verás aquí.
                      </p>
                    </div>
                  ) : filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-4 rounded-[28px] border border-yellow-200 bg-yellow-50/90 p-8 text-center text-yellow-800">
                      <div className="text-lg font-medium">
                        {searchQuery
                          ? "No se encontraron productos con esa búsqueda."
                          : "No hay productos disponibles en esta categoría."}
                      </div>
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearchQuery("");
                            setCurrentPage(1);
                          }}
                          className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-medium text-yellow-800 hover:bg-yellow-200"
                        >
                          Limpiar búsqueda
                        </button>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                        {paginatedProducts.map((product, index) => (
                          <div
                            key={`${product.id}-${product.product_category_id ?? product.category_name ?? "general"}-${index}`}
                            className="flex min-h-[320px] flex-col rounded-3xl border border-slate-200 bg-white p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                          >
                            <div className="relative aspect-[1/1] overflow-hidden rounded-2xl bg-slate-100">
                              {(() => {
                                const productImageSrc = getProductImageSrc(
                                  product.image_url,
                                  product.thumbnail_url,
                                );

                                return (
                                  <Image
                                    src={productImageSrc}
                                    alt={product.name}
                                    fill
                                    unoptimized={isExternalImageSrc(
                                      productImageSrc,
                                    )}
                                    className="object-cover"
                                    sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 20vw"
                                  />
                                );
                              })()}
                              {hasOfferPrice(product) ? (
                                <div className="absolute left-2 top-2 rounded-full bg-emerald-600 px-2 py-1 text-[10px] font-bold text-white">
                                  Oferta
                                </div>
                              ) : null}
                            </div>

                            <div className="mt-3 flex min-w-0 flex-1 flex-col">
                              <h3 className="line-clamp-2 text-base font-bold leading-tight text-slate-950">
                                {product.name}
                              </h3>
                              {product.category_name && (
                                <span className="mt-2 inline-flex w-fit rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
                                  {product.category_name}
                                </span>
                              )}
                              <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
                                {product.description_short ??
                                  product.description_long ??
                                  "Preparado con ingredientes seleccionados y listo para disfrutar."}
                              </p>
                              <div className="mt-3 flex items-center gap-2 text-sm sm:text-base">
                                {hasOfferPrice(product) ? (
                                  <>
                                    <span className="font-bold text-orange-600">
                                      ${product.discount_price?.toFixed(2)}
                                    </span>
                                    <span className="text-xs text-slate-400 line-through sm:text-sm">
                                      ${product.price.toFixed(2)}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-base font-bold text-slate-900">
                                    ${product.price.toFixed(2)}
                                  </span>
                                )}
                              </div>
                              <div
                                className={`mt-2 inline-flex w-fit rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-semibold ${
                                  product.is_stock_available
                                    ? product.stock_average >
                                      product.stock_danger
                                      ? "text-orange-600"
                                      : "text-amber-600"
                                    : "text-red-600"
                                }`}
                              >
                                {product.is_stock_available
                                  ? `Disponible: ${product.stock_average} unidades`
                                  : "Agotado"}
                              </div>

                              <div className="mt-auto pt-3">
                                {quantities[product.id] ? (
                                  <div className="flex w-full items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-1">
                                    <button
                                      type="button"
                                      onClick={() => decrement(product.id)}
                                      className="rounded-full bg-slate-200 px-2 py-1 text-[11px] font-semibold hover:bg-slate-300"
                                    >
                                      -
                                    </button>
                                    <span className="w-5 text-center text-[11px] font-semibold">
                                      {quantities[product.id]}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => increment(product.id)}
                                      className="rounded-full bg-slate-200 px-2 py-1 text-[11px] font-semibold hover:bg-slate-300"
                                    >
                                      +
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        openCustomizationModal(product)
                                      }
                                      disabled={addingProductId === product.id}
                                      className={`ml-auto flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold text-white shadow ${confirmed[product.id] ? "bg-orange-600" : "bg-orange-500 hover:bg-orange-600"}`}
                                    >
                                      {addingProductId === product.id
                                        ? "..."
                                        : "✓"}
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => addToCart(product.id)}
                                    disabled={
                                      !product.is_stock_available ||
                                      product.stock_average <= 0
                                    }
                                    className="inline-flex h-10 items-center justify-center rounded-2xl border border-orange-200 bg-white px-4 text-sm font-semibold text-orange-600 shadow-sm transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
                                  >
                                    {product.is_stock_available &&
                                    product.stock_average > 0
                                      ? "Agregar"
                                      : "Agotado"}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {totalPages > 1 && (
                        <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
                          <div className="text-sm text-slate-500">
                            Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
                            {Math.min(
                              currentPage * ITEMS_PER_PAGE,
                              filteredProducts.length,
                            )}{" "}
                            de {filteredProducts.length} productos
                          </div>
                          <div className="flex w-full items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={handlePreviousPage}
                              disabled={currentPage === 1}
                              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 md:h-auto md:w-auto md:gap-1 md:rounded-lg md:px-4 md:py-2"
                            >
                              <ChevronLeft className="h-4 w-4" />
                              <span className="hidden md:inline">Anterior</span>
                            </button>
                            <div className="flex max-w-[200px] items-center gap-1 overflow-x-auto px-1 md:max-w-none">
                              {Array.from(
                                { length: Math.min(5, totalPages) },
                                (_, i) => {
                                  let pageNum = 1;
                                  if (totalPages <= 5) {
                                    pageNum = i + 1;
                                  } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                  } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                  } else {
                                    pageNum = currentPage - 2 + i;
                                  }

                                  return (
                                    <button
                                      key={pageNum}
                                      type="button"
                                      onClick={() => setCurrentPage(pageNum)}
                                      className={`h-10 w-10 flex-shrink-0 rounded-lg text-sm font-medium transition ${currentPage === pageNum ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                                    >
                                      {pageNum}
                                    </button>
                                  );
                                },
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={handleNextPage}
                              disabled={currentPage === totalPages}
                              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 md:h-auto md:w-auto md:gap-1 md:rounded-lg md:px-4 md:py-2"
                            >
                              <span className="hidden md:inline">
                                Siguiente
                              </span>
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </section>
              </div>
            </section>

            <section className="mt-6 flex flex-col gap-5 rounded-[28px] bg-slate-950 px-6 py-7 text-white shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
              <div>
                <h2 className="text-2xl font-extrabold leading-tight">
                  ¿Necesitas ayuda?
                </h2>
                <p className="mt-2 text-base text-white/75">
                  Nuestro equipo está listo para asistirte
                </p>
              </div>
              <SupportChatWidget
                requesterRole="cliente"
                title="Soporte para usuario"
                description="Habla con el Administrador General sin salir de la tienda."
                buttonLabel="Contactar soporte"
                buttonClassName="inline-flex w-full items-center justify-center gap-3 rounded-full bg-white px-6 py-4 text-sm font-extrabold text-slate-950 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-100 sm:w-auto sm:min-w-64"
              />
            </section>
          </div>
        ) : (
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="rounded-[28px] border border-yellow-200 bg-yellow-50 p-6 text-sm text-yellow-900 shadow-sm">
              No encontramos el negocio solicitado.
            </div>
          </div>
        )}
      </main>

      <Dialog open={customizeModalOpen} onOpenChange={setCustomizeModalOpen}>
        <DialogContent className="flex max-h-[90vh] max-w-md flex-col overflow-hidden rounded-3xl border-slate-200 bg-white p-0 shadow-xl">
          <DialogHeader className="shrink-0 border-b border-slate-100 px-5 py-4">
            <DialogTitle className="text-slate-950">
              Personaliza tu producto
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Ajusta tu pedido antes de agregarlo al carrito.
            </DialogDescription>
          </DialogHeader>

          {selectedProduct ? (
            <>
              <div className="flex-1 overflow-y-auto px-5 py-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                      {(() => {
                        const selectedProductImageSrc = getProductImageSrc(
                          selectedProduct.image_url,
                          selectedProduct.thumbnail_url,
                        );

                        return (
                          <Image
                            src={selectedProductImageSrc}
                            alt={selectedProduct.name}
                            fill
                            unoptimized={isExternalImageSrc(
                              selectedProductImageSrc,
                            )}
                            className="object-cover"
                          />
                        );
                      })()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-bold text-slate-950">
                        {selectedProduct.name}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {selectedProduct.category_name ?? "Producto"}
                      </p>
                      <p className="mt-1.5 text-sm font-semibold text-orange-600">
                        ${baseUnitPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700">
                        Cantidad
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setModalQuantity((prev) => Math.max(1, prev - 1))
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-700 shadow-sm ring-1 ring-slate-200"
                        >
                          -
                        </button>
                        <span className="min-w-8 text-center text-sm font-semibold text-slate-950">
                          {modalQuantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setModalQuantity((prev) => prev + 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-700 shadow-sm ring-1 ring-slate-200"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 sm:grid-cols-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Base
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        ${baseUnitPrice.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Extras
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        ${extrasTotal.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Total
                      </p>
                      <p className="mt-1 text-sm font-bold text-orange-600">
                        ${totalPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {loadingCustomizations ? (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
                      Cargando personalizaciones...
                    </div>
                  ) : customizationGroups.length > 0 ? (
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-slate-900">
                        Personalización
                      </h4>
                      {customizationGroups.map((group) => {
                        const selectedCount =
                          selectedOptionsByGroup[group.id]?.length ?? 0;

                        return (
                          <div
                            key={group.id}
                            className="rounded-2xl border border-slate-200 px-3 py-3"
                          >
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div>
                                <p className="text-sm font-semibold text-slate-900">
                                  {group.name}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                  {typeof group.maxSelections === "number" &&
                                  group.maxSelections > 0
                                    ? `Elige hasta ${group.maxSelections}`
                                    : "Sin límite de selección"}
                                </p>
                              </div>
                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                                {selectedCount} seleccionadas
                              </span>
                            </div>

                            <div className="mt-3 grid gap-2">
                              {group.options.map((option) => {
                                const isSelected = (
                                  selectedOptionsByGroup[group.id] ?? []
                                ).includes(option.id);
                                const maxReached =
                                  !isSelected &&
                                  typeof group.maxSelections === "number" &&
                                  group.maxSelections > 0 &&
                                  (selectedOptionsByGroup[group.id]?.length ??
                                    0) >= group.maxSelections;

                                return (
                                  <button
                                    key={option.id}
                                    type="button"
                                    onClick={() =>
                                      toggleGroupOption(group, option.id)
                                    }
                                    disabled={maxReached}
                                    className={`flex items-center justify-between rounded-2xl border px-3 py-2.5 text-left text-sm transition ${
                                      isSelected
                                        ? "border-orange-500 bg-orange-50 text-orange-700"
                                        : "border-slate-200 text-slate-700 hover:bg-slate-50"
                                    } ${maxReached ? "cursor-not-allowed opacity-50" : ""}`}
                                  >
                                    <span>{option.name}</span>
                                    <span className="font-medium">
                                      {option.extraPrice > 0
                                        ? `+$${option.extraPrice.toFixed(2)}`
                                        : "$0.00"}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-600">
                      Este producto aún no tiene grupos de personalización
                      configurados. Puedes dejar indicaciones especiales.
                    </div>
                  )}

                  <div className="space-y-2">
                    <label
                      htmlFor="customization-notes"
                      className="text-sm font-semibold text-slate-900"
                    >
                      Indicaciones especiales
                    </label>
                    <textarea
                      id="customization-notes"
                      value={customizationNotes}
                      onChange={(event) =>
                        setCustomizationNotes(event.target.value)
                      }
                      placeholder="Ej. sin cebolla, bien cocido, salsa aparte..."
                      className="min-h-24 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    />
                  </div>
                </div>
              </div>

              <DialogFooter className="sticky bottom-0 shrink-0 border-t border-slate-100 bg-white px-5 py-4 sm:justify-between">
                <button
                  type="button"
                  onClick={() => setCustomizeModalOpen(false)}
                  className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={
                    loadingCustomizations ||
                    addingProductId === selectedProduct.id
                  }
                  className="inline-flex h-11 items-center justify-center rounded-2xl bg-orange-500 px-5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {addingProductId === selectedProduct.id
                    ? "Agregando..."
                    : "Agregar al carrito"}
                </button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <AddressRequiredDialog
        open={addressDialogOpen}
        onOpenChange={setAddressDialogOpen}
        onSaved={(address) => {
          setSavedAddress(address);
          setCartError(null);
        }}
      />
    </div>
  );
}
