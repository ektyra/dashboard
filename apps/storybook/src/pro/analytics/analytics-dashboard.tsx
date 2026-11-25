import { useState } from "react";
import { Download, Plus } from "lucide-react";
import { PageHeader } from "../../shell/page-header";
import { Bento } from "../../components/bento";
import { Button } from "../../components/button";
import { HeroCard } from "../../widgets/hero-card";
import { RangeSelect } from "../../widgets/range-select";
import type { Range } from "../../widgets/range-select";
import { AnalyticsStats } from "./analytics-stats";
import { EditingHeatmapCard } from "./editing-heatmap-card";
import { RecentActivityCard } from "./recent-activity-card";
import { RecentEntriesCard } from "./recent-entries-card";
import { SiteHealthCard } from "./site-health-card";
import { SourcesCard } from "./sources-card";
import { TopAuthorsCard } from "./top-authors-card";
import { TopPagesCard } from "./top-pages-card";
import { TrafficCard } from "./traffic-card";

export function AnalyticsDashboard() {
  const [days, setDays] = useState<Range>(30);

  return (
    <>
      <PageHeader
        title="Analytics"
        subtitle="How your content is doing. The numbers here are sample data."
        actions={
          <>
            <RangeSelect value={days} onChange={setDays} />
            <Button variant="outline">
              <Download aria-hidden="true" />
              Export
            </Button>
          </>
        }
      />
      <Bento>
        <HeroCard
          className="md:col-span-6 xl:col-span-8"
          illustration="mountains"
          title="Welcome back"
          description="Reads are up this period. Search brings the most visitors, and your newest article is the one to watch."
          actions={
            <>
              <Button>
                <Plus aria-hidden="true" />
                New entry
              </Button>
              <Button variant="outline">View report</Button>
            </>
          }
        />
        <SiteHealthCard className="md:col-span-6 xl:col-span-4" />

        <div className="contents [&>*]:md:col-span-3">
          <AnalyticsStats days={days} />
        </div>

        <TrafficCard days={days} className="md:col-span-6 xl:col-span-8" />
        <SourcesCard days={days} className="md:col-span-6 xl:col-span-4" />

        <TopPagesCard days={days} className="md:col-span-3 xl:col-span-4" />
        <EditingHeatmapCard className="md:col-span-3 xl:col-span-4" />
        <RecentActivityCard className="md:col-span-6 xl:col-span-4" />

        <RecentEntriesCard className="md:col-span-6 xl:col-span-8" />
        <TopAuthorsCard days={days} className="md:col-span-6 xl:col-span-4" />
      </Bento>
    </>
  );
}
