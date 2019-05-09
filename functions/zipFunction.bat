echo off
set name=%1
powershell.exe -nologo -noprofile -ExecutionPolicy Unrestricted -Command "& {Set-ExecutionPolicy -ExecutionPolicy Unrestricted; Start-Process -WindowStyle hidden  PowerShell -Verb RunAs -ArgumentList @(\"%~dp0zipFunction.ps1\", \"%name%\") -Wait}" -Wait
