import { motion } from "framer-motion";
import { Link, Download, Scan, Clock, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/Card";
import { ProgressBar, CircularProgress } from "@/components/ProgressBar";
import { mockStats } from "@/data/mockData";

export function StatsTab() {
  const stats = mockStats;
  const processed = stats.downloaded + stats.scraped;

  const statCards = [
    { label: "Total Links", value: stats.totalLinks, icon: Link, color: "text-foreground" },
    { label: "Downloaded", value: stats.downloaded, icon: Download, color: "text-info" },
    { label: "Scraped", value: stats.scraped, icon: Scan, color: "text-success" },
    { label: "Pending", value: stats.pending, icon: Clock, color: "text-warning" },
  ];

  return (
    <div className="px-4 py-6 pb-24 space-y-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2"
      >
        <TrendingUp className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Statistics</h1>
      </motion.div>

      {/* Progress Card */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-foreground">Completion Progress</h2>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <CircularProgress value={processed} max={stats.totalLinks} size={140} />
          </div>
          <div className="mt-4">
            <ProgressBar value={processed} max={stats.totalLinks} showLabel={false} size="lg" />
          </div>
          <p className="text-center text-sm text-muted-foreground mt-3">
            {processed.toLocaleString()} of {stats.totalLinks.toLocaleString()} links processed
          </p>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card animate={false}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-muted">
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {stat.value.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Chart Card */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-foreground">Links Added Per Day</h2>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.dailyLinks}>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <YAxis hide />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {stats.dailyLinks.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        index === stats.dailyLinks.length - 4
                          ? "hsl(var(--primary))"
                          : "hsl(var(--muted))"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
