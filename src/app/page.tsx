import { Button, Card, CardContent, CardHeader, CardTitle } from "@/ui";
import { ArrowRight, BarChart3, Database, Cpu } from "lucide-react";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.title}>
          Intelligent <span className="gradient-text">Client Categorization</span>
        </h1>
        <p className={styles.subtitle}>
          Harness the power of strategy-pattern LLMs and custom metrics to organize and analyze your client data with precision.
        </p>
        <div className={styles.actions}>
          <Button size="lg">
            Get Started <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="lg">
            View Documentation
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className={styles.features}>
        <Card variant="glass" className={styles.featureCard}>
          <div className={styles.iconWrapper}>
            <Cpu className="w-6 h-6" />
          </div>
          <CardHeader className="p-0">
            <CardTitle>LLM Strategy</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <p className="text-muted-foreground text-sm">
              Multiple providers with automated fallback. Switch between OpenAI, Anthropic and more seamlessly.
            </p>
          </CardContent>
        </Card>

        <Card variant="glass" className={styles.featureCard}>
          <div className={styles.iconWrapper}>
            <Database className="w-6 h-6" />
          </div>
          <CardHeader className="p-0">
            <CardTitle>SQL Foundation</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <p className="text-muted-foreground text-sm">
              Robust PostgreSQL database managed with Prisma. Optimized for complex client data structures.
            </p>
          </CardContent>
        </Card>

        <Card variant="glass" className={styles.featureCard}>
          <div className={styles.iconWrapper}>
            <BarChart3 className="w-6 h-6" />
          </div>
          <CardHeader className="p-0">
            <CardTitle>Dynamic Metrics</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <p className="text-muted-foreground text-sm">
              Real-time visualization of categorization performance and client distribution.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
