@echo off
rem Abre R Archilla: arranca un servidor local en el puerto 8421 y abre el navegador.
rem Deja esta ventana abierta mientras uses la app (ciérrala para apagarla).
cd /d "%~dp0"
start "" "http://localhost:8421/index.html"
python -m http.server 8421
