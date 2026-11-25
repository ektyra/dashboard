import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { CommentThread, type Comment, type Person } from "../components/comment-thread";
import { RichTextEditor } from "../components/rich-text-editor";

const people: Person[] = [
  { id: "1", name: "Ada Lovelace" },
  { id: "2", name: "Grace Hopper" },
  { id: "3", name: "Alan Turing" },
  { id: "4", name: "Margaret Hamilton" },
];

const meta = {
  title: "Inputs & Forms/Rich text with comments (Pro)",
  parameters: { layout: "padded" },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const DocumentWithComments: Story = {
  name: "Document with comments and mentions",
  render: () => {
    const [comments, setComments] = useState<Comment[]>([
      {
        id: "c1",
        author: people[1]!,
        text: "Can we shorten the second paragraph? @Ada what do you think?",
        at: "2 hours ago",
      },
      {
        id: "c2",
        author: people[0]!,
        text: "Agreed. @Alan can you check the numbers too?",
        at: "1 hour ago",
      },
    ]);
    return (
      <div className="grid max-w-5xl gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <RichTextEditor
          label="Report"
          content="<h2>Quarterly report</h2><p>Revenue grew by <strong>12%</strong> compared with last quarter, driven by new customers in Germany.</p><p>Costs stayed flat. See the appendix for the full breakdown.</p>"
        />
        <CommentThread
          comments={comments}
          people={people}
          me={people[2]!}
          onAdd={(text) =>
            setComments((c) => [
              ...c,
              { id: `c${c.length + 1}`, author: people[2]!, text, at: "Just now" },
            ])
          }
        />
      </div>
    );
  },
};

export const ThreadOnly: Story = {
  render: () => {
    const [comments, setComments] = useState<Comment[]>([]);
    return (
      <div className="w-80 pt-24">
        <CommentThread
          comments={comments}
          people={people}
          me={people[0]!}
          onAdd={(text) =>
            setComments((c) => [
              ...c,
              { id: String(c.length), author: people[0]!, text, at: "Just now" },
            ])
          }
        />
      </div>
    );
  },
};
