"use client"

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/app/theme";
import { ConvexClientProvider } from "./convex-client-provider";

export default function Providers({children}:{children:React.ReactNode}){

return(
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <ConvexClientProvider>
            {children}
        </ConvexClientProvider>
    </ThemeProvider>

)
}