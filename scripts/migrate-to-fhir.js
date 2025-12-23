const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

async function migrate() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
        console.error('❌ DATABASE_URL not found');
        process.exit(1);
    }

    console.log('🚀 Executing migration with safe cleanup...');

    const client = new Client({
        connectionString: connectionString,
        connectionTimeoutMillis: 10000,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('✅ Connected!');

        const schemaPath = path.join(__dirname, '../supabase/schema-fhir-r4.sql');
        let sql = fs.readFileSync(schemaPath, 'utf8');

        const cleanupCommands = [
            "DROP TRIGGER IF EXISTS trigger_enforce_payment_gating ON appointment",
            "DROP TRIGGER IF EXISTS trigger_check_abandoned_carts ON appointment",
            "DROP TABLE IF EXISTS behavior_session CASCADE",
            "DROP TABLE IF EXISTS ltv_prediction CASCADE",
            "DROP TABLE IF EXISTS retention_schedule CASCADE",
            "DROP TABLE IF EXISTS pursuit_campaign CASCADE",
            "DROP TABLE IF EXISTS service_request CASCADE",
            "DROP TABLE IF EXISTS audit_event CASCADE",
            "DROP TABLE IF EXISTS consent CASCADE",
            "DROP TABLE IF EXISTS appointment CASCADE",
            "DROP TABLE IF EXISTS patient CASCADE",
            "DROP TYPE IF EXISTS audit_action CASCADE",
            "DROP TYPE IF EXISTS consent_status CASCADE",
            "DROP TYPE IF EXISTS bant_status CASCADE",
            "DROP TYPE IF EXISTS payment_status CASCADE",
            "DROP TYPE IF EXISTS participant_status CASCADE",
            "DROP TYPE IF EXISTS appointment_status CASCADE",
            "DROP TYPE IF EXISTS psych_profile CASCADE",
            "DROP FUNCTION IF EXISTS enforce_payment_gating()",
            "DROP FUNCTION IF EXISTS detect_psychographic_profile(UUID, INT, INT, BOOLEAN, BOOLEAN)",
            "DROP FUNCTION IF EXISTS qualify_bant(UUID, INT, BOOLEAN, INT, INT)",
            "DROP FUNCTION IF EXISTS check_abandoned_carts()",
            "DROP FUNCTION IF EXISTS create_audit_log(AUDIT_ACTION, TEXT, UUID, TEXT, TEXT)"
        ];

        console.log('🛠 Cleaning environment...');
        for (const cmd of cleanupCommands) {
            try {
                await client.query(cmd);
            } catch (e) {
                // Ignore errors for non-existent objects
            }
        }

        console.log('📄 Executing schema...');
        await client.query(sql);

        console.log('✅ ALL DONE! FHIR R4 schema deployed successfully.');
    } catch (err) {
        console.error('❌ Migration Error:', err.message);
    } finally {
        await client.end();
    }
}

migrate();
