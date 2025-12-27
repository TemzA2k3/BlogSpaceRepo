import { Injectable } from "@nestjs/common";

@Injectable()
export class ProfileStatsHelper {
    getMonthRanges() {
        const now = new Date();

        const lastMonth = new Date(now);
        lastMonth.setMonth(now.getMonth() - 1);

        const twoMonthsAgo = new Date(now);
        twoMonthsAgo.setMonth(now.getMonth() - 2);

        return { lastMonth, twoMonthsAgo };
    }

    calculateChange(current: number, previous: number): number {
        if (previous === 0) return current > 0 ? 100 : 0;
        return Math.round(((current - previous) / previous) * 100);
    }
}
