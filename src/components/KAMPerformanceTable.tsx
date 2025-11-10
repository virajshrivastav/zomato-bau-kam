import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Download, ArrowUpDown } from "lucide-react";
import PerformanceBadge from "./PerformanceBadge";
import { cn } from "@/lib/utils";

interface KAMPerformance {
  name: string;
  drivePerformance: string;
  conversionAvg: string;
  approachRate: string;
  totalDrives: number;
  rank: number;
}

// MOCK DATA - This will be replaced with real data from useZonalStats() hook when data stabilizes
const kamData: KAMPerformance[] = [
  {
    name: "Amdeep",
    drivePerformance: "9/10",
    conversionAvg: "80%",
    approachRate: "85%",
    totalDrives: 45,
    rank: 1,
  },
  {
    name: "Khushi",
    drivePerformance: "9/10",
    conversionAvg: "81%",
    approachRate: "87%",
    totalDrives: 42,
    rank: 2,
  },
  {
    name: "Shrawani",
    drivePerformance: "8/10",
    conversionAvg: "76%",
    approachRate: "80%",
    totalDrives: 38,
    rank: 3,
  },
  {
    name: "Shiv",
    drivePerformance: "8/10",
    conversionAvg: "75%",
    approachRate: "82%",
    totalDrives: 40,
    rank: 4,
  },
  {
    name: "Rutuja",
    drivePerformance: "7/10",
    conversionAvg: "72%",
    approachRate: "78%",
    totalDrives: 35,
    rank: 5,
  },
];

const KAMPerformanceTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<keyof KAMPerformance | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleSort = (field: keyof KAMPerformance) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const filteredData = kamData.filter((kam) =>
    kam.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  const parsePerformance = (performance: string) => {
    const [current, total] = performance.split("/").map(Number);
    return current / total;
  };

  const parsePercentage = (percentage: string) => {
    return parseInt(percentage.replace("%", ""));
  };

  const handleExport = () => {
    // Simple CSV export
    const headers = [
      "Rank",
      "KAM Name",
      "Drive Performance",
      "Conversion Avg.",
      "Approach Rate",
      "Total Drives",
    ];
    const rows = sortedData.map((kam) => [
      kam.rank,
      kam.name,
      kam.drivePerformance,
      kam.conversionAvg,
      kam.approachRate,
      kam.totalDrives,
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "kam-performance.csv";
    a.click();
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-4 md:p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search KAMs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button onClick={handleExport} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-table-header hover:bg-table-header">
                <TableHead className="font-semibold text-foreground w-16">Rank</TableHead>
                <TableHead
                  className="font-semibold text-foreground cursor-pointer hover:text-primary"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-1">
                    KAM Name
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="font-semibold text-foreground cursor-pointer hover:text-primary"
                  onClick={() => handleSort("drivePerformance")}
                >
                  <div className="flex items-center gap-1">
                    Drive Performance
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="font-semibold text-foreground cursor-pointer hover:text-primary"
                  onClick={() => handleSort("conversionAvg")}
                >
                  <div className="flex items-center gap-1">
                    Conversion Avg.
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="font-semibold text-foreground cursor-pointer hover:text-primary"
                  onClick={() => handleSort("approachRate")}
                >
                  <div className="flex items-center gap-1">
                    Approach Rate
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="font-semibold text-foreground cursor-pointer hover:text-primary"
                  onClick={() => handleSort("totalDrives")}
                >
                  <div className="flex items-center gap-1">
                    Total Drives
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No KAMs found
                  </TableCell>
                </TableRow>
              ) : (
                sortedData.map((kam, index) => (
                  <TableRow
                    key={kam.name}
                    className={cn(
                      "hover:bg-muted/50 transition-colors",
                      index % 2 === 0 ? "bg-background" : "bg-muted/20"
                    )}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center justify-center">
                        {kam.rank <= 3 ? (
                          <Badge
                            className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center",
                              kam.rank === 1 && "bg-yellow-500 hover:bg-yellow-500 text-white",
                              kam.rank === 2 && "bg-gray-400 hover:bg-gray-400 text-white",
                              kam.rank === 3 && "bg-amber-700 hover:bg-amber-700 text-white"
                            )}
                          >
                            {kam.rank}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">{kam.rank}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-foreground">{kam.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">{kam.drivePerformance}</span>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${parsePerformance(kam.drivePerformance) * 100}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{kam.conversionAvg}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{kam.approachRate}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-medium">
                        {kam.totalDrives}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <PerformanceBadge
                        value={parsePercentage(kam.conversionAvg)}
                        type="percentage"
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
};

export default KAMPerformanceTable;
