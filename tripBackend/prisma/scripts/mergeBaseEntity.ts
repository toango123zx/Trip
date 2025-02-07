const fs = require('fs');
const path = require('path');

const baseEntityFields = {
	id: 'id        String   @id @default(cuid())',
	createAt: 'createdAt DateTime @default(now())',
	updateAt: 'updatedAt DateTime @updatedAt',
	deletedAt: 'deletedAt DateTime?',
};

const schemaDir = './schemas';
const files = fs.readdirSync(schemaDir).filter((file) => file.endsWith('.prisma'));

files.forEach((file) => {
	const filePath = path.join(schemaDir, file);
	let content = fs.readFileSync(filePath, 'utf-8');

	// Tìm tất cả các model trong file
	const modelRegex = /model (\w+) {([\s\S]*?)}/g;
	let updatedContent = content;
	let hasChanges = false;

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

		// Nếu thiếu trường thì mới cập nhật
		if (missingFields.length === 0) {
			console.log(`⏩ Bỏ qua (đã có BaseEntity): ${modelName}`);
			return match; // Không thay đổi model nếu đã có đầy đủ các trường
		}

		hasChanges = true;
		console.log(`✅ Cập nhật BaseEntity vào: ${modelName}`);

		// Thêm các trường còn thiếu vào đầu model
		const newModelBody = `\n  ${missingFields.join('\n  ')}\n${modelBody}`;
		return `model ${modelName} {${newModelBody}\n}`;
	});

	// Chỉ ghi lại file nếu có thay đổi
	if (hasChanges) {
		fs.writeFileSync(filePath, updatedContent, 'utf-8');
	}
});
