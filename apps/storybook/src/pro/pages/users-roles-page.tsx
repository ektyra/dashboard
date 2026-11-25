import { Plus } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "../../components/avatar";
import { Badge } from "../../components/badge";
import { Button } from "../../components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/card";
import { Checkbox } from "../../components/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/dialog";
import { Field, FieldLabel } from "../../components/field";
import { Input } from "../../components/input";
import { NativeSelect } from "../../components/native-select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/tabs";
import { PageHeader } from "../../shell/page-header";
import { notify } from "../../toast";

const roles = ["Admin", "Editor", "Viewer"] as const;
type Role = (typeof roles)[number];
const people: { name: string; email: string; role: Role; status: "Active" | "Invited" }[] = [
  { name: "Ada Lovelace", email: "ada@example.com", role: "Admin", status: "Active" },
  { name: "Grace Hopper", email: "grace@example.com", role: "Editor", status: "Active" },
  { name: "Alan Turing", email: "alan@example.com", role: "Viewer", status: "Invited" },
];
const permissions = [
  "View reports",
  "Edit reports",
  "Manage people",
  "Manage billing",
  "Delete data",
] as const;
const initialMatrix: Record<Role, Set<string>> = {
  Admin: new Set(permissions),
  Editor: new Set(["View reports", "Edit reports"]),
  Viewer: new Set(["View reports"]),
};

export function UsersRolesPage() {
  const [users, setUsers] = useState(people);
  const [matrix, setMatrix] = useState(initialMatrix);
  return (
    <>
      <PageHeader
        title="People and roles"
        subtitle="Who can do what."
        actions={
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus /> Invite person
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite a person</DialogTitle>
                <DialogDescription>They get an email with a link to join.</DialogDescription>
              </DialogHeader>
              <Field>
                <FieldLabel htmlFor="inv-email">Email</FieldLabel>
                <Input id="inv-email" type="email" placeholder="name@example.com" />
              </Field>
              <Field>
                <FieldLabel htmlFor="inv-role">Role</FieldLabel>
                <NativeSelect id="inv-role" defaultValue="Viewer">
                  {roles.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </NativeSelect>
              </Field>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button onClick={() => notify.success("Invitation sent")}>Send invitation</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      <Tabs defaultValue="people">
        <TabsList>
          <TabsTrigger value="people">People</TabsTrigger>
          <TabsTrigger value="roles">Roles and permissions</TabsTrigger>
        </TabsList>
        <TabsContent value="people" className="pt-4">
          <Card>
            <CardContent className="p-0">
              <Table aria-label="People" wrapperClassName="border-0">
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.email}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8">
                            <AvatarFallback className="text-xs">
                              {u.name
                                .split(" ")
                                .map((p) => p[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm">{u.name}</p>
                            <p className="text-muted-foreground text-xs">{u.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="w-32">
                          <NativeSelect
                            aria-label={`Role of ${u.name}`}
                            value={u.role}
                            onChange={(e) =>
                              setUsers((all) =>
                                all.map((x) =>
                                  x.email === u.email ? { ...x, role: e.target.value as Role } : x,
                                ),
                              )
                            }
                          >
                            {roles.map((r) => (
                              <option key={r}>{r}</option>
                            ))}
                          </NativeSelect>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={u.status === "Active" ? "success" : "info"}>
                          {u.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="roles" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Permission matrix</CardTitle>
              <CardDescription>
                Tick what each role may do. Admins always keep full access.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table aria-label="Permissions by role" wrapperClassName="border-0">
                <TableHeader>
                  <TableRow>
                    <TableHead>Permission</TableHead>
                    {roles.map((r) => (
                      <TableHead key={r} className="text-center">
                        {r}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissions.map((p) => (
                    <TableRow key={p}>
                      <TableCell>{p}</TableCell>
                      {roles.map((r) => (
                        <TableCell key={r} className="text-center">
                          <Checkbox
                            aria-label={`${r} can ${p.toLowerCase()}`}
                            checked={matrix[r].has(p)}
                            disabled={r === "Admin"}
                            onCheckedChange={(v) =>
                              setMatrix((m) => {
                                const next = new Set(m[r]);
                                if (v === true) next.add(p);
                                else next.delete(p);
                                return { ...m, [r]: next };
                              })
                            }
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
