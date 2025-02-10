import * as fs from 'fs';
import * as path from 'path';

const baseEntityFields = {
	createAt: `createdAt DateTime @default(now()) @map("create_at")
    /// @DtoCreateHidden
    /// @DtoUpdateHidden`,
	updateAt: `updatedAt DateTime @updatedAt @map("update_at")
    /// @DtoCreateHidden
    /// @DtoUpdateHidden`,
	deletedAt: `deletedAt DateTime? @map("deleted_at")`,
};

const schemaDir = './prisma/schemas';
const files = fs.readdirSync(schemaDir).filter((file) => file.endsWith('.prisma'));

function splitText(input: string) {
	// Tách chuỗi thành mảng các dòng
	const lines = input.split('\n');

	// Bỏ qua các dòng trống ở đầu (để tránh trường hợp dòng đầu tiên là rỗng)
	let startIndex = 0;
	while (startIndex < lines.length && lines[startIndex].trim() === '') {
		startIndex++;
	}

	// Tìm chỉ số dòng chứa từ "status" từ vị trí startIndex trở đi
	let statusLineIndex = -1;
	for (let i = startIndex; i < lines.length; i++) {
		if (/\bstatus\b/.test(lines[i])) {
			statusLineIndex = i;
			break;
		}
	}

	let splitIndex = 0;
	if (statusLineIndex !== -1) {
		// Nếu có dòng chứa "status", bắt đầu từ đó và lùi dần cho đến khi
		// dòng liền trên không bắt đầu bằng "///"
		splitIndex = statusLineIndex;
		while (
			splitIndex > startIndex &&
			lines[splitIndex - 1].trim().startsWith('///')
		) {
			splitIndex--;
		}
	} else {
		// Nếu không có "status", tìm dòng trống đầu tiên sau startIndex
		const blankLineIndex = lines.findIndex(
			(line, idx) => idx >= startIndex + 1 && line.trim() === '',
		);
		if (blankLineIndex !== -1) {
			splitIndex = blankLineIndex;
		} else {
			// Nếu không tìm thấy dòng trống, ta xem toàn bộ file là phần 1
			splitIndex = lines.length;
		}
	}

	// Ghép lại các dòng từ startIndex cho phần 1, và phần còn lại cho part2
	const part1 = lines.slice(startIndex, splitIndex).join('\n');
	const part2 = lines.slice(splitIndex).join('\n');

	return { part1, part2 };
}

files.forEach((file) => {
	const filePath = path.join(schemaDir, file);
	let content = fs.readFileSync(filePath, 'utf-8');

	// Tìm tất cả các model trong file
	const modelRegex = /model (\w+) {([\s\S]*?)}/g;
	let updatedContent = content;
	let hasChanges = false;
	const modelsUpdate = [
		'role',
		'permission',
		'infoPermission',
		'user',
		'accountExternal',
		'account',
		'productCategory',
		'providerMap',
		'mapAddress',
		'location',
		'product',
		'productRate',
		'productSchedule',
		'discountType',
		'discountEligibility',
		'discountApplicationScope',
		'discount',
		'infoDiscount',
		'boxChatMember',
		'message',
		'paymentMethod',
		'transaction',
		'bill',
	];

	updatedContent = updatedContent.replace(modelRegex, (match, modelName, modelBody) => {

		let missingFields = [];

		// Kiểm tra từng trường của BaseEntity
		Object.entries(baseEntityFields).forEach(([key, fieldDefinition]) => {
			// Dùng regex để kiểm tra xem trường đã tồn tại chưa (có thể có @map() hoặc không)
			const fieldRegex = new RegExp(`\\b${key}\\s+\\w+`, 'i');
			if (!fieldRegex.test(modelBody)) {
				missingFields.push(fieldDefinition);
			}
		});
		if (!modelsUpdate.includes(modelName)) {
			console.log(`⏩ Bỏ qua (không nằm trong danh sách cập nhật): ${modelName}`);
			return match;
		}

		// Nếu thiếu trường thì mới cập nhật
		if (missingFields.length === 0) {
			console.log(`⏩ Bỏ qua (đã có BaseEntity): ${modelName}`);
			return match; // Không thay đổi model nếu đã có đầy đủ các trường
		}

		hasChanges = true;
		console.log(`✅ Cập nhật BaseEntity vào: ${modelName}`);

		// Thêm các trường còn thiếu vào đầu model
		const { part1, part2 } = splitText(modelBody);
		const newModelBody = `${part1}\n  ${missingFields.join('\n  ')}\n${part2}`;
		// const newModelBody = `\n  ${missingFields.join('\n  ')}\n${modelBody}`;
		return `model ${modelName} {${newModelBody}\n}`;
	});

	// Chỉ ghi lại file nếu có thay đổi
	if (hasChanges) {
		fs.writeFileSync(filePath, updatedContent, 'utf-8');
	}
});
