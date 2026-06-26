"use client";

import { Loader2, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type SearchItem = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
};

type SearchGroup = {
  label: string;
  items: SearchItem[];
};

type SearchResponse = {
  query: string;
  groups: SearchGroup[];
};

function useDebouncedValue<T>(value: T, delay = 250) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function GlobalSearch() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [results, setResults] = useState<SearchGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedQuery = useDebouncedValue(query, 250);

  const flatResults = useMemo(() => {
    return results.flatMap((group) => group.items);
  }, [results]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setIsLoading(false);
      setActiveIndex(0);
      return;
    }

    let isCancelled = false;

    async function runSearch() {
      try {
        setIsLoading(true);

        const response = await fetch(
          `/api/search?q=${encodeURIComponent(debouncedQuery.trim())}`,
        );

        if (!response.ok) {
          throw new Error("Search request failed");
        }

        const data = (await response.json()) as SearchResponse;

        if (!isCancelled) {
          setResults(data.groups);
          setActiveIndex(0);
        }
      } catch (error) {
        if (!isCancelled) {
          setResults([]);
        }
        console.error("Global search failed", error);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void runSearch();

    return () => {
      isCancelled = true;
    };
  }, [debouncedQuery]);

  function handleSelect(item: SearchItem) {
    setOpen(false);
    setQuery("");
    router.push(item.href);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!open && (event.key === "ArrowDown" || event.key === "Enter")) {
      setOpen(true);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) =>
        flatResults.length === 0 ? 0 : (current + 1) % flatResults.length,
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) =>
        flatResults.length === 0
          ? 0
          : (current - 1 + flatResults.length) % flatResults.length,
      );
    }

    if (event.key === "Enter") {
      event.preventDefault();

      const selectedItem = flatResults[activeIndex];
      if (selectedItem) {
        handleSelect(selectedItem);
      }
    }

    if (event.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-sm md:max-w-md">
      <input
        type="search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Search"
        aria-label="Global search"
        className="w-full rounded-lg border-2 border-gray-300 bg-gray-100 py-2 pl-10 pr-10 focus:border-transparent focus:outline-none focus:ring-1 focus:ring-blue-400 dark:border-zinc-700 dark:bg-zinc-900"
      />

      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="text-gray-500" size={20} />
      </div>

      {isLoading ? (
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
        </div>
      ) : null}

      {open ? (
        <div className="absolute left-0 top-[calc(100%+0.5rem)] z-50 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
          {!query.trim() ? (
            <div className="px-4 py-3 text-sm text-gray-500 dark:text-zinc-400">
              Search products, inventory, and sales.
            </div>
          ) : flatResults.length === 0 && !isLoading ? (
            <div className="px-4 py-3 text-sm text-gray-500 dark:text-zinc-400">
              No results found.
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto py-2">
              {results.map((group) => (
                <div key={group.label}>
                  <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-zinc-500">
                    {group.label}
                  </div>

                  {group.items.map((item, index) => {
                    const itemIndex = flatResults.findIndex(
                      (flatItem) => flatItem.href === item.href,
                    );

                    return (
                      <button
                        key={`${group.label}-${item.id}-${index}`}
                        type="button"
                        onClick={() => handleSelect(item)}
                        className={`flex w-full flex-col px-4 py-3 text-left transition ${
                          itemIndex === activeIndex
                            ? "bg-blue-50 dark:bg-zinc-900"
                            : "hover:bg-gray-50 dark:hover:bg-zinc-900"
                        }`}
                      >
                        <span className="text-sm font-medium text-gray-900 dark:text-zinc-100">
                          {item.title}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-zinc-400">
                          {item.subtitle}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
