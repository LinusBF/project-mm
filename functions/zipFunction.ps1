$funcName=$args[0];
Add-Type -A 'System.IO.Compression.FileSystem';
[IO.Compression.ZipFile]::CreateFromDirectory($funcName, ($funcName + ".zip"));
Move-Item -Path ($funcName + ".zip") -Destination ($funcName + "\" + $funcName + ".zip")
