import { TSchedule } from '@/types';

export const HaLong = {
	title: 'Ha Long Bay',
	reviews: '2.3k',
	rating: 4,
	description: `Hang Sơn Đoòng, tọa lạc trong vùng lõi của Vườn quốc gia Phong Nha – Kẻ Bàng (tỉnh Quảng Bình, Việt Nam), được công nhận là hang động tự nhiên lớn nhất thế giới cả về thể tích lẫn kích thước. Hang được phát hiện lần đầu vào năm 1991 bởi một người dân địa phương tên Hồ Khanh, nhưng mãi đến năm 2009 mới được chính thức khám phá và khảo sát bởi Hiệp hội hang động Hoàng gia Anh. Với chiều dài hơn 9km, chiều cao có nơi lên đến 200m và chiều rộng khoảng 150m, hang Sơn Đoòng đủ sức chứa cả một tòa nhà 40 tầng, khiến bất kỳ ai đặt chân đến đều choáng ngợp trước sự kỳ vĩ của thiên nhiên.
            Bên trong hang là một thế giới hoàn toàn tách biệt, nơi ánh sáng mặt trời len lỏi qua những hố sụt khổng lồ tạo nên những khu rừng nguyên sinh ngay trong lòng đất. Hệ sinh thái tại đây vô cùng độc đáo, với thảm thực vật phát triển mạnh, dòng sông ngầm uốn lượn, cùng những khối thạch nhũ khổng lồ có niên đại hàng triệu năm tuổi. Đặc biệt, một số cấu trúc nhũ đá ở Sơn Đoòng cao đến 70m – được xem là cao nhất thế giới từng được biết đến trong các hang động.
            Không chỉ mang giá trị địa chất và sinh học to lớn, hang Sơn Đoòng còn là biểu tượng của du lịch mạo hiểm tại Việt Nam. Các chuyến thám hiểm kéo dài từ 4 đến 5 ngày, giới hạn số lượng khách và được tổ chức một cách bền vững nhằm bảo tồn nguyên vẹn hệ sinh thái nơi đây. Nhờ vẻ đẹp siêu thực và tầm vóc "ngoài hành tinh", Sơn Đoòng thường xuyên được nhắc đến trên các tạp chí du lịch danh tiếng như National Geographic, BBC Earth, hay The New York Times, và được ví như một trong những kỳ quan tự nhiên cuối cùng chưa được con người khám phá hết.`,
	details: [
		{ label: 'Destination', value: 'Quang Ninh' },
		{ label: 'Departure', value: 'Lien Chieu dist, Da Nang' },
		{ label: 'Time', value: 'Not Specified' },
		{ label: 'Quantity', value: 'Not Specified' },
		{ label: 'Count Complete', value: 'Not Specified' },
		{ label: 'Location On Map', value: 'View Map' },
	],
	gallery: {
		images: [
			'https://placehold.co/600x480/a3be8c/ffffff?text=Gallery+1',
			'https://placehold.co/600x480/5e81ac/ffffff?text=Gallery+2',
			'https://placehold.co/600x480/88c0d0/ffffff?text=Gallery+3',
			'https://placehold.co/600x480/b48ead/ffffff?text=Gallery+4',
			'https://placehold.co/600x480/d08770/ffffff?text=Gallery+5',
			'https://placehold.co/600x480/ebcb8b/ffffff?text=Gallery+6',
		],
	},
};

export const schedule1: TSchedule = {
	id: '1',
	startDate: 'Jan 6, 2024',
	startTime: '7:30',
	endDate: 'Jan 6, 2024',
	endTime: '21:30',
	booked: 26,
	status: 'Active',
	price: '165.100',
};
