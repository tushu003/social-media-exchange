export function RatingBreakdown() {
    const data = [
      { stars: 5, count: 100, color: "#20B894" },
      { stars: 4, count: 50, color: "#FBBF24" },
      { stars: 3, count: 20, color: "#D6B084" },
      { stars: 2, count: 15, color: "#FBBF24" },
      { stars: 1, count: 5, color: "#F87171" },
    ];
    const max = Math.max(...data.map((d) => d.count));
  
    return (
      <div className="bg-white border rounded-xl p-4 shadow-sm space-y-2">
        {data.map((item) => (
          <div key={item.stars} className="flex items-center gap-2">
            <div className="flex items-center gap-[1px] min-w-[80px]">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < item.stars ? "fill-[#FBBF24]" : "fill-gray-200"
                  } stroke-[#FBBF24]`}
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z" />
                </svg>
              ))}
            </div>
            <div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
              <div
                className="h-full"
                style={{
                  width: `${(item.count / max) * 100}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
            <span className="text-xs text-[#4A4C56] w-6 text-right">
              {item.count}
            </span>
          </div>
        ))}
      </div>
    );
  }