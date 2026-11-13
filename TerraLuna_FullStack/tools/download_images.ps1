# Windows alternative: powershell -ExecutionPolicy Bypass -File tools\download_images.ps1
$q=@{
  'atacama'='Atacama Desert'
  'haughton'='Haughton impact structure'
  'death-valley'='Death Valley National Park'
  'mcmurdo'='McMurdo Dry Valleys'
  'mauna-kea'='Mauna Kea'
  'iceland-holuhraun'='Askja'
  'rio-tinto'='Rio Tinto river Spain Huelva'
  'lonar-crater'='Lonar crater'
  'ladakh-puga'='Ladakh'
  'deccan-traps'='Deccan Traps'
  'thar-desert'='Thar Desert'
  'sambhar-lake'='Sambhar Lake'
}
$dir=Join-Path $PSScriptRoot '..\TerraLuna.Presentation\wwwroot\img'
New-Item -ItemType Directory -Force $dir | Out-Null
$ua='TerraLunaHackathon/1.0 (student project)'
foreach($k in $q.Keys){
  try{
    $u='https://en.wikipedia.org/w/api.php?action=query&format=json&generator=search&gsrlimit=1&prop=pageimages&piprop=thumbnail&pithumbsize=1000&gsrsearch='+[uri]::EscapeDataString($q[$k])
    $j=Invoke-RestMethod $u -UserAgent $ua
    $src=($j.query.pages.PSObject.Properties | Select-Object -First 1).Value.thumbnail.source
    Invoke-WebRequest $src -OutFile (Join-Path $dir "$k.jpg") -UserAgent $ua
    "OK   $k"
  }catch{ "FAIL $k  $_" }
}
