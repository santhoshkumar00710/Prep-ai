$base = "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"
$dest = "public\models"

New-Item -ItemType Directory -Force -Path $dest | Out-Null

$files = @(
  # Tiny face detector
  "tiny_face_detector_model-weights_manifest.json",
  "tiny_face_detector_model-shard1",
  # Face landmark 68
  "face_landmark_68_model-weights_manifest.json",
  "face_landmark_68_model-shard1",
  # Face expression
  "face_expression_model-weights_manifest.json",
  "face_expression_model-shard1"
)

foreach ($file in $files) {
  $url = "$base/$file"
  $out = "$dest\$file"
  Write-Host "Downloading $file..."
  try {
    Invoke-WebRequest -Uri $url -OutFile $out -UseBasicParsing -ErrorAction Stop
    Write-Host "  OK: $file"
  } catch {
    Write-Host "  FAILED: $file - $_"
  }
}

Write-Host "`nAll done! Models saved to $dest"
