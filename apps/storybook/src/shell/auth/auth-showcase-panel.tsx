import { Image, Layers, MessageCircle, Zap } from "lucide-react";

const features = [
  { icon: Layers, title: "Content models", text: "Define your content, your way." },
  { icon: Image, title: "Media library", text: "Organize, optimize, and reuse assets." },
  { icon: MessageCircle, title: "Comments", text: "Discuss drafts right where the work happens." },
  {
    icon: Zap,
    title: "Publishing workflow",
    text: "Draft, review, schedule, and publish with confidence.",
  },
];

/**
 * The picture side of the auth layout: full height, edge to edge. The artwork has
 * a light and a dark version and switches with the theme. It stays in view while
 * the form side scrolls. Hidden below `lg`, where the form gets the whole screen.
 */
export function AuthShowcasePanel() {
  return (
    <aside
      aria-label="About Ektyra"
      className="relative isolate hidden h-dvh overflow-hidden lg:sticky lg:top-0 lg:flex lg:items-center"
    >
      <img
        src="/illustrations/auth-light.webp"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-10 size-full object-cover object-right grayscale dark:hidden"
      />
      <img
        src="/illustrations/auth-dark.webp"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-10 hidden size-full object-cover object-right grayscale dark:block"
      />
      {/*
        The artwork is the same picture for every project. It is shown without colour and tinted with
        the primary colour: the "color" blend keeps its light and shadow and only takes the hue, so
        it follows the palette and the brand colour in light and dark mode.
      */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-primary mix-blend-color" />
      <div className="grid max-w-2xl gap-10 px-12 py-12 xl:px-20">
        <div className="grid justify-items-start gap-6">
          <span className="rounded-full bg-primary px-4 py-1.5 text-sm text-primary-foreground">
            A next-generation CMS
          </span>
          <div className="grid max-w-xl gap-4">
            <h2 className="text-4xl leading-[1.1] tracking-tight xl:text-5xl">
              Build, manage, and publish without limits.
            </h2>
            <span className="h-1 w-24 rounded-full bg-primary" aria-hidden="true" />
          </div>
          <p className="max-w-md text-foreground/75">
            A modern, developer-friendly platform for content teams, creators, and agencies.
          </p>
        </div>
        <ul className="grid gap-5">
          {features.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-center gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-border/60 bg-card/50 text-foreground backdrop-blur">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="grid gap-0.5">
                <span>{title}</span>
                <span className="text-sm text-foreground/70">{text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
