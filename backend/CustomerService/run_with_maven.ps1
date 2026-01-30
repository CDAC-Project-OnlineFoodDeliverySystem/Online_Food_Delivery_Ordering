$ErrorActionPreference = "Stop"

$mavenVersion = "3.9.6"
$mavenUrl = "https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/$mavenVersion/apache-maven-$mavenVersion-bin.zip"
$installDir = Join-Path $PSScriptRoot ".mvn_portable"
$mavenHome = Join-Path $installDir "apache-maven-$mavenVersion"
$mvnExecutable = Join-Path $mavenHome "bin\mvn.cmd"

# Check if global mvn exists
if (Get-Command "mvn" -ErrorAction SilentlyContinue) {
    Write-Host "Global Maven found. Running application..." -ForegroundColor Green
    mvn spring-boot:run
    exit
}

# Check if portable maven exists
if (-not (Test-Path $mvnExecutable)) {
    Write-Host "Maven not found. Downloading Portable Maven $mavenVersion..." -ForegroundColor Yellow
    
    if (-not (Test-Path $installDir)) {
        New-Item -ItemType Directory -Path $installDir | Out-Null
    }

    $zipPath = Join-Path $installDir "maven.zip"
    
    Invoke-WebRequest -Uri $mavenUrl -OutFile $zipPath -UseBasicParsing
    
    Write-Host "Extracting Maven..." -ForegroundColor Yellow
    Expand-Archive -Path $zipPath -DestinationPath $installDir -Force
    
    Remove-Item $zipPath
    Write-Host "Maven installed to $mavenHome" -ForegroundColor Green
}

# Run the app
Write-Host "Starting Customer Service..." -ForegroundColor Cyan
& $mvnExecutable spring-boot:run
