import { Box, Breakpoint, Container, ScopedCssBaseline } from "@mui/material";
import { TemaContextProvider } from "../Hooks/useTema";
import Navbar from "./Navbar";

interface ConteudoProps {
    children: React.ReactNode
}

const Conteudo = ({ children }: ConteudoProps) => {
    return (
        <TemaContextProvider>
            <Navbar/>
            <ScopedCssBaseline enableColorScheme>
                <Box height={"100%"}>
                    <Container sx={{padding: "2rem 0", height: "inherit"}}>
                        { children }
                    </Container>
                </Box>
            </ScopedCssBaseline>
        </TemaContextProvider>
    )    
}

export default Conteudo;