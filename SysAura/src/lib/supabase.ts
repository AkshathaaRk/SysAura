// Mock Supabase client for development without Supabase

// Mock Supabase client
export const supabase = {
  from: (table: string) => ({
    select: (query: string) => ({
      eq: (field: string, value: any) => {
        console.log(`Mock Supabase query: SELECT ${query} FROM ${table} WHERE ${field} = ${value}`);
        
        // Return mock data for connections table
        if (table === 'connections') {
          return Promise.resolve({
            data: [
              {
                id: 'conn-1',
                user_id: 'user-1',
                admin_id: value,
                connected_at: new Date().toISOString(),
                status: 'online',
                ip_address: '192.168.1.101',
                user: {
                  id: 'user-1',
                  email: 'user1@example.com',
                  user_metadata: {
                    name: 'Demo User 1'
                  }
                }
              },
              {
                id: 'conn-2',
                user_id: 'user-2',
                admin_id: value,
                connected_at: new Date(Date.now() - 3600000).toISOString(),
                status: 'offline',
                ip_address: '192.168.1.102',
                user: {
                  id: 'user-2',
                  email: 'user2@example.com',
                  user_metadata: {
                    name: 'Demo User 2'
                  }
                }
              }
            ],
            error: null
          });
        }
        
        return Promise.resolve({ data: [], error: null });
      }
    })
  })
};

export default supabase;
