import { performBackup } from './backup';
import config from './config.json';

// Функция для запуска таймера
function startBackupTimer(): void {
	const backupInterval = config.backupInterval;

	// Выполняем бэкап сразу
	performBackup();

	// Настраиваем интервал для автоматического создания бэкапов
	setInterval(() => {
		performBackup();
	}, backupInterval);
}

startBackupTimer();
