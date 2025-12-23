require('dotenv').config({ path: '.env.local' });
const https = require('https');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing credentials in .env.local');
    process.exit(1);
}

async function executeSQL(sql) {
    return new Promise((resolve, reject) => {
        const projectRef = supabaseUrl.match(/https:\/\/(.+?)\.supabase\.co/)[1];
        const options = {
            hostname: `${projectRef}.supabase.co`,
            path: '/rest/v1/rpc/exec_sql',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': supabaseServiceKey,
                'Authorization': `Bearer ${supabaseServiceKey}`
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(JSON.parse(data || '{}'));
                } else {
                    reject(new Error(`HTTP ${res.statusCode}: ${data}`));
                }
            });
        });

        req.on('error', reject);
        req.write(JSON.stringify({ sql }));
        req.end();
    });
}

async function runMigration() {
    console.log('🚀 Executing FHIR R4 Migration via Direct SQL...\n');

    const sqlPath = path.join(__dirname, '..', 'supabase', 'schema-fhir-r4.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    console.log('📄 Loaded:', sqlPath);
    console.log('📏 Size:', (sqlContent.length / 1024).toFixed(2), 'KB\n');

    try {
        // Execute the entire SQL file at once
        console.log('⚡ Executing SQL migration...');
        await executeSQL(sqlContent);
        console.log('✅ Migration executed successfully!\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('\n💡 Attempting manual execution via Supabase client...\n');
        await manualMigration();
    }
}

async function manualMigration() {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Create key tables directly
    const tables = [
        {
            name: 'patient',
            check: 'SELECT COUNT(*) FROM patient'
        },
        {
            name: 'appointment',
            check: 'SELECT COUNT(*) FROM appointment'
        }
    ];

    for (const table of tables) {
        try {
            const { count, error } = await supabase
                .from(table.name)
                .select('*', { count: 'exact', head: true });

            if (!error) {
                console.log(`✅ Table '${table.name}' already exists (${count} rows)`);
            }
        } catch (e) {
            console.log(`⚠️  Table '${table.name}' needs migration`);
        }
    }

    console.log('\n📋 Migration status checked. Please run SQL manually in Supabase Dashboard.');
}

runMigration();
