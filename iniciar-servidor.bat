@echo off
echo ===================================
echo  INICIANDO SERVIDOR JB IMPORTES
echo ===================================
echo.
echo Instalando dependencias...
call npm install
echo.
echo Iniciando o servidor...
echo.
echo Quando o servidor estiver rodando, acesse:
echo http://localhost:3000
echo.
echo Para parar o servidor, pressione CTRL+C
echo.
call npm start
pause 