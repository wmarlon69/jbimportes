@echo off
echo ===================================
echo  CONFIGURANDO FIREWALL PARA JB IMPORTES
echo ===================================
echo.
echo Abrindo porta 3000 no firewall do Windows...
echo.

:: Adicionar regra no firewall para a porta 3000 TCP
netsh advfirewall firewall add rule name="JB Importes - Porta 3000" dir=in action=allow protocol=TCP localport=3000

echo.
echo Regra adicionada com sucesso!
echo.
echo Se você ainda não conseguir acessar o site de outros dispositivos:
echo - Verifique se os dispositivos estão na mesma rede
echo - Certifique-se de que o servidor está rodando (npm start)
echo - Acesse usando o endereço: http://192.168.1.2:3000
echo.
echo Pressione qualquer tecla para sair...
pause > nul 