# Auto Backuper

Эта программа автоматически создаёт резервные копии указанной папки в виде ZIP-архивов и управляет их количеством.

## Установка

1. Клонируйте этот репозиторий на свой компьютер:

   ```bash
   git clone https://github.com/yourusername/auto-backuper.git
   cd auto-backuper

2. Установите зависимости:

   ```bash
   npm install

3. Создайте файл конфигурации config.json в корне проекта и настройте его:

   ```json
   {
	  "backupFolder": "./backups",
	  "sourceFolder": "./source",
	  "maxBackups": 5,
	  "backupInterval": "600000"
   }