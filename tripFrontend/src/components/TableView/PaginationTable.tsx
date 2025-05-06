import { JSX, useMemo } from 'react';

import { TPagination } from '@/types';
import './style.scss';

type TPaginationTableProps = {
	pagination: TPagination;
	onPageChange?: (page: number) => void;
};

export const PaginationTable = ({
	pagination,
	onPageChange = (): void => {},
}: TPaginationTableProps): JSX.Element => {
	const { currentPage, totalPages } = pagination;
	const neighbours = 2;

	const gotoPage = (page: number): void => {
		const next = Math.min(Math.max(1, page), totalPages);
		if (next !== currentPage) onPageChange(next);
	};

	const pages = useMemo<(number | 'ELLIPSIS')[]>(() => {
		const list: (number | 'ELLIPSIS')[] = [1];
		const start = Math.max(2, currentPage - neighbours);
		const end = Math.min(totalPages - 1, currentPage + neighbours);

		if (start > 2) list.push('ELLIPSIS');
		for (let p = start; p <= end; p++) list.push(p);
		if (end < totalPages - 1) list.push('ELLIPSIS');
		if (totalPages > 1) list.push(totalPages);

		return list;
	}, [currentPage, totalPages]);

	const pad2 = (n: number): string => n.toString().padStart(2, '0');

	return (
		<nav className="flex items-center space-x-2" aria-label="Pagination navigation">
			<button
				onClick={() => gotoPage(currentPage - 1)}
				disabled={currentPage === 1}
				className="px-3 py-1 disabled:opacity-50 rounded-full border border-gray-500"
				aria-label="Go to previous page"
			>
				Prev
			</button>

			{pages.map((item, idx) =>
				item === 'ELLIPSIS' ? (
					<span
						key={`ellipsis-${idx}`}
						className="px-2 select-none"
						aria-hidden="true"
					>
						…
					</span>
				) : (
					<button
						key={`page-${item}`}
						onClick={() => gotoPage(item)}
						aria-label={`Page ${item}`}
						aria-current={item === currentPage ? 'page' : undefined}
						className={`px-3 py-1 rounded-full border border-gray-500 ${
							item === currentPage
								? 'bg-orange-500 text-white '
								: 'bg-white text-gray-700 hover:bg-gray-100 table-pagination-item'
						}`}
					>
						{pad2(item)}
					</button>
				),
			)}
			<button
				onClick={() => gotoPage(currentPage + 1)}
				disabled={currentPage === totalPages}
				className="px-3 py-1 disabled:opacity-50 rounded-full border border-gray-500"
				aria-label="Go to next page"
			>
				Next
			</button>
		</nav>
	);
};
