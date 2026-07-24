// Supabase REST Client Helper for Database Operations
const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://default-supabase-project.supabase.co';
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'default-anon-key';

export const supabase = {
  auth: {
    signInWithOAuth: async (options: any) => {
      console.log('OAuth Sign-In requested:', options);
      return { data: null, error: null };
    },
    signOut: async () => {
      return { error: null };
    },
    getUser: async () => {
      return { data: { user: null }, error: null };
    },
  },
  from: (tableName: string) => {
    const builder = {
      insert: (records: any[]) => {
        const promise = (async () => {
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
        })();

        return Object.assign(promise, {
          select: () => promise,
        });
      },
      select: (query = '*') => {
        const promise = (async () => {
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
        })();

        return Object.assign(promise, {
          eq: (col: string, val: any) => promise,
          order: (col: string, opts?: any) => promise,
        });
      },
      update: (records: any) => {
        const promise = (async () => {
          return { data: [records], error: null };
        })();

        const chainable = Object.assign(promise, {
          eq: (col: string, val: any) => chainable,
          select: () => promise,
        });

        return chainable;
      },
      delete: () => {
        const promise = (async () => {
          return { data: null, error: null };
        })();

        return Object.assign(promise, {
          eq: (col: string, val: any) => promise,
        });
      },
    };

    return builder;
  },
};
