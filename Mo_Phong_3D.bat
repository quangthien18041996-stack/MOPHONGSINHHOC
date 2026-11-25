@echo off
title Mo Phong 3D He Tuan Hoan Mau
echo ========================================================
echo   MO PHONG 3D HE TUAN HOAN MAU - GIAO DUC TRUC QUAN
echo ========================================================
echo.
echo Dang khoi chay may chu web cuc bo va mo trinh duyet...
start "" "http://localhost:8088/index.html"
python -m http.server 8088
pause
