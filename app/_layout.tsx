import { Stack } from 'expo-router';
import { AlertProvider } from '@/template';
import { AuthProvider } from '@/contexts/AuthContext';
import { ReportsProvider } from '@/contexts/ReportsContext';

export default function RootLayout() {
  return (
    <AlertProvider>
      <AuthProvider>
        <ReportsProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="report/[id]"
              options={{
                headerShown: true,
                title: 'Detalhes do Reporte',
                headerBackTitle: 'Voltar',
              }}
            />
          </Stack>
        </ReportsProvider>
      </AuthProvider>
    </AlertProvider>
  );
}
