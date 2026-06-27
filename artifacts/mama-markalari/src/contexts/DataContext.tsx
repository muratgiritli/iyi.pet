import React, { createContext, useContext, useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListBrands,
  useGetSettings,
  useVoteReview,
  getListPublicReviewsQueryKey,
  getListBrandsQueryKey,
  type Brand,
} from "@workspace/api-client-react";
import { voteStore, VoteType } from "@/store/dataStore";

interface DataContextValue {
  brands: Brand[];
  brandsLoading: boolean;
  requireApproval: boolean;
  getVote: (id: number) => VoteType | null;
  vote: (reviewId: number, type: VoteType) => void;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [, setTick] = useState(0);
  const bump = useCallback(() => setTick((t) => t + 1), []);

  const brandsQuery = useListBrands();
  const settingsQuery = useGetSettings();
  const voteMutation = useVoteReview();

  const getVote = useCallback((id: number) => voteStore.getVote(id), []);

  const vote = useCallback(
    (reviewId: number, type: VoteType) => {
      const previous = voteStore.getVote(reviewId);
      const next = previous === type ? null : type;
      voteStore.setVote(reviewId, next);
      bump();
      voteMutation.mutate(
        { id: reviewId, data: { previous, next } },
        {
          onError: () => {
            voteStore.setVote(reviewId, previous);
            bump();
          },
          onSettled: () => {
            queryClient.invalidateQueries({ queryKey: getListPublicReviewsQueryKey() });
            queryClient.invalidateQueries({ queryKey: getListBrandsQueryKey() });
          },
        },
      );
    },
    [voteMutation, queryClient, bump],
  );

  return (
    <DataContext.Provider
      value={{
        brands: brandsQuery.data ?? [],
        brandsLoading: brandsQuery.isLoading,
        requireApproval: settingsQuery.data?.requireApproval ?? true,
        getVote,
        vote,
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
