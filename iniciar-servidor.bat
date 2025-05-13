@echo off
echo ===================================
echo  INICIANDO SERVIDOR JB IMPORTES
echo ===================================
echo.
echo Instalando dependencias...
call npm install
echo.
echo Configurando banco de dados MySQL...
call npm run setup-db
echo.
echo Iniciando o servidor...
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
pause 