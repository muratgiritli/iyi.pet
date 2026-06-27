export interface StoredReview {
  id: number;
  brandId: number;
  firstName: string;
  lastName: string;
  phone: string;
  author: string;
  avatar: string;
  rating: number;
  title: string;
  text: string;
  petType: string;
  photoBase64?: string;
  status: "approved" | "pending" | "rejected";
  createdAt: number;
  likes: number;
}

export interface BrandMeta {
  verified: boolean;
  websiteUrl: string;
  productsUrl: string;
}

export interface CustomBrand {
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
  description: string;
  deleted?: boolean;
}

export interface SiteSettings {
  requireApproval: boolean;
  adminPassword: string;
}

const K = {
  userReviews: "iyipet_user_reviews",
  staticStatuses: "iyipet_static_statuses",
  brandMeta: "iyipet_brand_meta",
  customBrands: "iyipet_custom_brands",
  votes: "iyipet_votes",
  likeDelta: "iyipet_like_delta",
  settings: "iyipet_settings",
};

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export const dataStore = {
  // ─── User reviews ─────────────────────────────────────────
  getUserReviews(): StoredReview[] {
    return load<StoredReview[]>(K.userReviews, []);
  },
  addUserReview(r: StoredReview): void {
    const all = this.getUserReviews();
    all.unshift(r);
    save(K.userReviews, all);
  },
  setUserReviewStatus(id: number, status: StoredReview["status"]): void {
    save(
      K.userReviews,
      this.getUserReviews().map((r) => (r.id === id ? { ...r, status } : r))
    );
  },
  deleteUserReview(id: number): void {
    save(K.userReviews, this.getUserReviews().filter((r) => r.id !== id));
  },

  // ─── Static review status overrides ───────────────────────
  getStaticStatuses(): Record<number, "approved" | "rejected"> {
    return load(K.staticStatuses, {});
  },
  setStaticStatus(id: number, status: "approved" | "rejected"): void {
    const all = this.getStaticStatuses();
    all[id] = status;
    save(K.staticStatuses, all);
  },

  // ─── Votes ────────────────────────────────────────────────
  getVotes(): number[] {
    return load<number[]>(K.votes, []);
  },
  toggleVote(id: number): boolean {
    const votes = this.getVotes();
    const idx = votes.indexOf(id);
    const delta = this.getLikeDeltas();
    if (idx >= 0) {
      votes.splice(idx, 1);
      delta[id] = (delta[id] ?? 0) - 1;
    } else {
      votes.push(id);
      delta[id] = (delta[id] ?? 0) + 1;
    }
    save(K.votes, votes);
    save(K.likeDelta, delta);
    return idx < 0;
  },
  hasVoted(id: number): boolean {
    return this.getVotes().includes(id);
  },
  getLikeDeltas(): Record<number, number> {
    return load(K.likeDelta, {});
  },

  // ─── Brand meta ───────────────────────────────────────────
  getBrandMeta(): Record<number, Partial<BrandMeta>> {
    return load(K.brandMeta, {});
  },
  updateBrandMeta(id: number, meta: Partial<BrandMeta>): void {
    const all = this.getBrandMeta();
    all[id] = { ...all[id], ...meta };
    save(K.brandMeta, all);
  },

  // ─── Custom brands ────────────────────────────────────────
  getCustomBrands(): CustomBrand[] {
    return load<CustomBrand[]>(K.customBrands, []);
  },
  addCustomBrand(b: CustomBrand): void {
    const all = this.getCustomBrands();
    all.push(b);
    save(K.customBrands, all);
  },
  updateCustomBrand(id: number, updates: Partial<CustomBrand>): void {
    save(
      K.customBrands,
      this.getCustomBrands().map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  },
  deleteCustomBrand(id: number): void {
    save(K.customBrands, this.getCustomBrands().filter((b) => b.id !== id));
  },

  // ─── Settings ─────────────────────────────────────────────
  getSettings(): SiteSettings {
    return load<SiteSettings>(K.settings, {
      requireApproval: true,
      adminPassword: "admin123",
    });
  },
  saveSettings(s: SiteSettings): void {
    save(K.settings, s);
  },

  // ─── New ID helper ────────────────────────────────────────
  nextReviewId(): number {
    const user = this.getUserReviews();
    const max = user.reduce((m, r) => Math.max(m, r.id), 10000);
    return max + 1;
  },
  nextBrandId(): number {
    const custom = this.getCustomBrands();
    const max = custom.reduce((m, b) => Math.max(m, b.id), 1000);
    return max + 1;
  },
};
