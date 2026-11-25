import type { Meta, StoryObj } from "@storybook/react-vite";
import { Container } from "../components/container";
import { Grid } from "../components/grid";
import { Stack } from "../components/stack";

const Box = ({ children }: { children?: React.ReactNode }) => (
  <div className="bg-accent text-accent-foreground border-primary/30 grid min-h-14 place-items-center rounded-md border px-3 text-sm">
    {children}
  </div>
);

const meta = {
  title: "Layout/Container, Grid and Stack",
  parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;

type Story = StoryObj;

export const ContainerSizes: Story = {
  name: "Container sizes",
  render: () => (
    <div className="flex flex-col gap-6 py-6">
      {(["narrow", "default", "fluid"] as const).map((size) => (
        <Container key={size} size={size}>
          <Box>{size}</Box>
        </Container>
      ))}
    </div>
  ),
};

export const GridColumns: Story = {
  name: "Grid (resize the viewport)",
  render: () => (
    <Container className="py-6">
      <div className="flex flex-col gap-8">
        {([2, 3, 4] as const).map((columns) => (
          <div key={columns}>
            <p className="text-muted-foreground mb-2 text-xs">
              columns={columns}: 1 on phone, 2 on tablet
            </p>
            <Grid columns={columns}>
              {Array.from({ length: columns * 2 }, (_, i) => (
                <Box key={i}>{i + 1}</Box>
              ))}
            </Grid>
          </div>
        ))}
      </div>
    </Container>
  ),
};

export const StackDirections: Story = {
  name: "Stack",
  render: () => (
    <Container className="py-6">
      <div className="flex flex-col gap-8">
        <div>
          <p className="text-muted-foreground mb-2 text-xs">vertical, gap 3</p>
          <Stack gap={3}>
            <Box>One</Box>
            <Box>Two</Box>
            <Box>Three</Box>
          </Stack>
        </div>
        <div>
          <p className="text-muted-foreground mb-2 text-xs">horizontal, space between</p>
          <Stack direction="horizontal" justify="between" align="center">
            <Box>Left</Box>
            <Box>Middle</Box>
            <Box>Right</Box>
          </Stack>
        </div>
        <div>
          <p className="text-muted-foreground mb-2 text-xs">horizontal, wrap</p>
          <Stack direction="horizontal" wrap gap={2}>
            {Array.from({ length: 14 }, (_, i) => (
              <div key={i} className="w-28">
                <Box>{i + 1}</Box>
              </div>
            ))}
          </Stack>
        </div>
      </div>
    </Container>
  ),
};
