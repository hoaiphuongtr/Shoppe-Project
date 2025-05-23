export default function Footer() {
  const countries = ['Singapore', 'Indonesia', 'Thailand', 'Malaysia', 'VietNam', 'Philippines', 'Brazil', 'Mexico', 'Colombia', 'Chile', 'Taiwan'];

  return (
    <footer className="bg-neutral-100 text-sm py-10 border-t-[3px] border-t-orange">
      <div className="container mx-auto p-4 h-[180px] overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4 text-xs sm:text-sm md:text-[13px] text-gray-600 px-2">
          <div>© 2025 Shopee. Tất cả các quyền được bảo lưu.</div>
          <div className="flex flex-wrap items-center gap-x-1 gap-y-1 text-gray-500">
            <span className="font-medium text-black mr-1 whitespace-nowrap">Quốc gia &amp; Khu vực:</span>
            {countries.map((country, index) => (
              <span key={index} className="whitespace-nowrap">
                <span className="cursor-pointer">{country}</span>
                {index < countries.length - 1 && (
                  <span className="mx-1 text-gray-300">|</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>

  );
}
