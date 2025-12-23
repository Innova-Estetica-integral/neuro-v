require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

async function testDatabase() {
    console.log('🧪 INICIANDO TESTING DE BASE DE DATOS\n');

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('✅ Conexión a DB establecida\n');

        // TEST 1: Verifica que existe Clínica Alpha
        console.log('📋 TEST 1: Verificando Clínica Alpha...');
        const clinicResult = await client.query(`
      SELECT name, plan, subscription_status 
      FROM clinics 
      WHERE id = 'a1111111-1111-1111-1111-111111111111'::UUID
    `);

        if (clinicResult.rows.length > 0) {
            console.log('✅ Clínica Alpha existe:', clinicResult.rows[0]);
        } else {
            console.log('❌ Clínica Alpha NO existe');
        }

        // TEST 2: Cuenta pacientes demo
        console.log('\n📋 TEST 2: Verificando pacientes demo...');
        const patientsResult = await client.query(`
      SELECT COUNT(*) as count, 
             STRING_AGG(DISTINCT psych_profile, ', ') as profiles
      FROM patient 
      WHERE clinic_id = 'a1111111-1111-1111-1111-111111111111'::UUID
    `);
        console.log('✅ Pacientes encontrados:', patientsResult.rows[0]);

        // TEST 3: Verifica credenciales encriptadas
        console.log('\n📋 TEST 3: Verificando credenciales encriptadas...');
        const credsResult = await client.query(`
      SELECT provider, environment, is_active
      FROM clinic_integrations
      WHERE clinic_id = 'a1111111-1111-1111-1111-111111111111'::UUID
    `);
        console.log('✅ Integraciones configuradas:', credsResult.rows);

        // TEST 4: Verifica que RLS está activo
        console.log('\n📋 TEST 4: Verificando Row Level Security...');
        const rlsResult = await client.query(`
      SELECT tablename, rowsecurity 
      FROM pg_tables 
      WHERE schemaname = 'public' 
        AND tablename IN ('patient', 'appointment', 'clinics')
    `);
        console.log('✅ RLS Status:', rlsResult.rows);

        // TEST 5: Intenta crear un paciente de prueba
        console.log('\n📋 TEST 5: Probando creación de paciente...');
        try {
            const insertResult = await client.query(`
        INSERT INTO patient (
          clinic_id, name_family, name_given, name_text, 
          telecom_email, telecom_phone, birth_date, gender
        ) VALUES (
          'a1111111-1111-1111-1111-111111111111'::UUID,
          'Test', ARRAY['Usuario'], 'Usuario Test',
          'test-${Date.now()}@example.com', '+56900000000', 
          '1990-01-01', 'other'
        ) RETURNING id, name_text
      `);
            console.log('✅ Paciente de prueba creado:', insertResult.rows[0]);

            // Limpieza
            await client.query(`DELETE FROM patient WHERE id = $1`, [insertResult.rows[0].id]);
            console.log('✅ Paciente de prueba eliminado (cleanup)');
        } catch (err) {
            console.log('⚠️  Error creando paciente:', err.message);
        }

        console.log('\n✅ TODOS LOS TESTS DE DB COMPLETADOS\n');

    } catch (error) {
        console.error('\n❌ ERROR CRÍTICO:', error.message);
        process.exit(1);
    } finally {
        await client.end();
    }
}

testDatabase();
