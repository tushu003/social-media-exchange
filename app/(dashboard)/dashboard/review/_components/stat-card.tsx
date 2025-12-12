export function StatCard({
  title,
  value,
  subtitle,
  stars = false,
  valueClass = "text-black",
}: {
  title: string;
  value: string;
  subtitle: string;
  stars?: boolean;
  valueClass?: string;
}) {
  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm">
      <h4 className="text-sm text-[#4A4C56] mb-1">{title}</h4>
      <div className="text-2xl font-bold flex items-center gap-2">
        <span className={valueClass}>{value}</span>
        {stars && (
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < 4 ? "fill-[#FBBF24]" : "fill-gray-200"
                } stroke-[#FBBF24]`}
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z" />
              </svg>
            ))}
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
    </div>
  );
}
