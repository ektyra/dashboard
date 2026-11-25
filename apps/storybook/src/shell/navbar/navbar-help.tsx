import { CircleHelp } from "lucide-react";
import { IconButton } from "../../components/icon-button";

export function NavbarHelp() {
  return (
    <IconButton label="Help">
      <CircleHelp aria-hidden="true" />
    </IconButton>
  );
}
