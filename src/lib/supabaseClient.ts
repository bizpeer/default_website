// Supabase REST Client Helper for Database Operations
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://default-supabase-project.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'default-anon-key';

export const supabase = {
  from: (tableName: string) => {
    return {
      insert: async (records: any[]) => {
        try {
          const res = await fetch(`${SUPABASE_URL}/rest/v1/${tableName}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
              'Prefer': 'return=representation',
            },
            body: JSON.stringify(records),
          });

          if (!res.ok) {
            const errText = await res.text();
            return { data: null, error: { message: errText || 'Supabase REST error' } };
          }

          const data = await res.json();
          return { data, error: null };
        } catch (err: any) {
          return { data: null, error: { message: err.message || 'Network error' } };
        }
      },
      select: async (query = '*') => {
        try {
          const res = await fetch(`${SUPABASE_URL}/rest/v1/${tableName}?select=${query}`, {
            method: 'GET',
            headers: {
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            },
          });
          const data = await res.json();
          return { data, error: null };
        } catch (err: any) {
          return { data: null, error: { message: err.message } };
        }
      },
    };
  },
};
