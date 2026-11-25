import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@ektyra/ui";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Ektyra</h1>
      <Button className="mt-4">Get started</Button>
    </div>
  );
}
