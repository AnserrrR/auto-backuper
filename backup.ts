import * as fs from 'fs';
import * as path from 'path';
import * as fse from 'fs-extra';
import archiver from "archiver";
import config from './config.json';

// Создание архива
async function createBackup(): Promise<void> {
	const backupFolder = config.backupFolder;
	const sourceFolder = config.sourceFolder;

	// Убедимся, что папка для бэкапов существует
	fse.ensureDirSync(backupFolder);

	// Создаем уникальное имя для бэкапа
	const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
	const backupPath = path.join(backupFolder, `backup-${timestamp}.zip`);

	// Создаем поток для записи архива
	const output = fs.createWriteStream(backupPath);
	const archive = archiver('zip', {
		zlib: {level: 9},
	});

	output.on('close', () => {
		console.log(
			`Backup ${backupPath} created. Size: ${archive.pointer()} bytes.`
		);
	});

	archive.on('error', err => {
		throw err;
	});

	archive.pipe(output);

	// Добавляем содержимое папки в архив
	archive.directory(sourceFolder, false);
	await archive.finalize();
}

// Управление количеством бэкапов
async function manageBackups(): Promise<void> {
	const backupFolder = config.backupFolder;
	const maxBackups = config.maxBackups;

	// Получаем список всех файлов в папке бэкапов
	const files = await fse.readdir(backupFolder);

	// Отфильтровываем только zip-файлы и сортируем по дате создания (по имени файла)
	const backupFiles = files
		.filter(file => file.endsWith('.zip'))
		.sort((a, b) => {
			const timeA = fs.statSync(path.join(backupFolder, a)).mtime.getTime();
			const timeB = fs.statSync(path.join(backupFolder, b)).mtime.getTime();
			return timeA - timeB;
		});

	// Если количество бэкапов превышает максимум, удаляем старые
	while (backupFiles.length > maxBackups) {
		const oldestBackup = backupFiles.shift(); // Удаляем первый элемент (самый старый)
		const filePath = path.join(backupFolder, oldestBackup!);
		await fse.remove(filePath);
		console.log(`Deleted old backup: ${oldestBackup}`);
	}
}

// Основная функция бэкапа
async function performBackup(): Promise<void> {
	try {
		await createBackup();
		await manageBackups();
	} catch (error) {
		console.error('Error during backup:', error);
	}
}

export {performBackup};
