export default function Footer() {
  const countries = ['Singapore', 'Indonesia', 'Thailand', 'Malaysia', 'VietNam', 'Philippines', 'Brazil', 'Mexico', 'Colombia', 'Chile', 'Taiwan']
  return (
    <footer className='py-10 bg-neutral-100 text-sm'>
      <div className='container mx-auto px-4 space-y-8'>
        <div className='flex items-center justify-between flex-nowrap text-sm text-gray-600 gap-4 w-full'>
          <div className='flex-shrink-0'>
            © 2025 Shopee. Tất cả các quyền được bảo lưu.
          </div>
          <div className='flex items-center gap-2 flex-wrap justify-end text-gray-500'>
            <span className='font-medium text-black'>
              Quốc gia &amp; Khu vực:
            </span>
            {countries.map((country, index) => (
              <span key={index} className='whitespace-nowrap'>
                <span className="cursor-pointer">{country}</span>
                {index < countries.length - 1 && (
                  <span className='ml-1 text-gray-300'>|</span>
                )}
              </span>
            ))}
          </div>
        </div>
        <div className='text-center text-[0.875rem] leading-relaxed'>
          <div>Công ty TNHH Shopee</div>
          <div className='mt-4'>
            Địa chỉ: Tầng 4-5-6, Tòa nhà Capital Place, số 29 đường Liễu Giai,
            Phường Ngọc Khánh, Quận Ba Đình, Thành phố Hà Nội, Việt Nam.
            <br />
            Chăm sóc khách hàng: Gọi tổng đài Shopee (miễn phí) hoặc Trò chuyện với Shopee ngay trên Trung tâm trợ giúp
          </div>
          <div className='mt-2'>
            Chịu Trách Nhiệm Quản Lý Nội Dung: Nguyễn Bùi Anh Tuấn
          </div>
          <div className='mt-2'>
            Mã số doanh nghiệp: 0106773786 do Sở Kế hoạch và Đầu tư TP Hà Nội cấp lần đầu ngày 10/02/2015
          </div>
          <div className='mt-2'>
            © 2015 - Bản quyền thuộc về Công ty TNHH Shopee
          </div>
        </div>
      </div>
    </footer>
  );
}
