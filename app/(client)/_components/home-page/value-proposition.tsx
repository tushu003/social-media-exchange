'use client';

export default function ValuePropositionSection() {
  const items = [
    {
      icon: '/icon-trade.svg',
      title: 'Trade Skills, Not Cash',
      description: 'Swap services directly with others',
    },
    {
      icon: '/icon-network.svg',
      title: 'Join a Global Network',
      description: 'Connect with like-minded people.',
    },
    {
      icon: '/icon-sustainable.svg',
      title: 'Live Sustainably',
      description: 'Reduce waste & maximize resources.',
    },
    {
      icon: '/icon-flexible.svg',
      title: 'Fair & Flexible',
      description: 'Set your own terms, trade on your own terms.',
    },
  ];

  return (
    <section className="bg-[#FAFAFA] py-16 px-4 sm:px-8 lg:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
        {items.map((item, index) => (
          <div key={index} className="flex flex-col items-center justify-center gap-4">
            <img
              src={item.icon}
              alt={item.title}
              className="h-[60px] w-[60px]"
            />
            <h3 className="text-lg font-semibold text-[#070707]">{item.title}</h3>
            <p className="text-sm text-gray-500 max-w-[200px]">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
  