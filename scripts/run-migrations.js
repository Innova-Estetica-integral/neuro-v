const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

async function runMigrations() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
        console.error('❌ DATABASE_URL not found in .env.local');
        process.exit(1);
    }

    console.log('🚀 Running multi-tenant migrations...\n');

    const client = new Client({
        connectionString,
        connectionTimeoutMillis: 10000,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('✅ Connected to database\n');

        const migrations = [
            '001_multi_tenant_foundation.sql',
            '002_add_clinic_isolation.sql',
            '003_demo_clinic_alpha.sql'
        ];

        for (const migrationFile of migrations) {
            const migrationPath = path.join(__dirname, '../supabase/migrations', migrationFile);

            if (!fs.existsSync(migrationPath)) {
                console.log(`⏭️  Skipping ${migrationFile} (not found)`);
                continue;
            }

            console.log(`📄 Running migration: ${migrationFile}`);
            const sql = fs.readFileSync(migrationPath, 'utf8');

            try {
                await client.query(sql);
                console.log(`✅ ${migrationFile} completed\n`);
            } catch (error) {
                if (error.message.includes('already exists')) {
                    console.log(`ℹ️  ${migrationFile}: Some objects already exist, continuing...\n`);
                } else {
                    console.error(`❌ Error in ${migrationFile}:`, error.message);
                    throw error;
                }
            }
        }

        console.log('🎉 All migrations completed successfully!');
    } catch (error) {
        console.error('\n❌ Migration failed:', error.message);
        process.exit(1);
    } finally {
        await client.end();
    }
}

runMigrations();
