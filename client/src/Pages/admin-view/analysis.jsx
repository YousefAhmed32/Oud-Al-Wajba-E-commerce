import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAdminDashboardSummary } from "@/store/admin/analysis";
import { 
  BarChart3, 
  ShoppingCart, 
  DollarSign, 
  Users, 
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Package,
  Activity,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RefreshCw
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import {
  Select,
  SelectGroup,
  SelectContent,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = {
  revenue: "#00ff99",
  users: "#3b82f6",
  orders: "#facc15",
  products: "#ff57bb",
  pending: "#f59e0b",
  approved: "#10b981",
  rejected: "#ef4444",
};

const CHART_COLORS = ["#00ff99", "#3b82f6", "#facc15", "#ff57bb", "#8b5cf6", "#ec4899"];

function AdminAnalysis() {
  const dispatch = useDispatch();
  const { loading, summary, error } = useSelector((state) => state.adminAnalysis);
  const [timeframe, setTimeframe] = useState("monthly");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    dispatch(getAdminDashboardSummary(timeframe));
  }, [dispatch, timeframe]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await dispatch(getAdminDashboardSummary(timeframe));
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const getTimeframeLabel = () => {
    const labels = {
      monthly: "آخر 30 يوم",
      weekly: "آخر 7 أيام",
      daily: "اليوم (24 ساعة)",
      hour: "آخر 60 دقيقة",
      yearly: "آخر 12 شهر",
      all: "منذ البداية",
    };
    return labels[timeframe] || "";
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "QAR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat("en-US").format(value || 0);
  };

  // Calculate growth percentages (mock for now, can be enhanced with previous period data)
  const calculateGrowth = (current, previous = 0) => {
    if (!previous || previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  // Prepare chart data
  const chartData = summary?.chartData || [];
  
  // Debug: Log chart data to console
  useEffect(() => {
    if (chartData.length > 0) {
      console.log('📊 Chart Data:', chartData);
      const sampleData = chartData.slice(0, 3);
      console.log('📊 Sample Chart Data:', sampleData);
      const hasRevenue = chartData.some(d => d.revenue > 0);
      const hasUsers = chartData.some(d => d.users > 0);
      const hasOrders = chartData.some(d => d.orders > 0);
      const hasProducts = chartData.some(d => d.products > 0);
      console.log('📊 Data Availability:', { hasRevenue, hasUsers, hasOrders, hasProducts });
      
      // Log max values
      const maxRevenue = Math.max(...chartData.map(d => d.revenue || 0));
      const maxUsers = Math.max(...chartData.map(d => d.users || 0));
      const maxOrders = Math.max(...chartData.map(d => d.orders || 0));
      const maxProducts = Math.max(...chartData.map(d => d.products || 0));
      console.log('📊 Max Values:', { maxRevenue, maxUsers, maxOrders, maxProducts });
    }
  }, [chartData]);
  
  // Revenue breakdown for pie chart
  const revenueBreakdown = summary ? [
    { name: "معتمد", value: summary.totalRevenue || 0, color: COLORS.approved },
    { name: "قيد الانتظار", value: summary.pendingRevenue || 0, color: COLORS.pending },
    { name: "مرفوض", value: summary.rejectedRevenue || 0, color: COLORS.rejected },
  ] : [];

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-navy-950/95 backdrop-blur-md border border-gold-950/30 rounded-lg p-3 shadow-lg">
          <p className="text-gold-300 text-sm mb-2 font-bold">{label}</p>
          {payload.map((entry, index) => {
            const value = entry.value || 0;
            const displayValue = entry.name === "الإيرادات" || entry.dataKey === "revenue"
              ? formatCurrency(value)
              : formatNumber(value);
            return (
              <p key={index} className="text-white text-sm flex items-center gap-2" style={{ color: entry.color }}>
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
                {entry.name}: {displayValue}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  if (loading && !summary) {
    return (
      <div className="min-h-screen luxury-gradient flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-gold-950 animate-spin mx-auto mb-4" />
          <p className="text-gold-300 text-lg">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen luxury-gradient flex items-center justify-center p-6">
        <div className="perfume-card p-8 rounded-xl text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">خطأ في تحميل البيانات</h2>
          <p className="text-gold-300 mb-4">{error}</p>
          <Button onClick={handleRefresh} className="bg-gold-950 text-navy-950 hover:bg-gold-900">
            <RefreshCw className="w-4 h-4 mr-2" />
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="min-h-screen luxury-gradient flex items-center justify-center p-6">
        <div className="perfume-card p-8 rounded-xl text-center max-w-md">
          <BarChart3 className="w-16 h-16 text-gold-950 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">لا توجد بيانات متاحة</h2>
          <p className="text-gold-300">ابدأ بإنشاء الطلبات والمنتجات لرؤية التحليلات</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen luxury-gradient p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="text-center md:text-right">
            <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
              <div className="p-4 rounded-2xl bg-gold-950/20 backdrop-blur-sm">
                <BarChart3 className="w-8 h-8 text-gold-950" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white glow-text">
                لوحة التحليلات
              </h1>
            </div>
            <p className="text-gold-300 text-lg">
              تحليلات شاملة ومفصلة لأداء المتجر
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Select value={timeframe} onValueChange={(value) => setTimeframe(value)}>
              <SelectTrigger className="bg-navy-950/50 border-0 text-white w-[180px]">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="luxury-gradient border-0">
                <SelectGroup>
                  <SelectLabel className="text-gold-300">الفترة الزمنية</SelectLabel>
                  <SelectItem value="hour" className="text-white hover:bg-gold-950/20">آخر 60 دقيقة</SelectItem>
                  <SelectItem value="daily" className="text-white hover:bg-gold-950/20">اليوم (24 ساعة)</SelectItem>
                  <SelectItem value="weekly" className="text-white hover:bg-gold-950/20">أسبوع (7 أيام)</SelectItem>
                  <SelectItem value="monthly" className="text-white hover:bg-gold-950/20">شهر (30 يوم)</SelectItem>
                  <SelectItem value="yearly" className="text-white hover:bg-gold-950/20">سنة (12 شهر)</SelectItem>
                  <SelectItem value="all" className="text-white hover:bg-gold-950/20">منذ البداية</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              className="border-gold-950/30 text-gold-300 hover:bg-gold-950/20"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              تحديث
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              label: "إجمالي المستخدمين",
              value: formatNumber(summary.totalUsers),
              icon: Users,
              color: COLORS.users,
              growth: "+12%",
              trend: "up",
            },
            {
              label: "إجمالي المنتجات",
              value: formatNumber(summary.totalProducts),
              icon: Package,
              color: COLORS.products,
              growth: "+8%",
              trend: "up",
            },
            {
              label: "إجمالي الطلبات",
              value: formatNumber(summary.totalOrders),
              icon: ShoppingCart,
              color: COLORS.orders,
              growth: "+15%",
              trend: "up",
            },
            {
              label: "إجمالي الإيرادات",
              value: formatCurrency(summary.totalRevenue),
              icon: DollarSign,
              color: COLORS.revenue,
              growth: "+22%",
              trend: "up",
            },
          ].map(({ label, value, icon: Icon, color, growth, trend }, idx) => (
            <div
              key={idx}
              className="perfume-card p-6 rounded-xl hover:scale-[1.02] transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl" style={{ backgroundColor: `${color}20` }}>
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                  {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{growth}</span>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">{value}</h3>
              <p className="text-gold-300 text-sm">{label}</p>
              <p className="text-gold-400 text-xs mt-2">{getTimeframeLabel()}</p>
            </div>
          ))}
        </div>

        {/* Revenue Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="perfume-card p-6 rounded-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-green-500/20">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{formatCurrency(summary.totalRevenue || 0)}</h3>
                <p className="text-gold-300 text-sm">إيرادات معتمدة</p>
              </div>
            </div>
          </div>
          
          <div className="perfume-card p-6 rounded-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-yellow-500/20">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{formatCurrency(summary.pendingRevenue || 0)}</h3>
                <p className="text-gold-300 text-sm">إيرادات قيد الانتظار</p>
              </div>
            </div>
          </div>
          
          <div className="perfume-card p-6 rounded-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-red-500/20">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{formatCurrency(summary.rejectedRevenue || 0)}</h3>
                <p className="text-gold-300 text-sm">إيرادات مرفوضة</p>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Overview - Line Chart */}
        <div className="perfume-card p-6 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gold-950/20">
                <LineChartIcon className="w-5 h-5 text-gold-950" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">نظرة عامة على الإيرادات</h2>
                <p className="text-gold-300 text-sm">{getTimeframeLabel()}</p>
              </div>
            </div>
          </div>
          
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.revenue} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={COLORS.revenue} stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="label" 
                  stroke="#d1d5db"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#d1d5db"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => `QR${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke={COLORS.revenue}
                  strokeWidth={3}
                  fill="url(#colorRevenue)"
                  name="الإيرادات"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-gold-950/50 mx-auto mb-4" />
                <p className="text-gold-300">لا توجد بيانات للإيرادات في هذه الفترة</p>
              </div>
            </div>
          )}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Users Chart */}
          <div className="perfume-card p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-white">تسجيلات المستخدمين</h2>
            </div>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="label" stroke="#d1d5db" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#d1d5db" style={{ fontSize: '12px' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="users" fill={COLORS.users} radius={[8, 8, 0, 0]} name="المستخدمين" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-gold-300">لا توجد بيانات</p>
              </div>
            )}
          </div>

          {/* Orders Chart */}
          <div className="perfume-card p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-yellow-500/20">
                <ShoppingCart className="w-5 h-5 text-yellow-400" />
              </div>
              <h2 className="text-xl font-bold text-white">نظرة عامة على الطلبات</h2>
            </div>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="label" stroke="#d1d5db" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#d1d5db" style={{ fontSize: '12px' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke={COLORS.orders}
                    strokeWidth={3}
                    dot={{ fill: COLORS.orders, r: 4 }}
                    name="الطلبات"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-gold-300">لا توجد بيانات</p>
              </div>
            )}
          </div>

          {/* Products Chart */}
          <div className="perfume-card p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-pink-500/20">
                <Package className="w-5 h-5 text-pink-400" />
              </div>
              <h2 className="text-xl font-bold text-white">المنتجات المضافة</h2>
            </div>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="label" stroke="#d1d5db" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#d1d5db" style={{ fontSize: '12px' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="products" fill={COLORS.products} radius={[8, 8, 0, 0]} name="المنتجات" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-gold-300">لا توجد بيانات</p>
              </div>
            )}
          </div>

          {/* Revenue Breakdown Pie Chart */}
          <div className="perfume-card p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <PieChartIcon className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-xl font-bold text-white">توزيع الإيرادات</h2>
            </div>
            {revenueBreakdown.some(item => item.value > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={revenueBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {revenueBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{ backgroundColor: "#1e293b", borderColor: "#fbbf24" }}
                  />
                  <Legend 
                    formatter={(value) => value}
                    wrapperStyle={{ color: "#d1d5db", fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-gold-300">لا توجد بيانات للإيرادات</p>
              </div>
            )}
          </div>
        </div>

        {/* Combined Overview Chart */}
        <div className="perfume-card p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gold-950/20">
              <Activity className="w-5 h-5 text-gold-950" />
            </div>
            <h2 className="text-2xl font-bold text-white">نظرة شاملة على الأداء</h2>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="label" 
                  stroke="#d1d5db" 
                  style={{ fontSize: '12px' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  yAxisId="left"
                  stroke="#d1d5db" 
                  style={{ fontSize: '12px' }}
                  label={{ value: 'الإيرادات ($)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#d1d5db' } }}
                  tickFormatter={(value) => `QR${value}`}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="#d1d5db" 
                  style={{ fontSize: '12px' }}
                  label={{ value: 'العدد', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fill: '#d1d5db' } }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ color: "#d1d5db", fontSize: '12px' }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke={COLORS.revenue}
                  strokeWidth={3}
                  dot={{ fill: COLORS.revenue, r: 4 }}
                  activeDot={{ r: 6 }}
                  name="الإيرادات"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="users"
                  stroke={COLORS.users}
                  strokeWidth={3}
                  dot={{ fill: COLORS.users, r: 4 }}
                  activeDot={{ r: 6 }}
                  name="المستخدمين"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="orders"
                  stroke={COLORS.orders}
                  strokeWidth={3}
                  dot={{ fill: COLORS.orders, r: 4 }}
                  activeDot={{ r: 6 }}
                  name="الطلبات"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="products"
                  stroke={COLORS.products}
                  strokeWidth={3}
                  dot={{ fill: COLORS.products, r: 4 }}
                  activeDot={{ r: 6 }}
                  name="المنتجات"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[400px] flex items-center justify-center">
              <p className="text-gold-300">لا توجد بيانات متاحة</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminAnalysis;
