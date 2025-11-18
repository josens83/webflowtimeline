/**
 * Tooltip - Radix UI based
 * Accessible, keyboard-navigable tooltip
 */

import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { ReactNode } from 'react';

export interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  delayDuration?: number;
}

export function Tooltip({ children, content, side = 'top', delayDuration = 200 }: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            className="z-50 px-3 py-2 text-sm bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg shadow-lg animate-in fade-in-0 zoom-in-95"
            sideOffset={5}
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-gray-900 dark:fill-gray-100" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
