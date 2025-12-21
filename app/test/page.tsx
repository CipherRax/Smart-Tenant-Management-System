// src/app/test/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function TestPage() {
  const [status, setStatus] = useState<string>('Checking...');
  const [envInfo, setEnvInfo] = useState<any>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        const supabase = createClient();
        
        // Check environment variables
        const env = {
          hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          urlLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
          hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          keyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
        };
        setEnvInfo(env);

        if (!env.hasUrl || !env.hasKey) {
          setStatus('Missing environment variables');
          return;
        }

        // Test auth
        const { data: session, error: sessionError } = await supabase.auth.getSession();
        console.log('Session test:', { session, sessionError });

        // Test database
        const { data: dbTest, error: dbError } = await supabase
          .from('admin')
          .select('count')
          .limit(1);

        console.log('DB test:', { dbTest, dbError });

        setStatus('Connected successfully! Check console for details.');
      } catch (error: any) {
        setStatus(`Error: ${error.message}`);
        console.error('Test error:', error);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      <div className="mb-4">
        <p><strong>Status:</strong> {status}</p>
      </div>
      {envInfo && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">Environment Variables:</h2>
          <pre>{JSON.stringify(envInfo, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}