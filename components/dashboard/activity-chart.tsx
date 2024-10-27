"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LineChart } from "@/components/charts/line-chart";
import { CandlestickChart } from "@/components/charts/candlestick-chart";
import { cn } from "@/lib/utils";

const timeframes = ["Live", "1D", "1W", "1M", "3M", "6M", "YTD", "1Y", "5Y", "All"];

const generateMockData = (timeframe: string) => {
  const now = Date.now();
  const points = timeframe === "Live" ? 20 : 50;
  const interval = timeframe === "Live" ? 3600000 : 86400000; // 1 hour for Live, 1 day for others

  return {
    line: Array(points).fill(0).map((_, i) => ({
      time: new Date(now - (points - i) * interval).toISOString(),
      value: 60000 + Math.random() * 5000
    })),
    candlestick: Array(points).fill(0).map((_, i) => ({
      time: new Date(now - (points - i) * interval).toISOString(),
      open: 60000 + Math.random() * 5000,
      high: 62000 + Math.random() * 5000,
      low: 59000 + Math.random() * 5000,
      close: 61000 + Math.random() * 5000
    }))
  };
};

export default function ActivityChart() {
  const [chartType, setChartType] = useState<"line" | "candlestick">("line");
  const [selectedTimeframe, setSelectedTimeframe] = useState("1D");
  const [profitLoss, setProfitLoss] = useState(2.26);
  const [data, setData] = useState(generateMockData(selectedTimeframe));

  useEffect(() => {
    setData(generateMockData(selectedTimeframe));
    
    if (selectedTimeframe === "Live") {
      const interval = setInterval(() => {
        setData(prev => {
          const newLineData = [...prev.line.slice(1), {
            time: new Date().toISOString(),
            value: prev.line[prev.line.length - 1].value * (1 + (Math.random() - 0.5) * 0.002)
          }];
          
          const newCandlestickData = [...prev.candlestick.slice(1), {
            time: new Date().toISOString(),
            open: prev.candlestick[prev.candlestick.length - 1].close,
            high: prev.candlestick[prev.candlestick.length - 1].close * (1 + Math.random() * 0.005),
            low: prev.candlestick[prev.candlestick.length - 1].close * (1 - Math.random() * 0.005),
            close: prev.candlestick[prev.candlestick.length - 1].close * (1 + (Math.random() - 0.5) * 0.002)
          }];

          return {
            line: newLineData,
            candlestick: newCandlestickData
          };
        });
        setProfitLoss(prev => prev + (Math.random() - 0.5) * 0.1);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [selectedTimeframe]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={chartType === "line" ? "default" : "outline"}
            onClick={() => setChartType("line")}
            size="sm"
          >
            Line
          </Button>
          <Button
            variant={chartType === "candlestick" ? "default" : "outline"}
            onClick={() => setChartType("candlestick")}
            size="sm"
          >
            Candlestick
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-sm font-medium",
            profitLoss >= 0 ? "text-green-500" : "text-red-500"
          )}>
            {profitLoss >= 0 ? "+" : ""}{profitLoss.toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="h-[300px] w-full">
        {chartType === "line" ? (
          <LineChart data={data.line} />
        ) : (
          <CandlestickChart data={data.candlestick} />
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto py-2">
        {timeframes.map((tf) => (
          <Button
            key={tf}
            variant={selectedTimeframe === tf ? "default" : "outline"}
            onClick={() => setSelectedTimeframe(tf)}
            size="sm"
          >
            {tf}
          </Button>
        ))}
      </div>
    </div>
  );
}