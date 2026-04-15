import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/ui";
import styles from "./dashboard.module.css";

export default function DashboardPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.description}>Visualize and manage your client metrics.</p>
      </header>

      <div className={styles.metricsGrid}>
        <Card variant="glass">
          <CardHeader className="p-0">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
          </CardHeader>
          <CardContent className="p-0 mt-2">
            <div className={styles.value}>1,284</div>
            <p className={styles.trend}>+12% from last month</p>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader className="p-0">
            <CardTitle className="text-sm font-medium">Categorized</CardTitle>
          </CardHeader>
          <CardContent className="p-0 mt-2">
            <div className={styles.value}>1,120</div>
            <p className={styles.trend}>87.2% overall</p>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader className="p-0">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent className="p-0 mt-2">
            <div className={styles.value}>164</div>
            <p className={styles.trend}>-4% from yesterday</p>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader className="p-0">
            <CardTitle className="text-sm font-medium">Processing Time</CardTitle>
          </CardHeader>
          <CardContent className="p-0 mt-2">
            <div className={styles.value}>1.2s</div>
            <p className={styles.trend}>Avg per categorization</p>
          </CardContent>
        </Card>
      </div>

      <div className={styles.mainGrid}>
        <Card className={styles.chartCard} variant="glass">
          <CardHeader className="p-0">
            <CardTitle>Activity Overview</CardTitle>
            <CardDescription>Visual representation of categorization activity over time.</CardDescription>
          </CardHeader>
          <div className={styles.chartPlaceholder}>
            <span className="text-muted-foreground italic">Recharts visualization will be rendered here.</span>
          </div>
        </Card>

        <Card className={styles.activityCard} variant="glass">
          <CardHeader className="p-0">
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest client categorizations performed.</CardDescription>
          </CardHeader>
          <div className={styles.activityList}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={styles.activityItem}>
                <div className={styles.avatar}>C{i}</div>
                <div className={styles.itemInfo}>
                  <p className="font-medium">Client {i}</p>
                  <p className="text-xs text-muted-foreground">Updated {i * 2}m ago</p>
                </div>
                <div className={styles.badge}>High Value</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
