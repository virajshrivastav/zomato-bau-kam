import { cn } from "@/lib/utils";

interface DataTableProps {
  headers: string[];
  rows: (string | number)[][];
  className?: string;
}

export const DataTable = ({ headers, rows, className }: DataTableProps) => {
  return (
    <div className={cn("border border-border rounded-lg overflow-hidden", className)}>
      <table className="w-full">
        <thead>
          <tr className="bg-muted border-b border-border">
            {headers.map((header, index) => (
              <th
                key={index}
                className="p-3 text-left text-sm font-semibold text-foreground border-r border-border last:border-r-0"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors"
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="p-3 text-sm text-foreground border-r border-border last:border-r-0"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
