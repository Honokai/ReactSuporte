import { Button, Card, CardContent, CardHeader, Container, Paper, TextField, Typography } from "@mui/material"
import { Box } from "@mui/system"
import axios from "axios"
import { useEffect, useState } from "react"
import { useAuth } from "../Hooks/useAuth"
import { ApiService } from "../Services/Api"
import Conteudo from "./Conteudo"



const Login = () => {
    const [ email, setEmail ] = useState<string>("")
    const [ password, setPassword ] = useState<string>("")
    const { handleLogin } = useAuth()
    return (
        <Conteudo>
            <Container maxWidth="sm" sx={{height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                    <Paper sx={{padding: "4rem"}}>
                        <Typography variant="h5">Entre com sua conta</Typography>
                        <Box component="form" sx={{"& *": {padding: "0.3rem"}}}>
                            <div>
                                <TextField id="nome" onChange={(event) => setEmail(event.target.value) } label="Nome" variant="standard" />
                            </div>
                            <div>
                                <TextField type="password" onChange={(event) => setPassword(event.target.value) } id="senha" label="Senha" variant="standard" />
                            </div>
                            <div style={{"margin": "1rem 0 0 0", "display": "flex", "justifyContent": "center"}}>
                                <Button variant="outlined" onClick={() => {handleLogin(email, password)}}>Entrar</Button>
                            </div>
                        </Box>
                    </Paper>
            </Container>
        </Conteudo>
    )
}

export default Login