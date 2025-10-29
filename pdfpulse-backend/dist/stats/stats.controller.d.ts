import { StatsService } from './stats.service';
export declare class StatsController {
    private readonly statsService;
    constructor(statsService: StatsService);
    getCount(): Promise<{
        total: number;
    }>;
    increment(body: {
        type?: string;
        hash?: string;
    }): Promise<{
        total: number;
    }>;
}
