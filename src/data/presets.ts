import { HairStylePreset, HairColorPreset, OutfitPreset, SampleModel } from '../types';

export const HAIR_STYLES: HairStylePreset[] = [
  // Nữ - Dài & Lửng
  {
    id: 'korean-layer-curtain',
    name: 'Layer Hàn Quốc & Mái Bay',
    nameEn: 'Korean Soft Layers with Curtain Bangs',
    gender: 'female',
    category: 'long',
    description: 'Tóc tỉa layer nhẹ nhàng, ôm khuôn mặt kết hợp mái bay bồng bềnh nữ tính, che khuyết điểm gò má.',
    promptDescription: 'Modern Korean salon soft layered haircut with voluminous curtain bangs framing cheekbones, airy face-framing textures, glossy healthy finish',
    recommendedFaceShapes: ['Mặt tròn', 'Mặt vuông', 'Mặt trái xoan'],
    tags: ['Hot Trend', 'Dịu dàng', 'Tôn mặt'],
  },
  {
    id: 'french-chic-bob',
    name: 'Bob Pháp Cổ Điển',
    nameEn: 'Chic Parisian French Bob',
    gender: 'female',
    category: 'short',
    description: 'Độ dài ngang xương hàm, uốn cúp nhẹ tự nhiên mang thần thái thanh lịch, sang trọng phong cách Pháp.',
    promptDescription: 'Effortless Parisian blunt jaw-length bob cut, subtle textured ends with soft wispy bangs, chic sophisticated styling',
    recommendedFaceShapes: ['Mặt trái xoan', 'Mặt dài', 'Mặt trái tim'],
    tags: ['Thanh lịch', 'Sang chảnh'],
  },
  {
    id: 'mermaid-waves',
    name: 'Xoăn Sóng Nước Lơi Tự Nhiên',
    nameEn: 'Mermaid Loose Beach Waves',
    gender: 'female',
    category: 'long',
    description: 'Sóng tóc uốn lơi nhẹ bồng bềnh như sóng biển, mang lại vẻ quyến rũ tiểu thư đài các.',
    promptDescription: 'Long voluminous loose mermaid waves cascading over shoulders, natural effortless texture, multidimensional highlights and soft volume',
    recommendedFaceShapes: ['Mặt tròn', 'Mặt trái xoan', 'Mặt góc cạnh'],
    tags: ['Tiểu thư', 'Bồng bềnh'],
  },
  {
    id: 'edgy-wolf-cut',
    name: 'Wolf Cut Cá Tính Phá Cách',
    nameEn: 'Modern Textured Wolf Cut',
    gender: 'female',
    category: 'medium',
    description: 'Tỉa tầng so le táo bạo giữa Shag và Mullet, tạo độ phồng đỉnh đầu và phong cách đường phố nổi bật.',
    promptDescription: 'Trendy edgy wolf cut with choppy layers, voluminous crown texture, tapered wispy ends and modern fringe, rebel street aesthetic',
    recommendedFaceShapes: ['Mặt tròn', 'Mặt trái tim', 'Mặt trái xoan'],
    tags: ['Cá tính', 'Y2K', 'Nổi bật'],
  },
  {
    id: 'sleek-glass-hair',
    name: 'Tóc Thẳng Suôn Mượt (Glass Hair)',
    nameEn: 'Ultra-Sleek Glass Straight Hair',
    gender: 'female',
    category: 'long',
    description: 'Mái tóc duỗi thẳng tắp bóng loáng như gương, ngôi giữa quyền lực phong cách thời trang cao cấp.',
    promptDescription: 'Ultra-sleek mirror-shine pin-straight long hair, center part, razor sharp ends, luxurious high-fashion runway look',
    recommendedFaceShapes: ['Mặt trái xoan', 'Mặt tròn'],
    tags: ['Tối giản', 'Quyền lực'],
  },
  {
    id: 'modern-pixie',
    name: 'Pixie Cut Năng Động Hiện Đại',
    nameEn: 'Modern Textured Pixie Cut',
    gender: 'female',
    category: 'short',
    description: 'Tóc tém tỉa gọn gàng khoe trọn đường nét cổ thon và xương quai hàm sắc sảo.',
    promptDescription: 'Chic modern cropped pixie haircut with soft feathered layers on top, tapered nape and sides, highlighting feminine jawline and facial contours',
    recommendedFaceShapes: ['Mặt trái xoan', 'Mặt trái tim', 'Mặt nhỏ'],
    tags: ['Cá tính', 'Trẻ trung', 'Gọn gàng'],
  },
  {
    id: 'japanese-hime-cut',
    name: 'Hime Cut Công Chúa Nhật Bản',
    nameEn: 'Japanese Royal Hime Cut',
    gender: 'female',
    category: 'long',
    description: 'Tóc mái ngang kết hợp hai lọn tóc cắt bằng ngang má tạo sự tương phản huyền bí ấn tượng.',
    promptDescription: 'Traditional royal Japanese Hime haircut with straight blunt bangs, cheek-length side sidelocks framing cheeks, and long sleek hair behind',
    recommendedFaceShapes: ['Mặt dài', 'Mặt trái xoan'],
    tags: ['Độc đáo', 'Anime', 'Huyền bí'],
  },

  // Nam - Nam tính & Thời thượng
  {
    id: 'korean-two-block',
    name: 'Two-Block Lãng Tử Hàn Quốc',
    nameEn: 'Korean Idol Two-Block Cut',
    gender: 'male',
    category: 'medium',
    description: 'Cắt ngắn hai bên và gáy, phần đỉnh tóc giữ độ dài vừa phải rủ nhẹ tự nhiên chuẩn soái ca Hàn.',
    promptDescription: 'Trendy Korean K-pop idol two-block haircut, undercut sides with soft textured parted fringe, lightweight volume, neat and charming',
    recommendedFaceShapes: ['Mặt trái xoan', 'Mặt tròn', 'Mặt dài'],
    tags: ['Soái ca', 'Hàn Quốc', 'Trẻ trung'],
  },
  {
    id: 'gentleman-side-part',
    name: 'Side Part 7/3 Lịch Lãm',
    nameEn: 'Classic Gentleman Side Part 7/3',
    gender: 'male',
    category: 'short',
    description: 'Rẽ ngôi 7/3 vuốt sáp tạo nếp chuẩn phong thái doanh nhân thành đạt, nam tính và chững chạc.',
    promptDescription: 'Sophisticated 7/3 gentleman side-part haircut, low taper fade on sides, clean styled pomade comb-over, executive business style',
    recommendedFaceShapes: ['Mặt vuông', 'Mặt trái xoan', 'Mặt góc cạnh'],
    tags: ['Lịch lãm', 'Công sở', 'Quý ông'],
  },
  {
    id: 'modern-mullet-men',
    name: 'Modern Textured Mullet',
    nameEn: 'Edgy Modern Textured Mullet',
    gender: 'male',
    category: 'medium',
    description: 'Hai bên tỉa sát, mái và đuôi tóc gáy dài uốn lượn phong trần phá cách của giới trẻ.',
    promptDescription: 'Fashion-forward modern textured mullet for men, faded temples, textured messy layers on top, elongated tapered neck hair, rebel vibe',
    recommendedFaceShapes: ['Mặt tròn', 'Mặt trái xoan', 'Mặt trái tim'],
    tags: ['Phá cách', 'Nghệ sĩ', 'Streetstyle'],
  },
  {
    id: 'ivy-league-cut',
    name: 'Ivy League Tinh Tế',
    nameEn: 'Ivy League Crew Cut',
    gender: 'male',
    category: 'short',
    description: 'Kiểu tóc ngắn gọn gàng của các quý tộc đại học danh tiếng, tôn vinh vầng trán thông minh.',
    promptDescription: 'Clean Ivy League crew haircut, short faded sides, slightly longer textured front brushed up and slightly to the side, sharp masculine look',
    recommendedFaceShapes: ['Mặt vuông', 'Mặt góc cạnh', 'Mặt trái xoan'],
    tags: ['Gọn gàng', 'Thể thao', 'Sáng sủa'],
  },
  {
    id: 'textured-crop',
    name: 'French Textured Crop',
    nameEn: 'French Textured Crop with Fade',
    gender: 'male',
    category: 'short',
    description: 'Mái ngố cắt ngắn tỉa layer sắc sảo kết hợp Fade hai bên, mang phong cách châu Âu hiện đại.',
    promptDescription: 'Textured French crop haircut with high skin fade, blunt micro-fringe, textured choppy top with matte clay styling',
    recommendedFaceShapes: ['Mặt dài', 'Mặt trái xoan'],
    tags: ['Âu Mỹ', 'Thời thượng'],
  },
  {
    id: 'curly-shag-men',
    name: 'Uốn Xoăn Mì Tôm / Xoăn Rối Tự Nhiên',
    nameEn: 'Textured Permed Curly Waves',
    gender: 'male',
    category: 'medium',
    description: 'Uốn xoăn nhẹ tạo độ phồng dồi dào, khắc phục tóc mỏng và mang nét nghệ thuật lãng đãng.',
    promptDescription: 'Soft permed messy curly hair for men with natural volume, defined airy curls falling effortlessly over forehead, artistic aesthetic',
    recommendedFaceShapes: ['Mặt gầy', 'Mặt dài', 'Mặt trái xoan'],
    tags: ['Nghệ sĩ', 'Dày dặn', 'Lãng mạn'],
  },
  {
    id: 'buzz-cut-fade',
    name: 'Buzz Cut Nam Tính Mạnh Mẽ',
    nameEn: 'Masculine Buzz Cut with Mid Fade',
    gender: 'male',
    category: 'short',
    description: 'Cắt húi cua siêu ngắn làm nổi bật trọn vẹn xương quai hàm và ánh mắt quyết đoán.',
    promptDescription: 'Sharp military-inspired buzz cut with clean gradient mid-skin fade, crisp geometric hairline lineup, ultra-masculine look',
    recommendedFaceShapes: ['Mặt vuông', 'Mặt góc cạnh'],
    tags: ['Mạnh mẽ', 'Cool ngầu'],
  },
];

export const HAIR_COLORS: HairColorPreset[] = [
  {
    id: 'jet-black',
    name: 'Đen Tự Nhiên / Đen Mun',
    nameEn: 'Natural Jet Black',
    hex: '#111215',
    undertone: 'neutral',
    description: 'Sắc đen truyền thống sâu thẳm, óng mượt và tôn da châu Á sáng rạng rỡ.',
    promptDescription: 'Rich deep natural jet black hair color with healthy natural shine and depth',
  },
  {
    id: 'chocolate-brown',
    name: 'Nâu Socola Trầm',
    nameEn: 'Deep Chocolate Brown',
    hex: '#3D251E',
    undertone: 'warm',
    description: 'Màu nâu ngọt ngào thanh lịch, thích hợp mọi môi trường công sở và học đường.',
    promptDescription: 'Glossy deep chocolate warm brown hair color with subtle espresso undertones',
  },
  {
    id: 'milk-tea-brown',
    name: 'Nâu Trà Sữa Trendy',
    nameEn: 'Milk Tea Ash Beige',
    hex: '#A8927E',
    undertone: 'neutral',
    description: 'Sự pha trộn giữa nâu be và ánh khói dịu mắt, cực kỳ tôn da và trẻ trung.',
    promptDescription: 'Trendy soft milk tea ash beige hair color, creamy neutral blonde tone with subtle sheen',
  },
  {
    id: 'chestnut-brown',
    name: 'Nâu Hạt Dẻ Ánh Đồng',
    nameEn: 'Warm Chestnut Copper',
    hex: '#6E3A24',
    undertone: 'warm',
    description: 'Sắc nâu ấm áp nổi bật dưới ánh nắng, mang lại vẻ tươi tắn tràn đầy năng lượng.',
    promptDescription: 'Warm chestnut brown hair with delicate copper amber reflections under light',
  },
  {
    id: 'ash-gray-silver',
    name: 'Xám Khói Khói Bạc (Ash Gray)',
    nameEn: 'Cool Ash Gray & Silver',
    hex: '#8D929A',
    undertone: 'cool',
    description: 'Màu khói lạnh thời thượng của các ngôi sao, cá tính và sành điệu bậc nhất.',
    promptDescription: 'High fashion cool ash gray silver hair color, sleek smoky pastel undertones',
  },
  {
    id: 'platinum-blonde',
    name: 'Bạch Kim Quyến Rũ (Platinum)',
    nameEn: 'Ice Platinum Blonde',
    hex: '#EFE6D5',
    undertone: 'cool',
    description: 'Tông màu sáng rực rỡ thu hút mọi ánh nhìn, biến hóa diện mạo như idol quốc tế.',
    promptDescription: 'Luminous ice platinum blonde hair dye, Nordic pale blonde with pearlescent shine',
  },
  {
    id: 'moss-olive-green',
    name: 'Nâu Rêu Khói (Ash Olive)',
    nameEn: 'Smoky Olive Moss Brown',
    hex: '#515B4C',
    undertone: 'cool',
    description: 'Ánh rêu khói bí ẩn tinh tế, sang trọng và không quá chói lọi.',
    promptDescription: 'Subtle smoky ash olive green brown hair color with misty muted forest reflection',
  },
  {
    id: 'cherry-burgundy',
    name: 'Đỏ Rượu Vang Cherry',
    nameEn: 'Cherry Wine Red / Burgundy',
    hex: '#6A1926',
    undertone: 'warm',
    description: 'Sắc đỏ rượu nồng nàn quyến rũ, làm bật tone da trắng sáng nổi bật.',
    promptDescription: 'Luxurious deep cherry wine burgundy red hair color, rich ruby undertones in light',
  },
  {
    id: 'pastel-pink-lavender',
    name: 'Hồng Khói Lavender',
    nameEn: 'Pastel Rose Lavender',
    hex: '#C79DAA',
    undertone: 'cool',
    description: 'Sắc hồng pastel pha ánh tím mộng mơ, phong cách tiên tỷ ngọt ngào.',
    promptDescription: 'Ethereal dreamy pastel rose pink with hint of muted lavender highlight strands',
  },
  {
    id: 'midnight-blue',
    name: 'Xanh Đen Huyền Bí (Midnight Blue)',
    nameEn: 'Deep Midnight Blue',
    hex: '#1B263B',
    undertone: 'cool',
    description: 'Bình thường trầm như đen, ra ánh sáng lộ ánh xanh dương quyền lực.',
    promptDescription: 'Deep midnight navy blue hair color, dark in shadow with brilliant sapphire reflections in sunlight',
  },
];

export const OUTFIT_PRESETS: OutfitPreset[] = [
  // Công sở & Doanh nhân
  {
    id: 'office-blazer-chic',
    name: 'Bộ Blazer Oversized Công Sở Cao Cấp',
    nameEn: 'Tailored Smart Casual Blazer Suit',
    category: 'office',
    gender: 'unisex',
    description: 'Blazer dáng suông thời thượng kết hợp áo lụa và quần âu ống rộng, toát lên thần thái tự tin, chuyên nghiệp.',
    pieces: 'Áo blazer cắt may may đo, áo lót lụa tơ tằm, quần âu xếp ly dáng đứng',
    defaultColors: 'Màu be cát (Sand Beige) & Trắng kem',
    promptDescription: 'Wearing a luxurious tailored sand-beige oversized blazer jacket over an ivory silk inner top, matching high-waisted pleated trousers, minimalist luxury jewelry, crisp executive look',
    palette: ['#D6C7B2', '#FFFFFF', '#4A463F'],
  },
  {
    id: 'executive-suit-gent',
    name: 'Bộ Suit May Đo Lịch Lãm Quý Ông',
    nameEn: 'Bespoke Executive Navy Suit',
    category: 'office',
    gender: 'male',
    description: 'Bộ suit xanh navy cắt may đo chuẩn xác, áo sơ mi trắng cổ điển kết hợp cà vạt lụa và đồng hồ cao cấp.',
    pieces: 'Áo vest navy 2 khuy, sơ mi Oxford trắng, quần tây đồng bộ, cà vạt lụa',
    defaultColors: 'Xanh Navy hoàng gia & Trắng',
    promptDescription: 'Wearing a bespoke deep navy tailored 2-button business suit, crisp white Oxford shirt, subtle patterned silk necktie, luxury leather watch, charismatic businessman aesthetic',
    palette: ['#1C2D42', '#FFFFFF', '#8C2B32'],
  },

  // Truyền thống & Cách tân Áo Dài
  {
    id: 'vietnamese-ao-dai-modern',
    name: 'Áo Dài Lụa Tơ Tằm Cách Tân',
    nameEn: 'Modern Vietnamese Silk Áo Dài',
    category: 'traditional',
    gender: 'female',
    description: 'Tà áo dài lụa tơ tằm thướt tha cách tân tay bồng nhẹ, thêu họa tiết hoa sen trang nhã tôn vinh nét đẹp Việt.',
    pieces: 'Tà áo dài lụa hai lớp cách tân, quần lụa ống rộng mềm mại, vòng ngọc trai',
    defaultColors: 'Màu hồng phấn hoặc xanh ngọc bích',
    promptDescription: 'Wearing an exquisite modern Vietnamese silk Áo Dài tunic with delicate floral embroidery, flowing white silk trousers, elegant pearl necklace, graceful Vietnamese heritage haute couture',
    palette: ['#E6B8C2', '#FFFFFF', '#457B9D'],
  },
  {
    id: 'ao-ngu-than-men',
    name: 'Áo Dài Nam Cách Tân Gấm Thượng Hạng',
    nameEn: 'Men Modern Brocade Áo Dài',
    category: 'traditional',
    gender: 'male',
    description: 'Áo dài nam may từ vải gấm hoa văn chim hạc và mây trời, phom đứng đắn đầy khí chất.',
    pieces: 'Áo dài nam vải gấm đứng phom, quần tây đen chỉn chu',
    defaultColors: 'Màu xanh lục bảo hoặc đỏ đô vương giả',
    promptDescription: 'Wearing a prestigious modern Vietnamese men silk brocade Áo Dài with subtle woven cloud and crane patterns, standing collar, tailored black trousers, stately distinguished presence',
    palette: ['#1B4332', '#B8860B', '#111111'],
  },

  // Dạo phố & Streetwear
  {
    id: 'korean-street-minimalist',
    name: 'Streetwear Hàn Quốc Tối Giản',
    nameEn: 'Korean Minimalist Streetwear',
    category: 'street',
    gender: 'unisex',
    description: 'Áo bomber jacket phối áo thun trơn, quần túi hộp ống rộng và phụ kiện kính mắt hiện đại.',
    pieces: 'Áo khoác bomber tối giản, áo thun cotton, quần cargo ống suông',
    defaultColors: 'Xám than, Đen & Trắng',
    promptDescription: 'Wearing Korean streetwear style: sleek matte bomber jacket, relaxed fit drop-shoulder cotton tee, wide-leg utility cargo trousers, minimalist silver pendant chain, youthful cool Seoul vibe',
    palette: ['#2B2D42', '#8D99AE', '#EDF2F4'],
  },
  {
    id: 'y2k-retro-denim',
    name: 'Phong Cách Y2K Denim & Biker Da',
    nameEn: 'Y2K Edgy Leather Biker & Denim',
    category: 'vintage',
    gender: 'unisex',
    description: 'Áo khoác da biker đen bóng cá tính phối cùng quần jeans wash bạc phong cách năm 2000 nổi loạn.',
    pieces: 'Áo khoác da biker kim loại, áo thun graphic, quần jeans wash retro',
    defaultColors: 'Đen da bóng & Xanh denim vintage',
    promptDescription: 'Wearing edgy vintage black leather biker jacket with silver hardware zips, faded vintage wash relaxed denim jeans, rebellious Y2K fashion statement',
    palette: ['#1A1A1A', '#4A6B82', '#CCCCCC'],
  },

  // Dạ hội & Tiệc đêm
  {
    id: 'luxury-evening-gown',
    name: 'Đầm Dạ Hội Lụa Satin Xẻ Tà Hoàng Gia',
    nameEn: 'Red Carpet Silk Satin Evening Gown',
    category: 'party',
    gender: 'female',
    description: 'Đầm dạ hội lụa satin óng ả ôm trọn đường cong cơ thể, đường xẻ tà quyến rũ bước trên thảm đỏ sang trọng.',
    pieces: 'Đầm dạ hội maxi lụa satin xẻ tà, trang sức kim cương lấp lánh',
    defaultColors: 'Đen tuyền hoặc Đỏ rượu vang',
    promptDescription: 'Wearing a breathtaking red carpet floor-length silk satin evening gown with subtle draped neckline, elegant slit, sparkling diamond drop earrings, glamorous gala banquet style',
    palette: ['#0F0F10', '#800020', '#E5E5E5'],
  },
  {
    id: 'black-tie-tuxedo',
    name: 'Tuxedo Dạ Tiệc Black Tie',
    nameEn: 'Classic Black-Tie Evening Tuxedo',
    category: 'party',
    gender: 'male',
    description: 'Áo khoác tuxedo ve nhung sang trọng, nơ bướm đen và áo sơ mi xếp nếp chuẩn phong cách dạ tiệc thảm đỏ.',
    pieces: 'Áo vest tuxedo ve bóng nhung, nơ bướm đen, sơ mi tuxedo xếp ly',
    defaultColors: 'Đen bóng nhung & Trắng tinh khôi',
    promptDescription: 'Wearing a formal black-tie tuxedo jacket with silk satin shawl lapels, pleated tuxedo shirt, crisp black bowtie, elegant black cummerbund, James Bond red-carpet level sophistication',
    palette: ['#0A0A0A', '#FFFFFF', '#222222'],
  },

  // Nghỉ dưỡng & Mùa hè
  {
    id: 'summer-resort-linen',
    name: 'Bộ Linen Nghỉ Dưỡng Địa Trung Hải',
    nameEn: 'Mediterranean Summer Linen Resortwear',
    category: 'resort',
    gender: 'unisex',
    description: 'Chất vải đũi linen tự nhiên thoáng mát, màu trắng ngà thư thái thích hợp cho chuyến du lịch biển cao cấp.',
    pieces: 'Áo sơ mi linen cổ mở phóng khoáng, quần short hoặc quần dài đũi suông',
    defaultColors: 'Trắng ngà & Be mộc',
    promptDescription: 'Wearing effortless luxury resortwear: airy natural off-white linen button-down shirt with open collar, matching breathable relaxed linen trousers, coastal resort aesthetic',
    palette: ['#F4F1EA', '#D8CCA3', '#496B71'],
  },
  {
    id: 'parisian-tweed-jacket',
    name: 'Áo Dạ Tweed Tiểu Thư Kiểu Pháp',
    nameEn: 'Chic Parisian Tweed Jacket & Skirt',
    category: 'office',
    gender: 'female',
    description: 'Áo khoác vải tweed dệt hoa văn tỉ mỉ viền khuy mạ vàng sang chảnh, phong thái tiểu thư tài phiệt.',
    pieces: 'Áo khoác croptop vải tweed dệt ánh kim, khuy vàng cổ điển, chân váy chữ A',
    defaultColors: 'Hồng phấn pastel hoặc Trắng viền đen',
    promptDescription: 'Wearing a luxury French haute-couture woven tweed cropped jacket with ornate gold embossed buttons, delicate braided trims, matching skirt, wealthy heiress Parisian aesthetic',
    palette: ['#EAD7D7', '#D4AF37', '#1F1F1F'],
    weatherSuitability: 'pleasant',
    tempRange: '18°C - 24°C',
  },

  // Áo khoác Mùa đông & Giữ ấm (Thời tiết lạnh)
  {
    id: 'winter-wool-trench',
    name: 'Áo Măng Tô Dạ Mùa Đông & Khăn Len',
    nameEn: 'Classic Wool Trench Coat & Cashmere Scarf',
    category: 'winter',
    gender: 'unisex',
    description: 'Áo khoác măng tô dạ dáng dài màu be camel thượng hạng phối khăn len cashmere ấm áp, sang trọng cho ngày se lạnh và gió rét.',
    pieces: 'Áo măng tô dạ dài qua gối 2 hàng khuy, khăn quàng cổ cashmere xám ấm, áo len cổ lọ',
    defaultColors: 'Màu nâu be Camel & Xám tiêu',
    promptDescription: 'Wearing a luxurious tailored wool camel trench coat over an ivory turtleneck knit sweater, soft cashmere wool scarf wrapped around neck, winter gloves, elegant European winter street style',
    palette: ['#9E7B54', '#D4C4B5', '#242426'],
    weatherSuitability: 'cold',
    tempRange: 'Dưới 19°C (Trời lạnh)',
  },
  {
    id: 'cozy-puffer-jacket',
    name: 'Áo Phao Béo Puffer Jacket & Mũ Beanie',
    nameEn: 'Warm Oversized Puffer Jacket & Beanie',
    category: 'winter',
    gender: 'unisex',
    description: 'Áo khoác phao phồng chống gió tuyết và mưa lạnh, kết hợp mũ len beanie trẻ trung năng động kiểu Hàn Quốc.',
    pieces: 'Áo phao chần bông siêu ấm, mũ len dệt kim beanie, quần jogger nỉ dày dặn',
    defaultColors: 'Đen mờ (Matte Black) & Trắng sữa',
    promptDescription: 'Wearing a trendy modern matte black oversized puffer jacket, warm ribbed knit beanie hat, cozy fleece inner hoodie, protecting from cold wind, Seoul winter aesthetic',
    palette: ['#1E1F24', '#ECEFF1', '#78909C'],
    weatherSuitability: 'cold',
    tempRange: 'Dưới 15°C (Giá rét/Mưa gió)',
  },
];

// Realistic high-quality SVG sample portraits with diverse facial shapes & styles
// This ensures the user can test the app instantly with zero setup
const femaleSample1 = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <defs>
    <linearGradient id="bgF1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%23e8ecf2"/>
      <stop offset="100%" stop-color="%23c5cfde"/>
    </linearGradient>
    <linearGradient id="skinF1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="%23fce2d0"/>
      <stop offset="100%" stop-color="%23f5caa8"/>
    </linearGradient>
    <linearGradient id="hairF1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="%232b211e"/>
      <stop offset="100%" stop-color="%2317100e"/>
    </linearGradient>
  </defs>
  <rect width="500" height="500" fill="url(%23bgF1)"/>
  <!-- Body/Clothes -->
  <path d="M120 480 C150 370 200 350 250 350 C300 350 350 370 380 480 Z" fill="%23434d59"/>
  <!-- Neck -->
  <path d="M225 300 L275 300 L285 365 L215 365 Z" fill="url(%23skinF1)"/>
  <!-- Head & Face (Oval) -->
  <ellipse cx="250" cy="240" rx="72" ry="92" fill="url(%23skinF1)"/>
  <!-- Hair Base/Back -->
  <path d="M170 200 C165 290 170 410 195 430 C215 440 215 370 215 320 L285 320 C285 370 285 440 305 430 C330 410 335 290 330 200 Z" fill="url(%23hairF1)"/>
  <!-- Eyes -->
  <ellipse cx="220" cy="235" rx="11" ry="6" fill="%23ffffff"/>
  <ellipse cx="280" cy="235" rx="11" ry="6" fill="%23ffffff"/>
  <circle cx="220" cy="235" r="5" fill="%232c1b18"/>
  <circle cx="280" cy="235" r="5" fill="%232c1b18"/>
  <circle cx="222" cy="233" r="1.5" fill="%23ffffff"/>
  <circle cx="282" cy="233" r="1.5" fill="%23ffffff"/>
  <!-- Eyebrows -->
  <path d="M205 220 Q220 215 235 221" stroke="%233a251e" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M265 221 Q280 215 295 220" stroke="%233a251e" stroke-width="3" fill="none" stroke-linecap="round"/>
  <!-- Nose -->
  <path d="M248 235 L246 258 Q250 262 254 258" stroke="%23d6a27e" stroke-width="2" fill="none" stroke-linecap="round"/>
  <!-- Lips -->
  <path d="M232 280 Q250 274 268 280 Q250 293 232 280 Z" fill="%23d96b6b"/>
  <!-- Blush -->
  <ellipse cx="205" cy="256" rx="14" ry="7" fill="%23f79d9d" opacity="0.4"/>
  <ellipse cx="295" cy="256" rx="14" ry="7" fill="%23f79d9d" opacity="0.4"/>
  <!-- Hair Top/Front -->
  <path d="M178 220 C170 140 330 140 322 220 C300 185 280 180 250 180 C220 180 200 185 178 220 Z" fill="url(%23hairF1)"/>
  <path d="M182 200 C200 190 230 200 240 215 C230 190 210 185 182 200 Z" fill="%23382924"/>
  <path d="M318 200 C300 190 270 200 260 215 C270 190 290 185 318 200 Z" fill="%23382924"/>
  <!-- Text Label -->
  <rect x="20" y="445" rx="12" ry="12" width="160" height="36" fill="rgba(0,0,0,0.6)"/>
  <text x="100" y="468" fill="%23ffffff" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">Mẫu Nữ 1 (Mai Anh)</text>
</svg>`;

const maleSample1 = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <defs>
    <linearGradient id="bgM1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%23dfe5ec"/>
      <stop offset="100%" stop-color="%23b8c4d4"/>
    </linearGradient>
    <linearGradient id="skinM1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="%23f7dbca"/>
      <stop offset="100%" stop-color="%23e5beaa"/>
    </linearGradient>
    <linearGradient id="hairM1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="%231a1818"/>
      <stop offset="100%" stop-color="%232c2523"/>
    </linearGradient>
  </defs>
  <rect width="500" height="500" fill="url(%23bgM1)"/>
  <!-- Shoulders / Jacket -->
  <path d="M100 480 C130 360 190 340 250 340 C310 340 370 360 400 480 Z" fill="%23243142"/>
  <!-- Shirt Collar -->
  <polygon points="250,340 220,390 280,390" fill="%23ffffff"/>
  <!-- Neck -->
  <path d="M220 295 L280 295 L285 355 L215 355 Z" fill="url(%23skinM1)"/>
  <!-- Jaw / Face (Square masculine) -->
  <path d="M185 220 C185 180 315 180 315 220 C315 270 295 305 268 318 C256 322 244 322 232 318 C205 305 185 270 185 220 Z" fill="url(%23skinM1)"/>
  <!-- Eyes -->
  <ellipse cx="220" cy="235" rx="10" ry="5.5" fill="%23ffffff"/>
  <ellipse cx="280" cy="235" rx="10" ry="5.5" fill="%23ffffff"/>
  <circle cx="220" cy="235" r="4.8" fill="%231f1816"/>
  <circle cx="280" cy="235" r="4.8" fill="%231f1816"/>
  <!-- Eyebrows (Strong) -->
  <path d="M205 218 L235 220" stroke="%231f1816" stroke-width="4" stroke-linecap="round"/>
  <path d="M265 220 L295 218" stroke="%231f1816" stroke-width="4" stroke-linecap="round"/>
  <!-- Nose -->
  <path d="M250 230 L248 258 L254 258" stroke="%23b88b72" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <!-- Lips -->
  <path d="M232 282 Q250 279 268 282 Q250 290 232 282 Z" fill="%23b86558"/>
  <!-- Hair (Short modern parted) -->
  <path d="M175 210 C170 140 330 140 325 210 C325 180 310 160 250 160 C190 160 175 180 175 210 Z" fill="url(%23hairM1)"/>
  <path d="M175 210 C185 170 230 165 245 175 C235 170 190 175 175 210 Z" fill="%233a3230"/>
  <!-- Text Label -->
  <rect x="20" y="445" rx="12" ry="12" width="160" height="36" fill="rgba(0,0,0,0.6)"/>
  <text x="100" y="468" fill="%23ffffff" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">Mẫu Nam 1 (Quang Huy)</text>
</svg>`;

const femaleSample2 = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <defs>
    <linearGradient id="bgF2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%23f0e8e4"/>
      <stop offset="100%" stop-color="%23d6c4bc"/>
    </linearGradient>
    <linearGradient id="skinF2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="%23f9ded2"/>
      <stop offset="100%" stop-color="%23eec4b2"/>
    </linearGradient>
    <linearGradient id="hairF2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="%235a392b"/>
      <stop offset="100%" stop-color="%233e2419"/>
    </linearGradient>
  </defs>
  <rect width="500" height="500" fill="url(%23bgF2)"/>
  <path d="M120 480 C150 380 200 360 250 360 C300 360 350 380 380 480 Z" fill="%236e5246"/>
  <path d="M225 300 L275 300 L285 370 L215 370 Z" fill="url(%23skinF2)"/>
  <ellipse cx="250" cy="240" rx="70" ry="88" fill="url(%23skinF2)"/>
  <!-- Eyes -->
  <ellipse cx="222" cy="236" rx="10" ry="6" fill="%23ffffff"/>
  <ellipse cx="278" cy="236" rx="10" ry="6" fill="%23ffffff"/>
  <circle cx="222" cy="236" r="4.8" fill="%233c2a24"/>
  <circle cx="278" cy="236" r="4.8" fill="%233c2a24"/>
  <circle cx="224" cy="234" r="1.5" fill="%23ffffff"/>
  <circle cx="280" cy="234" r="1.5" fill="%23ffffff"/>
  <path d="M208 222 Q222 217 236 222" stroke="%23483025" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M264 222 Q278 217 292 222" stroke="%23483025" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <!-- Lips -->
  <path d="M234 282 Q250 276 266 282 Q250 292 234 282 Z" fill="%23c95159"/>
  <!-- Hair: Short chic bob -->
  <path d="M172 230 C165 140 335 140 328 230 C335 285 315 310 295 305 C290 280 285 240 285 200 L215 200 C215 240 210 280 205 305 C185 310 165 285 172 230 Z" fill="url(%23hairF2)"/>
  <!-- Label -->
  <rect x="20" y="445" rx="12" ry="12" width="160" height="36" fill="rgba(0,0,0,0.6)"/>
  <text x="100" y="468" fill="%23ffffff" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">Mẫu Nữ 2 (Thu Hà)</text>
</svg>`;

const maleSample2 = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <defs>
    <linearGradient id="bgM2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%23ecefe6"/>
      <stop offset="100%" stop-color="%23c7cfbf"/>
    </linearGradient>
    <linearGradient id="skinM2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="%23f7e1d2"/>
      <stop offset="100%" stop-color="%23e8c7b3"/>
    </linearGradient>
    <linearGradient id="hairM2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="%2322252a"/>
      <stop offset="100%" stop-color="%23131518"/>
    </linearGradient>
  </defs>
  <rect width="500" height="500" fill="url(%23bgM2)"/>
  <path d="M100 480 C130 360 190 340 250 340 C310 340 370 360 400 480 Z" fill="%231e293b"/>
  <path d="M220 295 L280 295 L285 355 L215 355 Z" fill="url(%23skinM2)"/>
  <ellipse cx="250" cy="245" rx="72" ry="85" fill="url(%23skinM2)"/>
  <!-- Eyes -->
  <ellipse cx="220" cy="240" rx="9" ry="5.5" fill="%23ffffff"/>
  <ellipse cx="280" cy="240" rx="9" ry="5.5" fill="%23ffffff"/>
  <circle cx="220" cy="240" r="4.5" fill="%231a1a1a"/>
  <circle cx="280" cy="240" r="4.5" fill="%231a1a1a"/>
  <path d="M205 224 L235 226" stroke="%231f1816" stroke-width="3.5" stroke-linecap="round"/>
  <path d="M265 226 L295 224" stroke="%231f1816" stroke-width="3.5" stroke-linecap="round"/>
  <path d="M234 286 Q250 282 266 286 Q250 294 234 286 Z" fill="%23ba685c"/>
  <!-- Hair: Messy K-style waves -->
  <path d="M175 220 C170 145 330 145 325 220 C310 170 290 185 270 195 C250 175 230 195 210 180 C190 195 180 180 175 220 Z" fill="url(%23hairM2)"/>
  <!-- Label -->
  <rect x="20" y="445" rx="12" ry="12" width="160" height="36" fill="rgba(0,0,0,0.6)"/>
  <text x="100" y="468" fill="%23ffffff" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">Mẫu Nam 2 (Minh Triết)</text>
</svg>`;

export const SAMPLE_MODELS: SampleModel[] = [
  {
    id: 'sample-f1',
    name: 'Mai Anh (Nữ - Mặt Trái Xoan)',
    gender: 'female',
    description: 'Khuôn mặt cân đối, mắt sáng, phù hợp thử hầu hết mọi kiểu tóc dài lẫn ngắn và thời trang công sở.',
    imageUrl: femaleSample1,
    faceShape: 'Mặt trái xoan',
  },
  {
    id: 'sample-m1',
    name: 'Quang Huy (Nam - Mặt Góc Cạnh)',
    gender: 'male',
    description: 'Xương quai hàm sắc nét, đường nét nam tính, rất hợp kiểu tóc Undercut, Two-block, Suit công sở.',
    imageUrl: maleSample1,
    faceShape: 'Mặt góc cạnh',
  },
  {
    id: 'sample-f2',
    name: 'Thu Hà (Nữ - Mặt Tròn Nhỏ)',
    gender: 'female',
    description: 'Đường nét thanh tú dễ thương, lý tưởng để thử Layer mái bay, tóc Bob Pháp và váy dạ tiệc.',
    imageUrl: femaleSample2,
    faceShape: 'Mặt tròn',
  },
  {
    id: 'sample-m2',
    name: 'Minh Triết (Nam - Mặt Dài Lãng Tử)',
    gender: 'male',
    description: 'Phong cách thư sinh hiện đại, thích hợp trải nghiệm xoăn sóng Hàn Quốc, Mullet và Streetwear.',
    imageUrl: maleSample2,
    faceShape: 'Mặt dài',
  },
];
