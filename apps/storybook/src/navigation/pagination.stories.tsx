import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Pagination } from "../components/pagination";

const meta = { title: "Navigation/Pagination", component: Pagination } satisfies Meta<
  typeof Pagination
>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { page: 1, pageCount: 10, onPageChange: () => {} },
  render: (args) => {
    const [page, setPage] = useState(args.page);
    return <Pagination {...args} page={page} onPageChange={setPage} />;
  },
};

export const FewPages: Story = {
  args: { page: 2, pageCount: 3, onPageChange: () => {} },
  render: Default.render,
};

export const ManyPages: Story = {
  args: { page: 25, pageCount: 80, onPageChange: () => {} },
  render: Default.render,
};
