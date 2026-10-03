import clsx from 'clsx';

/** Small editorial index, e.g. "(01) — The Couple". */
export function SectionLabel({
  index,
  children,
  className,
}: {
  index: string;
  children: string;
  className?: string;
}) {
  return (
    <p className={clsx('label flex items-center gap-4', className)}>
      <span className="font-serif text-sm normal-case italic tracking-normal">({index})</span>
      <span aria-hidden className="h-px w-10 bg-current opacity-40" />
      <span>{children}</span>
    </p>
  );
}
