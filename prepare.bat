call uglifyjs .\docs\storageui.js --compress --mangle --comments all --output .\dist\storageui.min.js
call xcopy .\docs\storageui.js .\dist\ /Y
