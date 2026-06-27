import React, { createContext, useContext, useState, useCallback } from "react";
import { brands as staticBrands } from "@/data/brands";
import { reviews as staticReviews } from "@/data/reviews";
import { dataStore, StoredReview, BrandMeta, CustomBrand, SiteSettings } from "@/store/dataStore";

export interface FullReview {
  id: number;
  brandId: number;
  author: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar: string;
  rating: number;
  title?: string;
  text: string;
  petType?: string;
  photoBase64?: string;
  likes: number;
  status: "approved" | "pending" | "rejected";
  createdAt?: number;
  timeAgo: string;
  isUserSubmitted: boolean;
}

export interface FullBrand {
  id: number;
  name: string;
  slug: string;
  rating: number;
  reviewCount: number;
  category: string;
  origin: "global" | "local";
  logoText: string;
  logoColor: string;
  logoBg: string;
  verified: boolean;
  websiteUrl: string;
  productsUrl: string;
  description?: string;
  isCustom: boolean;
}

interface DataContextValue {
  brands: FullBrand[];
  reviews: FullReview[];
  settings: SiteSettings;
  isVoted: (id: number) => boolean;
  getLikeCount: (review: FullReview) => number;
  toggleVote: (id: number) => void;
  addReview: (data: Omit<StoredReview, "id" | "createdAt" | "likes">) => void;
  setReviewStatus: (id: number, isUser: boolean, status: "approved" | "rejected") => void;
  deleteReview: (id: number, isUser: boolean) => void;
  updateBrandMeta: (id: number, meta: Partial<BrandMeta>) => void;
  addCustomBrand: (b: Omit<CustomBrand, "id">) => void;
  updateCustomBrand: (id: number, updates: Partial<CustomBrand>) => void;
  deleteCustomBrand: (id: number) => void;
  saveSettings: (s: SiteSettings) => void;
  refresh: () => void;
}

const DataContext = createContext<DataContextValue | null>(null);

function buildBrands(): FullBrand[] {
  const meta = dataStore.getBrandMeta();
  const custom = dataStore.getCustomBrands();
  const statics: FullBrand[] = staticBrands.map((b) => ({
    ...b,
    verified: meta[b.id]?.verified ?? false,
    websiteUrl: meta[b.id]?.websiteUrl ?? "",
    productsUrl: meta[b.id]?.productsUrl ?? "",
    isCustom: false,
  }));
  const customFull: FullBrand[] = custom.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    rating: c.rating,
    reviewCount: c.reviewCount,
    category: c.category,
    origin: c.origin,
    logoText: c.logoText,
    logoColor: c.logoColor,
    logoBg: c.logoBg,
    verified: c.verified,
    websiteUrl: c.websiteUrl,
    productsUrl: c.productsUrl,
    description: c.description,
    isCustom: true,
  }));
  return [...statics, ...customFull];
}

function buildReviews(): FullReview[] {
  const staticStatuses = dataStore.getStaticStatuses();
  const userReviews = dataStore.getUserReviews();
  const deltas = dataStore.getLikeDeltas();

  const statics: FullReview[] = staticReviews.map((r) => ({
    id: r.id,
    brandId: r.brandId,
    author: r.author,
    avatar: r.avatar,
    rating: r.rating,
    text: r.text,
    likes: r.likes + (deltas[r.id] ?? 0),
    status: staticStatuses[r.id] ?? "approved",
    timeAgo: r.timeAgo,
    isUserSubmitted: false,
  }));

  const users: FullReview[] = userReviews.map((r) => ({
    id: r.id,
    brandId: r.brandId,
    author: r.author,
    firstName: r.firstName,
    lastName: r.lastName,
    phone: r.phone,
    avatar: r.avatar,
    rating: r.rating,
    title: r.title,
    text: r.text,
    petType: r.petType,
    photoBase64: r.photoBase64,
    likes: r.likes + (deltas[r.id] ?? 0),
    status: r.status,
    createdAt: r.createdAt,
    timeAgo: formatTimeAgo(r.createdAt),
    isUserSubmitted: true,
  }));

  return [...users, ...statics];
}

function formatTimeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  if (mins < 1) return "Az önce";
  if (mins < 60) return `${mins} dakika önce`;
  if (hours < 24) return `${hours} saat önce`;
  if (days < 7) return `${days} gün önce`;
  if (weeks < 4) return `${weeks} hafta önce`;
  return `${months} ay önce`;
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [tick, setTick] = useState(0);
  const refresh = useCallback(() => setTick((t) => t + 1), []);

  const brands = buildBrands();
  const reviews = buildReviews();
  const settings = dataStore.getSettings();

  const isVoted = useCallback((id: number) => dataStore.hasVoted(id), [tick]);

  const getLikeCount = useCallback(
    (review: FullReview) => review.likes,
    [tick]
  );

  const toggleVote = useCallback((id: number) => {
    dataStore.toggleVote(id);
    refresh();
  }, [refresh]);

  const addReview = useCallback((data: Omit<StoredReview, "id" | "createdAt" | "likes">) => {
    const settings = dataStore.getSettings();
    const newReview: StoredReview = {
      ...data,
      id: dataStore.nextReviewId(),
      createdAt: Date.now(),
      likes: 0,
      status: settings.requireApproval ? "pending" : "approved",
    };
    dataStore.addUserReview(newReview);
    refresh();
  }, [refresh]);

  const setReviewStatus = useCallback((id: number, isUser: boolean, status: "approved" | "rejected") => {
    if (isUser) {
      dataStore.setUserReviewStatus(id, status);
    } else {
      dataStore.setStaticStatus(id, status);
    }
    refresh();
  }, [refresh]);

  const deleteReview = useCallback((id: number, isUser: boolean) => {
    if (isUser) {
      dataStore.deleteUserReview(id);
    } else {
      dataStore.setStaticStatus(id, "rejected");
    }
    refresh();
  }, [refresh]);

  const updateBrandMeta = useCallback((id: number, meta: Partial<BrandMeta>) => {
    dataStore.updateBrandMeta(id, meta);
    refresh();
  }, [refresh]);

  const addCustomBrand = useCallback((b: Omit<CustomBrand, "id">) => {
    dataStore.addCustomBrand({ ...b, id: dataStore.nextBrandId() });
    refresh();
  }, [refresh]);

  const updateCustomBrand = useCallback((id: number, updates: Partial<CustomBrand>) => {
    dataStore.updateCustomBrand(id, updates);
    refresh();
  }, [refresh]);

  const deleteCustomBrand = useCallback((id: number) => {
    dataStore.deleteCustomBrand(id);
    refresh();
  }, [refresh]);

  const saveSettingsFn = useCallback((s: SiteSettings) => {
    dataStore.saveSettings(s);
    refresh();
  }, [refresh]);

  return (
    <DataContext.Provider
      value={{
        brands,
        reviews,
        settings,
        isVoted,
        getLikeCount,
        toggleVote,
        addReview,
        setReviewStatus,
        deleteReview,
        updateBrandMeta,
        addCustomBrand,
        updateCustomBrand,
        deleteCustomBrand,
        saveSettings: saveSettingsFn,
        refresh,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
