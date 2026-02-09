// ============================================
// components/ui/DataGrid/DataGridEmpty.tsx
// ============================================

import { FC, ReactNode } from 'react';
import { Inbox } from 'lucide-react';

interface DataGridEmptyProps {
  message: string | ReactNode;
}

export const DataGridEmpty: FC<DataGridEmptyProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
      <Inbox className="h-12 w-12 mb-4 opacity-50" />
      <div className="text-sm">{message}</div>
    </div>
  );
};
