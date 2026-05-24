# TOTOSHA Production Final Clean

Запуск на Windows PowerShell:

```powershell
npm config set registry https://registry.npmjs.org/
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue
npm cache clean --force
npm install
npm run dev
```

Открыть: http://localhost:3000

Если порт занят:

```powershell
npx kill-port 3000
npm run dev
```
