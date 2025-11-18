/**
 * Breadcrumbs - Navigation aid
 * Shows current location in site hierarchy
 */

import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
}

export function Breadcrumbs({ items, showHome = true }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm">
      {showHome && (
        <>
          <Link
            to="/"
            className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition"
            aria-label="홈"
          >
            <Home className="w-4 h-4" />
          </Link>
          {items.length > 0 && (
            <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600" />
          )}
        </>
      )}

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={item.href} className="flex items-center space-x-2">
            {isLast ? (
              <span
                className="font-medium text-gray-900 dark:text-gray-100"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <>
                <Link
                  to={item.href}
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition"
                >
                  {item.label}
                </Link>
                <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600" />
              </>
            )}
          </div>
        );
      })}
    </nav>
  );
}
