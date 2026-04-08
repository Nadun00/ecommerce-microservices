$ports = 3001,3002,3003,3004,3005,5000

$pids = foreach ($port in $ports) {
  netstat -ano | Select-String ":$port\s" | ForEach-Object {
    $parts = ($_ -split '\s+') | Where-Object { $_ -ne '' }
    if ($parts.Length -gt 0) {
      $parts[-1]
    }
  }
}

$pids | Sort-Object -Unique | ForEach-Object {
  if ($_ -match '^\d+$') {
    try {
      Stop-Process -Id $_ -Force -ErrorAction Stop
    } catch {
    }
  }
}

Write-Output 'Stopped services on ports 3001, 3002, 3003, 3004, 3005, and 5000.'
