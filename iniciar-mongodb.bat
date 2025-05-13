@echo off
echo ===================================
echo  INICIANDO MONGODB E JB IMPORTES
echo ===================================
echo.

echo Verificando se o MongoDB está instalado...
where mongod >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERRO: MongoDB não encontrado. Por favor, instale o MongoDB Community Edition.
    echo Acesse: https://www.mongodb.com/try/download/community
    echo.
    pause
    exit /b
)

echo.
echo Iniciando o servidor MongoDB...
start "MongoDB Server" mongod --dbpath="data"

echo.
echo Aguardando o MongoDB iniciar (5 segundos)...
timeout /t 5 /nobreak >nul

echo.
echo Instalando dependências...
call npm install mongodb

echo.
echo Iniciando o servidor JB IMPORTES...
echo.
echo Quando o servidor estiver rodando, acesse:
echo http://localhost:3000
echo.
echo Para acessar de outros computadores na rede, use o endereco IP do servidor:
ipconfig | findstr IPv4
echo.
echo Para parar o servidor, pressione CTRL+C
echo.
call npm start

echo.
echo Encerrando o MongoDB...
taskkill /f /im mongod.exe >nul 2>&1

pause 