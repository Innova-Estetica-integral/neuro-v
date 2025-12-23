#!/bin/bash
# Security Verification Script
# Run after credential rotation to ensure system integrity

echo "🔐 SECURITY VERIFICATION SCRIPT"
echo "================================"
echo ""

PASS=0
FAIL=0

# 1. Check for exposed credentials in documentation
echo "1. Scanning documentation for exposed credentials..."
if grep -r "PLACEHOLDER_SB_TOKEN" *.md 2>/dev/null; then
    echo "   ❌ FAIL: Old Supabase token still found in docs"
    FAIL=$((FAIL+1))
else
    echo "   ✅ PASS: Old Supabase token not found"
    PASS=$((PASS+1))
fi

if grep -r "PLACEHOLDER_VC_TOKEN" *.md 2>/dev/null; then
    echo "   ❌ FAIL: Old Vercel token still found in docs"
    FAIL=$((FAIL+1))
else
    echo "   ✅ PASS: Old Vercel token not found"
    PASS=$((PASS+1))
fi

if grep -r "PLACEHOLDER_GH_TOKEN" *.md 2>/dev/null; then
    echo "   ❌ FAIL: Old GitHub token still found in docs"
    FAIL=$((FAIL+1))
else
    echo "   ✅ PASS: Old GitHub token not found"
    PASS=$((PASS+1))
fi

# 2. Check .env.local exists and is in .gitignore
echo ""
echo "2. Checking environment configuration..."
if [ -f ".env.local" ]; then
    echo "   ✅ PASS: .env.local exists"
    PASS=$((PASS+1))
else
    echo "   ⚠️  WARNING: .env.local not found (create from .env.example)"
fi

if grep -q ".env.local" .gitignore; then
    echo "   ✅ PASS: .env.local in .gitignore"
    PASS=$((PASS+1))
else
    echo "   ❌ FAIL: .env.local NOT in .gitignore"
    FAIL=$((FAIL+1))
fi

# 3. Check Vercel environment variables
echo ""
echo "3. Checking Vercel environment variables..."
if command -v vercel &> /dev/null; then
    if vercel env ls production 2>/dev/null | grep -q "NEXT_PUBLIC_SUPABASE_URL"; then
        echo "   ✅ PASS: Vercel env vars configured"
        PASS=$((PASS+1))
    else
        echo "   ⚠️  WARNING: Vercel env vars not configured or CLI not authenticated"
    fi
else
    echo "   ⚠️  INFO: Vercel CLI not installed (skip check)"
fi

# 4. Test Supabase connection (if .env.local exists)
echo ""
echo "4. Testing Supabase connection..."
if [ -f ".env.local" ]; then
    source .env.local
    if [ -n "$NEXT_PUBLIC_SUPABASE_URL" ]; then
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
            -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
            "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/")
        
        if [ "$HTTP_CODE" = "200" ]; then
            echo "   ✅ PASS: Supabase connection successful"
            PASS=$((PASS+1))
        else
            echo "   ❌ FAIL: Supabase connection failed (HTTP $HTTP_CODE)"
            FAIL=$((FAIL+1))
        fi
    else
        echo "   ⚠️  WARNING: NEXT_PUBLIC_SUPABASE_URL not set in .env.local"
    fi
else
    echo "   ⚠️  SKIP: .env.local not found"
fi

# 5. Check Git hooks for secret detection
echo ""
echo "5. Checking Git security hooks..."
if [ -f ".git/hooks/pre-commit" ]; then
    if grep -q "secrets" .git/hooks/pre-commit; then
        echo "   ✅ PASS: Git secrets hook installed"
        PASS=$((PASS+1))
    else
        echo "   ⚠️  WARNING: pre-commit hook exists but no secret detection"
    fi
else
    echo "   ⚠️  WARNING: No pre-commit hook (install git-secrets recommended)"
fi

# Summary
echo ""
echo "================================"
echo "VERIFICATION SUMMARY"
echo "================================"
echo "✅ Passed: $PASS"
echo "❌ Failed: $FAIL"
echo ""

if [ $FAIL -eq 0 ]; then
    echo "🎉 All security checks passed!"
    exit 0
else
    echo "⚠️  Some security checks failed. Review above output."
    exit 1
fi
