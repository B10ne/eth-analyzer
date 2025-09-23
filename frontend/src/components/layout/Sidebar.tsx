// frontend/src/components/layout/Sidebar.tsx
import { NavLink } from 'react-router-dom';
import { BarChart3, TrendingUp, Settings, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useAuth } from '@/contexts/AuthContext';

export function Sidebar() {
  const { data, loading, error } = useDashboardData();
  const ethPrice = data?.live_price?.price;
  const changePercent = data?.live_price?.change_percent;
  const { isLoggedIn } = useAuth();

  // Daftar navigasi dasar yang selalu ada
  let navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  ];

  // Tambahkan link Predictions jika pengguna sudah login
  if (isLoggedIn) {
    navigation.push({ name: 'Predictions', href: '/predictions', icon: TrendingUp });
  }

  // Tambahkan link Settings di bagian akhir
  navigation.push({ name: 'Settings', href: '/settings', icon: Settings });

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r border-border">
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold gradient-financial bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            EthAnalyzer
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-border p-4">
        <div className="text-xs text-muted-foreground">
          <p>ETH Live Price</p>
          <div className="mt-1 flex items-center space-x-1">
            <span className="text-lg font-semibold text-foreground">
              {loading ? 'Loading...' : `$${ethPrice?.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
            </span>
            {changePercent !== undefined && (
              <span className={`text-xs font-medium ${changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {changePercent.toFixed(2)}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}