import { Alert, Button, Container, Link, Paper, TextField, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { useState } from "react"
import { useAuth } from "../Hooks/useAuth"
import Conteudo from "./Conteudo"
import { useHistory } from 'react-router-dom';


const Registro = () => {
    const [ nome, setNome ] = useState<string>("")
    const [ email, setEmail ] = useState<string>("")
    const [ confirmationPassword, setConfirmationPassword ] = useState<string>("")
    const [ password, setPassword ] = useState<string>("")
    const { handleRegistration } = useAuth()
    const [validationErrors, setValidationErrors] = useState<string[]>([])

    function validacao()
    {
        if (nome && email && confirmationPassword && password)
            if(confirmationPassword === password)
                handleRegistration(nome, email, password, confirmationPassword)
            else 
                alert("Senhas não conferem")
        
        else {
            alert("preencha os campos")    
        }
    }
    
    return (
        <Conteudo>
            <Container maxWidth="sm" sx={{height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                    <Paper sx={{padding: "4rem"}}>
                        <Typography variant="h5">Entre com sua conta</Typography>
                        
                        <Box component="form" sx={{"& *": {padding: "0.3rem"}}}>
                            <div>
                                <TextField id="nome" onChange={(event) => setNome(event.target.value) } label="Nome" variant="standard" />
                            </div>
                            <div>
                                <TextField id="email" onChange={(event) => setEmail(event.target.value) } label="E-mail" variant="standard" />
                            </div>
                            <div>
                                <TextField type="password" onChange={(event) => setPassword(event.target.value) } id="senha" label="Senha" variant="standard" />
                            </div>
                            <div>
                                <TextField type="password" onChange={(event) => setConfirmationPassword(event.target.value) } id="confirmacao" label="Confirmar senha" variant="standard" />
                            </div>
                            <div style={{"margin": "1rem 0 0 0", "display": "flex", "justifyContent": "center"}}>
                                <Button variant="outlined" onClick={() => {
                                    validacao()
                                    }
                                }>Entrar</Button>
                            </div>
                        </Box>
                    </Paper>
            </Container>
        </Conteudo>
    )
}

export default Registro