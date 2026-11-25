import { Badge } from "../../components/badge";

/** A small badge for someone's job or role, such as "Designer". */
export const RoleBadgeText = ({ role }: Readonly<{ role: string }>) => (
  <Badge variant="secondary">{role}</Badge>
);
