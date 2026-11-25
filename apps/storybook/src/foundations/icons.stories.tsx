import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Bell,
  Calendar,
  Check,
  ChevronRight,
  CircleAlert,
  Cloud,
  CreditCard,
  Download,
  File,
  Folder,
  Heart,
  House,
  Image,
  Info,
  Mail,
  Menu,
  MessageSquare,
  Plus,
  Search,
  Settings,
  Star,
  Trash2,
  Upload,
  User,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { AnimatedIcon, AnimatedIconTile, type IconAnimation } from "../components/animated-icon";
import { DuotoneIcon, type DuotoneTone } from "../components/duotone-icon";

const meta = {
  title: "Foundations/Icons",
  parameters: { layout: "padded" },
} satisfies Meta;
export default meta;

const common: [string, LucideIcon][] = [
  ["House", House],
  ["Search", Search],
  ["Settings", Settings],
  ["User", User],
  ["Users", Users],
  ["Bell", Bell],
  ["Mail", Mail],
  ["Calendar", Calendar],
  ["MessageSquare", MessageSquare],
  ["Folder", Folder],
  ["File", File],
  ["Image", Image],
  ["Cloud", Cloud],
  ["CreditCard", CreditCard],
  ["Star", Star],
  ["Heart", Heart],
  ["Plus", Plus],
  ["Check", Check],
  ["X", X],
  ["Menu", Menu],
  ["ChevronRight", ChevronRight],
  ["Download", Download],
  ["Upload", Upload],
  ["Trash2", Trash2],
  ["Info", Info],
  ["CircleAlert", CircleAlert],
];

const tones: DuotoneTone[] = ["primary", "success", "warning", "info", "destructive", "mixed"];

const animated: [IconAnimation, LucideIcon][] = [
  ["ring", Bell],
  ["beat", Heart],
  ["spin", Settings],
  ["nudge", ChevronRight],
  ["bounce", Download],
  ["pop", Star],
  ["wiggle", Mail],
  ["drop", Trash2],
];

export const Icons: StoryObj = {
  render: () => (
    <div className="text-foreground flex flex-col gap-10 p-2">
      <section>
        <h3 className="mb-1 text-lg font-semibold">Lucide</h3>
        <p className="text-muted-foreground mb-4 text-sm">
          One icon set for the whole product: <code>lucide-react</code>. A selection is shown here.
          Default size 20 px, stroke 1.75 to 2.
        </p>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-3">
          {common.map(([name, Icon]) => (
            <div
              key={name}
              className="border-border bg-card flex flex-col items-center gap-2 rounded-lg border p-4"
            >
              <Icon size={20} aria-hidden="true" />
              <code className="text-muted-foreground text-xs">{name}</code>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h3 className="mb-1 text-lg font-semibold">DuotoneIcon</h3>
        <p className="text-muted-foreground mb-4 text-sm">
          Outline plus a soft tint. Works best on closed shapes (heart, folder, bell).
        </p>
        <div className="flex flex-wrap gap-6">
          {tones.map((tone) => (
            <div key={tone} className="flex flex-col items-center gap-2">
              <DuotoneIcon icon={Folder} tone={tone} size={36} />
              <code className="text-muted-foreground text-xs">{tone}</code>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h3 className="mb-1 text-lg font-semibold">AnimatedIcon</h3>
        <p className="text-muted-foreground mb-4 text-sm">
          Hover, focus or tap a tile. Animations stay still when the system asks for reduced motion.
        </p>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-3">
          {animated.map(([animation, Icon]) => (
            <AnimatedIconTile key={animation} label={animation}>
              <AnimatedIcon icon={Icon} animation={animation} />
            </AnimatedIconTile>
          ))}
        </div>
      </section>
    </div>
  ),
};
