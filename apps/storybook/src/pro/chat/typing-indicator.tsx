/** Three bouncing dots for "someone is typing". Still, not bouncing, when reduced motion is on. */
export function TypingIndicator({ name }: Readonly<{ name: string }>) {
  return (
    <div className="flex items-start" role="status">
      <span className="sr-only">{name} is typing</span>
      <span
        aria-hidden="true"
        className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-muted px-4 py-3"
      >
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="size-1.5 animate-bounce rounded-full bg-muted-foreground motion-reduce:animate-none"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </span>
    </div>
  );
}
