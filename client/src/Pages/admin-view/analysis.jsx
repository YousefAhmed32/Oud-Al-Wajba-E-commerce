import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAdminDashboardSummary } from "@/store/admin/analysis";
import { BarChart3, ShoppingCart, DollarSign, Users, LayoutDashboard } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
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

function AdminAnalysis() {
  const dispatch = useDispatch();
  const { loading, summary, error } = useSelector((state) => state.adminAnalysis);
  const [timeframe, setTimeframe] = useState("monthly");

  useEffect(() => {
    dispatch(getAdminDashboardSummary(timeframe));
  }, [dispatch, timeframe]);

  if (loading) return <p className="text-gray-300 p-4">Loading...</p>;
  if (error) return <p className="text-red-500 p-4">{error}</p>;
  if (!summary) return <p className="text-yellow-400 p-4">No data available yet.</p>;

  const chartData = summary?.chartData || [];

  const getTimeframeLabel = () => {
    switch (timeframe) {
      case "monthly": return "30 days";
      case "weekly": return "7 days";
      case "daily": return "24 hours";
      case "hour": return "60 minutes";
      case "yearly": return "yearly";
      case "all": return "since launch";
      default: return "";
    }
  };

  return (
    <div className="p-0 shadow-black shadow-xl space-y-6 rounded-[24px]  min-h-screen text-gray-200">
      {/* Header */}
      <div className="backdrop-blur-md bg-black/30 border border-white/10 rounded-3xl p-6 shadow-[0_0_25px_rgba(0,255,150,0.1)] space-y-6">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-100">
          <LayoutDashboard  className="text-emerald-400 drop-shadow-[0_0_10px_#00ff99]" /> Admin Dashboard
          {/* <BarChart3 className="text-emerald-400 drop-shadow-[0_0_10px_#00ff99]" /> Admin Dashboard */}

        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              label: "Total Users",
              value: summary.totalUsers,
              icon: <Users className="text-blue-400 drop-shadow-[0_0_8px_#3b82f6]" />,
            },
            {
              label: "Products",
              value: summary.totalProducts,
              icon: <ShoppingCart className="text-pink-400 drop-shadow-[0_0_8px_#ff57bb]" />,
            },
            {
              label: "Orders",
              value: summary.totalOrders,
              icon: <ShoppingCart className="text-yellow-400 drop-shadow-[0_0_8px_#facc15]" />,
            },
            {
              label: "Revenue",
              value: `$${summary.totalRevenue}`,
              icon: <DollarSign className="text-emerald-400 drop-shadow-[0_0_8px_#00ff99]" />,
            },
          ].map(({ label, value, icon }, idx) => (
            <div
              key={idx}
              className="bg-black/40 border border-white/10 rounded-2xl p-5 hover:shadow-[0_0_20px_rgba(0,255,150,0.2)] transition-all duration-300 hover:border-emerald-400/30"
            >
              <div className="text-sm text-gray-400 flex items-center gap-2 justify-between">
                <div className="flex gap-2">{icon} {label}</div>
                <span className="text-gray-500">{getTimeframeLabel()}</span>
              </div>
              <div className="text-2xl font-extrabold mt-2 text-gray-100">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-black/40 border border-white/10 backdrop-blur-md rounded-3xl p-6 shadow-[0_0_15px_rgba(0,255,150,0.1)]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-100 ms-5">Revenue Overview</h2>
          <Select value={timeframe} onValueChange={(value) => setTimeframe(value)}>
            <SelectTrigger className="bg-black/50 text-gray-100 px-4 py-2 rounded-md border border-white/20 hover:border-emerald-400/40">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Timeframe</SelectLabel>
                {[
                  { value: "monthly", label: "Monthly (30d)" },
                  { value: "weekly", label: "Weekly (7d)" },
                  { value: "daily", label: "Today (24h)" },
                  { value: "hour", label: "Last 60 Minutes" },
                  { value: "yearly", label: "Yearly (12 months)" },
                  { value: "all", label: "Since Launch" },
                ].map((option) => (
                  <SelectItem key={option.value} className="text-black" value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 5" stroke="#333" />
            <XAxis dataKey="label" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip
              contentStyle={{ backgroundColor: "#111", borderColor: "#00ff99" }}
              labelStyle={{ color: "#00ff99" }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#00ff99"
              strokeWidth={3}
              dot={{ fill: "#00ff99" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Users Chart */}
      <div className="bg-black/40 border border-white/10 backdrop-blur-md rounded-3xl p-6 shadow-inner mt-6">
        <h2 className="text-2xl font-semibold text-gray-100 mb-4">User Registrations</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 5" stroke="#333" />
            <XAxis dataKey="label" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip
              contentStyle={{ backgroundColor: "#111", borderColor: "#3b82f6" }}
              labelStyle={{ color: "#3b82f6" }}
            />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: "#3b82f6" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Orders Chart */}
      <div className="bg-black/40 border border-white/10 backdrop-blur-md rounded-3xl p-6 shadow-inner mt-6">
        <h2 className="text-2xl font-semibold text-gray-100 mb-4">Orders Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 5" stroke="#333" />
            <XAxis dataKey="label" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip
              contentStyle={{ backgroundColor: "#111", borderColor: "#facc15" }}
              labelStyle={{ color: "#facc15" }}
            />
            <Line
              type="monotone"
              dataKey="orders"
              stroke="#facc15"
              strokeWidth={3}
              dot={{ fill: "#facc15" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Products Chart */}
      <div className="bg-black/40 border border-white/10 backdrop-blur-md rounded-3xl p-6 shadow-inner mt-6">
        <h2 className="text-2xl font-semibold text-gray-100 mb-4">Products Added</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 5" stroke="#333" />
            <XAxis dataKey="label" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip
              contentStyle={{ backgroundColor: "#111", borderColor: "#ff57bb" }}
              labelStyle={{ color: "#ff57bb" }}
            />
            <Line
              type="monotone"
              dataKey="products"
              stroke="#ff57bb"
              strokeWidth={3}
              dot={{ fill: "#ff57bb" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AdminAnalysis;
