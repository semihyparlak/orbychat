$path = 'lang/tr.json'
$content = Get-Content $path -Raw
if ($content -match '(?s)(.*)"Saving\.\.\.": "Kaydediliyor\.\.\."\s*\}') {
    $newContent = $matches[1] + '"Saving...": "Kaydediliyor...",' + "`r`n" +
                  '    "Setup progress": "Kurulum aşaması",' + "`r`n" +
                  '    "Core workflow": "Temel iş akışı",' + "`r`n" +
                  '    "Optimize and grow": "Optimize et ve büyüt",' + "`r`n" +
                  '    "Knowledge": "Bilgi Birikimi",' + "`r`n" +
                  '    "Playground": "Oyun Alanı",' + "`r`n" +
                  '    "Publishing": "Yayınlama",' + "`r`n" +
                  '    "Confidence": "Güven",' + "`r`n" +
                  '    "Agent workspace": "Asistan çalışma alanı",' + "`r`n" +
                  '    "Widget can be installed": "Araç kurulabilir"' + "`r`n" +
                  '}'
    Set-Content $path $newContent -NoNewline
    Write-Host "Success"
} else {
    Write-Host "Pattern not found"
}
