type PageHeaderProps = {
  name?: string;
  isDemo?: boolean;
  showTitle?: boolean;
};

export default function PageHeader({
  name,
  isDemo = false,
  showTitle = true,
}: PageHeaderProps) {
  return (
    <div className="space-y-4 pr-5">
      {showTitle && name ? (
        <h1 className="mb-2 text-2xl font-semibold">{name}</h1>
      ) : null}

      {isDemo ? (
        <div className="mb-3 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-300">
          You are viewing demo data. Sign in to view your own {name ?? "data"}.
        </div>
      ) : null}
    </div>
  );
}
