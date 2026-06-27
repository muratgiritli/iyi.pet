export type VoteType = "helpful" | "unhelpful";

const VOTES_KEY = "iyipet_votes_v2";
const REPORTS_KEY = "iyipet_reports_v1";

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

export const voteStore = {
  getAll(): Record<number, VoteType> {
    return load<Record<number, VoteType>>(VOTES_KEY, {});
  },
  getVote(id: number): VoteType | null {
    return this.getAll()[id] ?? null;
  },
  setVote(id: number, type: VoteType | null): void {
    const all = this.getAll();
    if (type === null) {
      delete all[id];
    } else {
      all[id] = type;
    }
    save(VOTES_KEY, all);
  },
};

export const reportStore = {
  getAll(): Record<number, true> {
    return load<Record<number, true>>(REPORTS_KEY, {});
  },
  hasReported(id: number): boolean {
    return this.getAll()[id] === true;
  },
  setReported(id: number): void {
    const all = this.getAll();
    all[id] = true;
    save(REPORTS_KEY, all);
  },
};
