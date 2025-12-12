import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function StatCard({ title, value, subtitle, icon: Icon }: StatCardProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-4 flex items-start justify-between">
        <div>
          <p className="text-base font-medium text-[#070707]">{title}</p>
          <p className="text-sm text-gray-500">{subtitle}</p>
          <h2 className="text-3xl font-bold mt-2 mb-1 text-[#20B894]">{value}</h2>
        </div>
        <div className="p-3 border rounded-lg">
          <Icon className="w-5 h-5" />
        </div>
      </CardContent>
    </Card>
  );
}