import { RefObject, useEffect, useRef } from "react";

export const useInfiniteScroll = (
	ref: RefObject<HTMLElement | null>,
	onLoadMore: () => void,
	{ hasNextPage, isFetchingNextPage }: { hasNextPage: boolean; isFetchingNextPage: boolean },
) => {
	const onLoadMoreRef = useRef(onLoadMore);
	useEffect(() => {
		onLoadMoreRef.current = onLoadMore;
	});

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
					onLoadMoreRef.current();
				}
			},
			{ threshold: 0.1 },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, [ref, hasNextPage, isFetchingNextPage]);
};
