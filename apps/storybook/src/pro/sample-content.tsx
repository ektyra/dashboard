import { Button } from "../components/button";
import { Badge } from "../components/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/card";
import { Input } from "../components/input";
import { Switch } from "../components/switch";

/** Something small to repaint while the theme changes. */
export function SamplePageContent() {
  return (
    <div className="mx-auto grid max-w-3xl gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl tracking-tight">Make it yours</h1>
        <p className="text-muted-foreground">
          Open the customizer (bottom right) and change colors, radius and palette.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Preview card</CardTitle>
          <CardDescription>Buttons, badges, inputs and switches follow the theme.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Badge>New</Badge>
          <Badge variant="success">Paid</Badge>
          <Input placeholder="Type here" className="w-48" />
          <Switch defaultChecked aria-label="Example switch" />
        </CardContent>
      </Card>
    </div>
  );
}
