import { DashboardData, ChartUpdateDataPoint } from '@/types/api';


/**
 * Mengambil semua data yang dibutuhkan untuk halaman dashboard utama.
 */
export async function fetchDashboardData(): Promise<DashboardData> {
  // PERBAIKAN 2: Gunakan URL relatif yang dimulai dengan /api.
  const response = await fetch(`/api/main-dashboard`);
  if (!response.ok) {
    throw new Error("Gagal mengambil data dashboard dari server.");
  }
  return await response.json();
}

/**
 * Mengambil data chart terbaru untuk pembaruan berkala.
 */
export async function fetchChartUpdateData(): Promise<ChartUpdateDataPoint[]> {
  // PERBAIKAN 3: Gunakan URL relatif yang dimulai dengan /api.
  const response = await fetch(`/api/chart-data`);
  if (!response.ok) {
    throw new Error("Gagal mengambil data chart terbaru.");
  }
  return await response.json();
}