import type { Meta, StoryObj } from "@storybook/react-vite";
import { CircleCheck, FileText, MessageSquare, Pencil } from "lucide-react";
import { Avatar, AvatarFallback } from "../components/avatar";
import { Badge } from "../components/badge";
import { Button } from "../components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/card";
import { SummaryFields } from "../components/records";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/tabs";
import { Timeline, TimelineItem } from "../components/timeline";
import { ConfirmDialog } from "../patterns/confirm-dialog";
import { PageHeader } from "../shell/page-header";
import { AppFrame } from "./app-frame";

const meta = {
  title: "Templates/DetailPage",
  parameters: { layout: "fullscreen", initialPath: "/projects" },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <AppFrame>
      <PageHeader
        title="Website redesign"
        subtitle="Owned by Ada Lovelace · updated 2 days ago"
        current="Website redesign"
        leading={
          <Avatar className="size-12">
            <AvatarFallback>WR</AvatarFallback>
          </Avatar>
        }
        actions={
          <>
            <ConfirmDialog
              trigger={<Button variant="outline">Archive</Button>}
              title="Archive “Website redesign”?"
              description="The project and its 14 files move to the archive. You can restore it later."
              confirmLabel="Archive project"
              onConfirm={() => {}}
            />
            <Button>
              <Pencil /> Edit
            </Button>
          </>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
                <CardDescription>The essentials of this project.</CardDescription>
              </CardHeader>
              <CardContent>
                <SummaryFields
                  values={[
                    ["Client", "Acme BV"],
                    ["Budget", "€48,000"],
                    ["Start", "3 March 2026"],
                    ["Deadline", "30 June 2026"],
                    ["Description", "A new marketing site and customer portal."],
                    ["Notes", ""],
                  ]}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="activity" className="pt-4">
            <Card>
              <CardContent className="p-6">
                <Timeline>
                  <TimelineItem title="Design approved" time="2 days ago" icon={<CircleCheck />}>
                    Ada signed off the homepage design.
                  </TimelineItem>
                  <TimelineItem title="Comment added" time="3 days ago" icon={<MessageSquare />}>
                    “Can we shorten the hero text?”
                  </TimelineItem>
                  <TimelineItem title="File uploaded" time="1 week ago" icon={<FileText />} last>
                    brand-guidelines.pdf
                  </TimelineItem>
                </Timeline>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="files" className="text-muted-foreground pt-4 text-sm">
            14 files.
          </TabsContent>
        </Tabs>
        <aside className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              <Badge variant="success" className="w-fit">
                On track
              </Badge>
              <p className="text-muted-foreground">Next milestone: launch review on 12 June.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Team</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {["Ada Lovelace", "Grace Hopper", "Alan Turing"].map((n) => (
                <div key={n} className="flex items-center gap-3 text-sm">
                  <Avatar className="size-8">
                    <AvatarFallback className="text-xs">
                      {n
                        .split(" ")
                        .map((p) => p[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {n}
                </div>
              ))}
            </CardContent>
          </Card>
        </aside>
      </div>
    </AppFrame>
  ),
};
