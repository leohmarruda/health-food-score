/**
 * Props for SortIcon component
 */
interface SortIconProps {
  column: string;
  currentColumn: string;
  order: 'asc' | 'desc';
}

/**
 * Sort icon component for table headers.
 * Shows sort direction (asc/desc) or neutral icon when not sorted.
 * 
 * @param props - Component props
 * @returns Sort icon element
 */
export default function SortIcon({ column, currentColumn, order }: SortIconProps) {
  if (currentColumn !== column) {
    return <span className="ml-1 opacity-30 text-[10px]">↕</span>;
  }
  return order === 'asc' 
    ? <span className="ml-1 text-primary text-[10px]">▲</span> 
    : <span className="ml-1 text-primary text-[10px]">▼</span>;
}

