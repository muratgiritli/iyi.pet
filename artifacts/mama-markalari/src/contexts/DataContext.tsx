import React, { createContext, useContext, useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListBrands,
  useGetSettings,
  useVoteReview,
  useReportReview,
  getListPublicReviewsQueryKey,
  getListBrandsQueryKey,
  getGetStatsQueryKey,
  type Brand,
} from "@workspace/api-client-react";
import { voteStore, reportStore, VoteType } from "@/store/dataStore";

interface DataContextValue {
  brands: Brand[];
  brandsLoading: boolean;
  requireApproval: boolean;
  getVote: (id: number) => VoteType | null;
  vote: (reviewId: number, type: VoteType) => void;
  hasReported: (id: number) => boolean;
  report: (reviewId: number) => void;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [, setTick] = useState(0);
  const bump = useCallback(() => setTick((t) => t + 1), []);

  const brandsQuery = useListBrands();
  const settingsQuery = useGetSettings();
  const voteMutation = useVoteReview();
  const reportMutation = useReportReview();

  const getVote = useCallback((id: number) => voteStore.getVote(id), []);
  const hasReported = useCallback((id: number) => reportStore.hasReported(id), []);

  const report = useCallback(
    (reviewId: number) => {
      if (reportStore.hasReported(reviewId)) return;
      reportStore.setReported(reviewId);
      bump();
      reportMutation.mutate(
        { id: reviewId, data: {} },
        {
          onSettled: () => {
            queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
          },
        },
      );
    },
    [reportMutation, queryClient, bump],
  );

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
        hasReported,
        report,
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
