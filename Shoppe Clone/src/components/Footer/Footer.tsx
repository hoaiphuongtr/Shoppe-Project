export default function Footer() {
    return (
        <footer className='py-16 bg-neutral-100'>
            <footer className='py-16 bg-neutral-100'>
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 items-start justify-between'>
                    <div className='lg:col-span-1 mr-25 leading-[1.125rem]'>
                        <div>
                            © 2025 Shopee. Tất cả các quyền được bảo lưu.
                        </div>
                    </div>

                    <div className='lg:col-span-2 flex justify-end mr-25'>
                        <div className='flex items-center leading-[1.125rem] w-full'>
                            <div className='flex-[1_0_auto] text-left'>
                                Quốc gia &amp; Khu vực:
                            </div>
                            <div className='whitespace-nowrap'>
                                Singapore | Indonesia | Thailand | Malaysia |
                                VietNam | Philippines | Brazil | Mexico |
                                Colombia | Chile | Taiwan
                            </div>
                        </div>
                    </div>
                </div>
                <div className='container'>
                    <div className='text-center text-sm mt-10'>
                        <div>Công ty TNHH Shopee</div>
                        <div className='mt-6'>
                            Địa chỉ: Tầng 4-5-6, Tòa nhà Capital Place, số 29
                            đường Liễu Giai, Phường Ngọc Khánh, Quận Ba Đình,
                            Thành phố Hà Nội, Việt Nam. Chăm sóc khách hàng: Gọi
                            tổng đài Shopee (miễn phí) hoặc Trò chuyện với
                            Shopee ngay trên Trung tâm trợ giúp
                        </div>
                        <div className='mt-2'>
                            Chịu Trách Nhiệm Quản Lý Nội Dung: Nguyễn Bùi Anh
                            Tuấn
                        </div>
                        <div className='mt-2'>
                            Mã số doanh nghiệp: 0106773786 do Sở Kế hoạch và Đầu
                            tư TP Hà Nội cấp lần đầu ngày 10/02/2015
                        </div>
                        <div className='mt-2'>
                            © 2015 - Bản quyền thuộc về Công ty TNHH Shopee
                        </div>
                    </div>
                </div>
            </footer>
        </footer>
    );
}
