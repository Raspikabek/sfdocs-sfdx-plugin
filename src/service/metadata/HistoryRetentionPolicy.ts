export interface HistoryRetentionPolicy {
  archiveAfterMonths: number;
  archiveRetentionYears: number;
  description: string;
  gracePeriodDays: number;
}
