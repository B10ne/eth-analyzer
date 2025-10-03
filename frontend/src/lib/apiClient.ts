import { DashboardData, ChartUpdateDataPoint } from '@/types/api';

const BASE_URL = "http://viqiwebsite.my.id"; 

/**
 * Mengambil semua data yang dibutuhkan untuk halaman dashboard utama.
 */
export async function fetchDashboardData(): Promise<DashboardData> {
  const response = await fetch(`${BASE_URL}/api/main-dashboard`);
  if (!response.ok) {
    throw new Error("Gagal mengambil data dashboard dari server.");
  }
  return await response.json();
}

/**
 * Mengambil data chart terbaru untuk pembaruan berkala.
 */
export async function fetchChartUpdateData(): Promise<ChartUpdateDataPoint[]> {
  const response = await fetch(`${BASE_URL}/api/chart-data`);
  if (!response.ok) {
    throw new Error("Gagal mengambil data chart terbaru.");
  }
  return await response.json();
}