import { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label, Pie, PieChart } from 'recharts'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp } from "lucide-react"

interface PieChartProps {
  data: Array<{ review_text: string; confidence: number; label: boolean; rating: string }>
}

export function RatingPieChart({ data }: PieChartProps) {
  const prepareDonutChartData = useMemo(() => {
    const ratingCounts = data.reduce((acc, review) => {
      const rating = review.rating.split('/')[0]
      acc[rating] = (acc[rating] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(ratingCounts).map(([rating, count]) => ({
      rating: `${rating}/5`,
      count,
      fill: `hsl(${parseInt(rating) * 60}, 70%, 50%)`
    }))
  }, [data])

  const totalReviews = useMemo(() => data.length, [data])

  const chartConfig: ChartConfig = {
    count: { label: "Count" },
    "1/5": { label: "1 Star", color: "hsl(var(--chart-1))" },
    "2/5": { label: "2 Stars", color: "hsl(var(--chart-2))" },
    "3/5": { label: "3 Stars", color: "hsl(var(--chart-3))" },
    "4/5": { label: "4 Stars", color: "hsl(var(--chart-4))" },
    "5/5": { label: "5 Stars", color: "hsl(var(--chart-5))" },
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Rating Distribution</CardTitle>
        <CardDescription>Analysis of customer ratings</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={prepareDonutChartData}
              dataKey="count"
              nameKey="rating"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalReviews}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Reviews
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Average rating: {(prepareDonutChartData.reduce((acc, curr) => acc + parseInt(curr.rating) * curr.count, 0) / totalReviews).toFixed(1)}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Based on {totalReviews} customer reviews
        </div>
      </CardFooter>
    </Card>
  )
}