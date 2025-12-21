// components/debug-registration.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { createClient } from '@/lib/supabase/client';

export default function DebugRegistration() {
  const router = useRouter();
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('Test123!');
  const [fullName, setFullName] = useState('Test User');
  const [phone, setPhone] = useState('1234567890');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    console.log(message);
  };

  const clearLogs = () => {
    setLogs([]);
    setResult(null);
    setError(null);
  };

  const testRegistration = async () => {
    setIsSubmitting(true);
    setError(null);
    setResult(null);
    clearLogs();

    try {
      addLog('Starting registration test...');
      const supabase = createClient();
      
      // Test 1: Sign up with Supabase Auth
      addLog(`1. Attempting to sign up: ${email}`);
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) {
        addLog(`❌ Auth Error: ${authError.message}`);
        setError(`Auth Error: ${authError.message}`);
        return;
      }

      addLog(`✅ Auth Success! User ID: ${authData.user?.id}`);
      addLog(`User email: ${authData.user?.email}`);
      addLog(`Session: ${authData.session ? 'Created' : 'No session (email verification required)'}`);

      // Test 2: Insert into admin table
      addLog('2. Attempting to insert into admin table...');
      
      const adminData = {
        id: authData.user!.id,
        full_name: fullName,
        email: email,
        phone_number: phone,
        role: 'admin',
        is_active: true,
        permissions: {
          can_create_users: true,
          can_delete_users: true,
          can_manage_properties: true,
          can_view_reports: true,
          can_manage_finances: true,
        },
      };

      addLog(`Admin data to insert: ${JSON.stringify(adminData, null, 2)}`);

      const { data: dbData, error: dbError } = await supabase
        .from('admin')
        .insert(adminData)
        .select()
        .single();

      if (dbError) {
        addLog(`❌ Database Error: ${dbError.message}`);
        addLog(`Error code: ${dbError.code}`);
        addLog(`Error details: ${JSON.stringify(dbError.details)}`);
        setError(`Database Error: ${dbError.message}`);
        
        // Try to get the error details
        if (dbError.message.includes('row-level security')) {
          addLog('⚠️ This is likely an RLS policy issue!');
          addLog('Check your RLS policies in Supabase SQL Editor.');
        }
        return;
      }

      addLog(`✅ Database Success! Inserted record: ${JSON.stringify(dbData, null, 2)}`);

      // Test 3: Verify the insert
      addLog('3. Verifying the insert...');
      const { data: verifyData, error: verifyError } = await supabase
        .from('admin')
        .select('*')
        .eq('id', authData.user!.id)
        .single();

      if (verifyError) {
        addLog(`❌ Verification Error: ${verifyError.message}`);
      } else {
        addLog(`✅ Verification Success! Found record: ${JSON.stringify(verifyData, null, 2)}`);
      }

      // Test 4: Check current session
      addLog('4. Checking current session...');
      const { data: sessionData } = await supabase.auth.getSession();
      addLog(`Current session: ${sessionData.session ? 'Active' : 'No session'}`);

      setResult({
        auth: authData,
        dbInsert: dbData,
        verify: verifyData,
        session: sessionData,
      });

      addLog('🎉 All tests completed successfully!');

      // Store for debugging
      localStorage.setItem('debug_registration_result', JSON.stringify({
        userId: authData.user!.id,
        email,
        timestamp: new Date().toISOString(),
      }));

    } catch (error: any) {
      addLog(`❌ Unexpected Error: ${error.message}`);
      addLog(`Stack: ${error.stack}`);
      setError(`Unexpected Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const testAuthOnly = async () => {
    setIsSubmitting(true);
    clearLogs();

    try {
      addLog('Testing Auth-only signup...');
      const supabase = createClient();
      
      const { data, error } = await supabase.auth.signUp({
        email: 'auth-test@example.com',
        password: 'Test123!',
      });

      if (error) {
        addLog(`❌ Auth Error: ${error.message}`);
        setError(`Auth Error: ${error.message}`);
      } else {
        addLog(`✅ Auth Success! User ID: ${data.user?.id}`);
        addLog(`Check Supabase Auth dashboard to see if user was created.`);
        setResult({ auth: data });
      }
    } catch (error: any) {
      addLog(`❌ Error: ${error.message}`);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const testDBOnly = async () => {
    setIsSubmitting(true);
    clearLogs();

    try {
      addLog('Testing Database-only insert...');
      const supabase = createClient();
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        addLog('❌ No authenticated user. Please sign up first.');
        setError('No authenticated user');
        return;
      }

      const adminData = {
        id: user.id,
        full_name: 'DB Test User',
        email: user.email,
        phone_number: '0987654321',
        role: 'admin',
        is_active: true,
      };

      const { data, error } = await supabase
        .from('admin')
        .insert(adminData)
        .select()
        .single();

      if (error) {
        addLog(`❌ DB Error: ${error.message}`);
        setError(`DB Error: ${error.message}`);
        
        // Try a different approach - maybe the table doesn't exist
        addLog('Testing if table exists...');
        const { error: tableError } = await supabase
          .from('admin')
          .select('count')
          .limit(1);
        
        if (tableError) {
          addLog(`❌ Table access error: ${tableError.message}`);
        } else {
          addLog('✅ Table exists and is accessible');
        }
      } else {
        addLog(`✅ DB Success! Inserted: ${JSON.stringify(data, null, 2)}`);
        setResult({ db: data });
      }
    } catch (error: any) {
      addLog(`❌ Error: ${error.message}`);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkRLSPolicies = async () => {
    setIsSubmitting(true);
    clearLogs();

    try {
      addLog('Checking RLS policies...');
      const supabase = createClient();
      
      // Try to insert as anonymous user (should fail if RLS is working)
      const testData = {
        id: '00000000-0000-0000-0000-000000000000',
        full_name: 'RLS Test',
        email: 'rls-test@example.com',
        role: 'admin',
        is_active: true,
      };

      const { error } = await supabase
        .from('admin')
        .insert(testData);

      if (error) {
        addLog(`✅ RLS is blocking unauthorized insert: ${error.message}`);
      } else {
        addLog('⚠️ RLS might not be enabled or is not blocking');
      }

      // Check if we can select
      const { data, error: selectError } = await supabase
        .from('admin')
        .select('count')
        .limit(1);

      if (selectError) {
        addLog(`Select error (might be RLS): ${selectError.message}`);
      } else {
        addLog(`Can select from table. Count: ${data}`);
      }

    } catch (error: any) {
      addLog(`❌ Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Debug Registration</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Test Controls */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Test Registration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="test@example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Test123!"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Test User"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="1234567890"
                  />
                </div>

                <div className="flex flex-wrap gap-2 pt-4">
                  <Button
                    onClick={testRegistration}
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isSubmitting ? 'Testing...' : 'Test Full Registration'}
                  </Button>

                  <Button
                    onClick={testAuthOnly}
                    disabled={isSubmitting}
                    variant="outline"
                  >
                    Test Auth Only
                  </Button>

                  <Button
                    onClick={testDBOnly}
                    disabled={isSubmitting}
                    variant="outline"
                  >
                    Test DB Only
                  </Button>

                  <Button
                    onClick={checkRLSPolicies}
                    disabled={isSubmitting}
                    variant="outline"
                  >
                    Check RLS
                  </Button>

                  <Button
                    onClick={clearLogs}
                    variant="ghost"
                  >
                    Clear Logs
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription className="font-mono text-sm">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Result Display */}
            {result && (
              <Card>
                <CardHeader>
                  <CardTitle>Result</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs overflow-auto max-h-60 bg-gray-100 p-2 rounded">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column: Logs */}
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Logs</span>
                  <span className="text-sm font-normal text-gray-500">
                    {logs.length} entries
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 max-h-[500px] overflow-y-auto font-mono text-sm">
                  {logs.length === 0 ? (
                    <p className="text-gray-500 italic">No logs yet. Run a test to see output.</p>
                  ) : (
                    logs.map((log, index) => (
                      <div key={index} className="p-1 border-b border-gray-100">
                        {log.includes('❌') ? (
                          <span className="text-red-600">{log}</span>
                        ) : log.includes('✅') ? (
                          <span className="text-green-600">{log}</span>
                        ) : log.includes('⚠️') ? (
                          <span className="text-yellow-600">{log}</span>
                        ) : log.includes('🎉') ? (
                          <span className="text-purple-600 font-bold">{log}</span>
                        ) : (
                          <span>{log}</span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Debug Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>1. Test Full Registration:</strong> Creates auth user + inserts into admin table</p>
            <p><strong>2. Test Auth Only:</strong> Only tests Supabase Auth signup</p>
            <p><strong>3. Test DB Only:</strong> Tests database insert (requires logged in user)</p>
            <p><strong>4. Check RLS:</strong> Tests if Row Level Security is blocking</p>
            <p className="mt-4 text-red-600">
              <strong>Important:</strong> After testing, check Supabase Dashboard → Authentication → Users
            </p>
            <p className="text-red-600">
              Also check Supabase Dashboard → Table Editor → admin table
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}