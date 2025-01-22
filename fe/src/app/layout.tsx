'use client'

import type { Metadata } from "next";
import "./globals.css";
import AuthWrapper from "@/components/wrappers/AuthWrapper";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/theme/theme'
import { Box } from "@mui/material";
import { Provider } from 'react-redux';
import { store } from "@/lib/redux/store";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <AuthWrapper>
            <AppRouterCacheProvider>
              <ThemeProvider theme={theme}>
                
                  <Box sx={{
                    height: "100vh",
                    width: "100%",
                    color: "text.primary",
                    fontFamily: "typography.fontFamily",
                    backgroundColor: "background.default"
                  }}>
                    {children}
                  </Box>
                
              </ThemeProvider>
            </AppRouterCacheProvider>
          </AuthWrapper>
        </Provider>
      </body>
    </html>
  );
}
