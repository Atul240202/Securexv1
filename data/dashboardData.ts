export interface MostUsedApp {
  name: string;
  icon: string; // Could be a local image or icon name
  usageMinutes: number;
}

export interface DashboardSummary {
  totalApps: number;
  riskApps: number;
  dailyScreenTime: string;
  mostUsedApps: MostUsedApp[];
}

export const dashboardData: DashboardSummary = {
  totalApps: 5,
  riskApps: 2,
  dailyScreenTime: '9h 30m',
  mostUsedApps: [
    {name: 'Instagram', icon: 'camera', usageMinutes: 240},
    {name: 'WhatsApp', icon: 'chat', usageMinutes: 180},
    {name: 'Maps', icon: 'map', usageMinutes: 90},
    {name: 'Banking App', icon: 'bank', usageMinutes: 45},
    {name: 'Calculator', icon: 'calculator', usageMinutes: 15},
  ],
};
