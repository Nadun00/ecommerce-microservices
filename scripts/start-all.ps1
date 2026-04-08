$root = Split-Path -Parent $PSScriptRoot
$services = @(
  'backend\product-service',
  'backend\user-service',
  'backend\cart-service',
  'backend\order-service',
  'backend\payment-service',
  'backend\api-gateway'
)

$npmCmd = 'C:\Program Files\nodejs\npm.cmd'

foreach ($service in $services) {
  $fullPath = Join-Path $root $service
  Start-Process -FilePath $npmCmd -ArgumentList 'start' -WorkingDirectory $fullPath -WindowStyle Hidden
}

Write-Output 'Started product-service, user-service, cart-service, order-service, payment-service, and api-gateway.'
