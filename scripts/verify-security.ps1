# Security Verification Script (PowerShell)
# Run after credential rotation to ensure system integrity

Write-Host "🔐 SECURITY VERIFICATION SCRIPT" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

$PASS = 0
$FAIL = 0

# 1. Check for exposed credentials in documentation
Write-Host "1. Scanning documentation for exposed credentials..." -ForegroundColor Yellow

$oldSupabaseToken = "sbp_9bf24c2db7f3224e018768ff27f50ea1e04b55d1"
$oldVercelToken = "sWiSQFvHKQSk8D3SorxcugIG"
$oldGitHubToken = "ghp_PLACEHOLDER_FOR_SECURITY"

if (Select-String -Path "*.md" -Pattern $oldSupabaseToken -Quiet) {
    Write-Host "   ❌ FAIL: Old Supabase token still found in docs" -ForegroundColor Red
    $FAIL++
} else {
    Write-Host "   ✅ PASS: Old Supabase token not found" -ForegroundColor Green
    $PASS++
}

if (Select-String -Path "*.md" -Pattern $oldVercelToken -Quiet) {
    Write-Host "   ❌ FAIL: Old Vercel token still found in docs" -ForegroundColor Red
    $FAIL++
} else {
    Write-Host "   ✅ PASS: Old Vercel token not found" -ForegroundColor Green
    $PASS++
}

if (Select-String -Path "*.md" -Pattern $oldGitHubToken -Quiet) {
    Write-Host "   ❌ FAIL: Old GitHub token still found in docs" -ForegroundColor Red
    $FAIL++
} else {
    Write-Host "   ✅ PASS: Old GitHub token not found" -ForegroundColor Green
    $PASS++
}

# 2. Check .env.local exists and is in .gitignore
Write-Host ""
Write-Host "2. Checking environment configuration..." -ForegroundColor Yellow

if (Test-Path ".env.local") {
    Write-Host "   ✅ PASS: .env.local exists" -ForegroundColor Green
    $PASS++
} else {
    Write-Host "   ⚠️  WARNING: .env.local not found (create from .env.example)" -ForegroundColor Yellow
}

if (Select-String -Path ".gitignore" -Pattern ".env.local" -Quiet) {
    Write-Host "   ✅ PASS: .env.local in .gitignore" -ForegroundColor Green
    $PASS++
} else {
    Write-Host "   ❌ FAIL: .env.local NOT in .gitignore" -ForegroundColor Red
    $FAIL++
}

# 3. Check Vercel CLI
Write-Host ""
Write-Host "3. Checking Vercel CLI..." -ForegroundColor Yellow

if (Get-Command vercel -ErrorAction SilentlyContinue) {
    Write-Host "   ✅ PASS: Vercel CLI installed" -ForegroundColor Green
    $PASS++
} else {
    Write-Host "   ⚠️  INFO: Vercel CLI not installed" -ForegroundColor Yellow
}

# 4. Test Supabase connection
Write-Host ""
Write-Host "4. Testing Supabase connection..." -ForegroundColor Yellow

if (Test-Path ".env.local") {
    Get-Content ".env.local" | ForEach-Object {
        if ($_ -match "NEXT_PUBLIC_SUPABASE_URL=(.+)") {
            $env:NEXT_PUBLIC_SUPABASE_URL = $matches[1]
        }
        if ($_ -match "NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)") {
            $env:NEXT_PUBLIC_SUPABASE_ANON_KEY = $matches[1]
        }
    }
    
    if ($env:NEXT_PUBLIC_SUPABASE_URL) {
        try {
            $response = Invoke-WebRequest -Uri "$($env:NEXT_PUBLIC_SUPABASE_URL)/rest/v1/" `
                -Headers @{
                    "apikey" = $env:NEXT_PUBLIC_SUPABASE_ANON_KEY
                } `
                -Method Get `
                -ErrorAction Stop
            
            if ($response.StatusCode -eq 200) {
                Write-Host "   ✅ PASS: Supabase connection successful" -ForegroundColor Green
                $PASS++
            }
        } catch {
            Write-Host "   ❌ FAIL: Supabase connection failed" -ForegroundColor Red
            $FAIL++
        }
    } else {
        Write-Host "   ⚠️  WARNING: NEXT_PUBLIC_SUPABASE_URL not set" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ⚠️  SKIP: .env.local not found" -ForegroundColor Yellow
}

# Summary
Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "VERIFICATION SUMMARY" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host "✅ Passed: $PASS" -ForegroundColor Green
Write-Host "❌ Failed: $FAIL" -ForegroundColor Red
Write-Host ""

if ($FAIL -eq 0) {
    Write-Host "🎉 All security checks passed!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "⚠️  Some security checks failed. Review above output." -ForegroundColor Yellow
    exit 1
}
