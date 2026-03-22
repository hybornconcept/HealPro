import { realTimeMetrics, nigeriaGeoData } from '$lib/data/hmo-dashboard';

export const load = async () => {
    // Simulate server delay if needed, but for now just return mock data
    return {
        metrics: realTimeMetrics,
        mapData: nigeriaGeoData
    };
};