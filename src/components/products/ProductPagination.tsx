import { ChevronLeft, ChevronRight } from 'lucide-react';

type ProductPaginationProps = {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

function visiblePages(page: number, totalPages: number): (number | 'ellipsis')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages: (number | 'ellipsis')[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  if (start > 2) pages.push('ellipsis');
  for (let current = start; current <= end; current += 1) pages.push(current);
  if (end < totalPages - 1) pages.push('ellipsis');
  pages.push(totalPages);

  return pages;
}

export function ProductPagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: ProductPaginationProps) {
  if (!totalItems) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <div className="pagination">
      <p className="pagination-info">
        Mostrando <strong>{start}</strong> a <strong>{end}</strong> de <strong>{totalItems}</strong>
      </p>
      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            type="button"
            aria-label="Página anterior"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft size={16} />
          </button>
          {visiblePages(page, totalPages).map((item, index) =>
            item === 'ellipsis' ? (
              <span className="pagination-ellipsis" key={`ellipsis-${index}`}>
                …
              </span>
            ) : (
              <button
                type="button"
                key={item}
                className={item === page ? 'active' : ''}
                aria-label={`Página ${item}`}
                aria-current={item === page ? 'page' : undefined}
                onClick={() => onPageChange(item)}
              >
                {item}
              </button>
            ),
          )}
          <button
            type="button"
            aria-label="Página siguiente"
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
