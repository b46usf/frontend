import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const itemKey = (item, index) => item?.id ?? item?.user_id ?? item?.name ?? `${index}`;

const mergeUnique = (current, incoming) => {
  const seen = new Set(current.map(itemKey));
  const next = [...current];

  incoming.forEach((item, index) => {
    const key = itemKey(item, index);

    if (!seen.has(key)) {
      seen.add(key);
      next.push(item);
    }
  });

  return next;
};

const normalizeMeta = (meta, itemCount, pageSize) => {
  const limit = Number(meta?.limit || pageSize);
  const total = Number(meta?.total ?? itemCount);
  const page = Number(meta?.page || 1);
  const totalPages = Number(meta?.totalPages || (limit ? Math.ceil(total / limit) : 1));

  return {
    total,
    count: Number(meta?.count ?? itemCount),
    page,
    limit,
    totalPages,
    hasNextPage: Boolean(meta?.hasNextPage ?? itemCount >= pageSize),
    hasPreviousPage: Boolean(meta?.hasPreviousPage ?? page > 1),
  };
};

export function useInfiniteCollection({
  enabled = true,
  fetchPage,
  initialItems = [],
  initialMeta,
  pageSize = 8,
  resetKey = 'collection',
}) {
  const sentinelRef = useRef(null);
  const requestRef = useRef(0);
  const initialItemsKey = useMemo(
    () => initialItems.map((item, index) => itemKey(item, index)).join('|'),
    [initialItems],
  );
  const initialMetaKey = useMemo(() => JSON.stringify(initialMeta || {}), [initialMeta]);
  const [items, setItems] = useState(initialItems);
  const [meta, setMeta] = useState(() => normalizeMeta(initialMeta, initialItems.length, pageSize));
  const [isLoadingInitial, setIsLoadingInitial] = useState(enabled && initialItems.length === 0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const loadPage = useCallback(
    async (page, mode = 'append') => {
      if (!enabled || !fetchPage) return;

      const requestId = requestRef.current + 1;
      requestRef.current = requestId;

      if (mode === 'replace') {
        setIsLoadingInitial(true);
      } else {
        setIsLoadingMore(true);
      }

      setError(null);

      try {
        const response = await fetchPage({ page, limit: pageSize });
        const nextItems = response?.data || response || [];
        const nextMeta = normalizeMeta(response?.meta, nextItems.length, pageSize);

        if (requestRef.current !== requestId) return;

        setItems((current) => (mode === 'replace' ? nextItems : mergeUnique(current, nextItems)));
        setMeta(nextMeta);
      } catch (nextError) {
        if (requestRef.current === requestId) {
          setError(nextError);
        }
      } finally {
        if (requestRef.current === requestId) {
          setIsLoadingInitial(false);
          setIsLoadingMore(false);
        }
      }
    },
    [enabled, fetchPage, pageSize],
  );

  useEffect(() => {
    const nextItems = [...initialItems];
    const nextMeta = normalizeMeta(initialMeta, nextItems.length, pageSize);

    requestRef.current += 1;
    setItems(nextItems);
    setMeta(nextMeta);
    setError(null);
    setIsLoadingMore(false);
    setIsLoadingInitial(enabled && nextItems.length === 0);

    if (enabled && nextItems.length === 0) {
      loadPage(1, 'replace');
    }
  }, [enabled, initialItemsKey, initialMetaKey, loadPage, pageSize, resetKey]);

  const hasNextPage = Boolean(meta.hasNextPage);
  const loadMore = useCallback(() => {
    if (!hasNextPage || isLoadingInitial || isLoadingMore) return;
    loadPage((meta.page || 1) + 1);
  }, [hasNextPage, isLoadingInitial, isLoadingMore, loadPage, meta.page]);

  useEffect(() => {
    const target = sentinelRef.current;

    if (!enabled || !target || !hasNextPage || isLoadingInitial || isLoadingMore) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: '180px 0px' },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [enabled, hasNextPage, isLoadingInitial, isLoadingMore, loadMore]);

  return {
    error,
    hasNextPage,
    isLoadingInitial,
    isLoadingMore,
    items,
    loadMore,
    meta,
    sentinelRef,
  };
}
