import { useState } from "react";
import { Download, Plus } from "lucide-react";
import { PageHeader } from "../../shell/page-header";
import { Bento } from "../../components/bento";
import { Button } from "../../components/button";
import { HeroCard } from "../../widgets/hero-card";
import { RangeSelect } from "../../widgets/range-select";
import type { Range } from "../../widgets/range-select";
import { ClosingSoonCard } from "./closing-soon-card";
import { CrmStats } from "./crm-stats";
import { DealsChartCard } from "./deals-chart-card";
import { PipelineCard } from "./pipeline-card";
import { RecentContactsCard } from "./recent-contacts-card";
import { TasksCard } from "./tasks-card";

export function CrmDashboard() {
  const [days, setDays] = useState<Range>(30);

  return (
    <>
      <PageHeader
        title="CRM"
        subtitle="Contacts, deals and what to do next. The numbers here are sample data."
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
          className="md:col-span-6 xl:col-span-12"
          illustration="shapes"
          title="Your pipeline is healthy"
          description="Two deals are about to close this week and two tasks are due today."
          actions={
            <>
              <Button>
                <Plus aria-hidden="true" />
                New deal
              </Button>
              <Button variant="outline">Add a contact</Button>
            </>
          }
        />

        <div className="contents [&>*]:md:col-span-3">
          <CrmStats days={days} />
        </div>

        <PipelineCard className="md:col-span-6 xl:col-span-12" />

        <ClosingSoonCard className="md:col-span-6 xl:col-span-8" />
        <TasksCard className="md:col-span-3 xl:col-span-4" />

        <DealsChartCard className="md:col-span-6 xl:col-span-7" />
        <RecentContactsCard className="md:col-span-3 xl:col-span-5" />
      </Bento>
    </>
  );
}
