import { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import { ApiService } from "../Services/Api";

interface AuthContextData {
    autenticado: boolean
    nome: string
    handleLogin: (email: string, password: string) => void
    handleLogoff: () => void
    token: string
}

interface AuthProviderProps {
    children: React.ReactNode
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthContextProvider({ children }: AuthProviderProps) {
    const [ autenticado, setAutenticado ] = useState<boolean>(false)
    const [ nome, setNome ] = useState<string>("")
    const [ token, setToken ] = useState<string>("")
    
    const history = useHistory();
    let api = ApiService
    useEffect(function () {
        api.get('/csrf-cookie')
    },[])

    async function handleLogin(email: string, password: string )
    {
        await api.post("/login", {
                email,
                password
            }, { withCredentials: true}).then(response => {
                if (response.status == 200) {
                    setAutenticado(true)
                    setNome(response.data.nome)
                    setToken(response.data.token.toString())
                    history.push("/chamados/ti", {
                        from: '/entrar',
                        } as { from: string })
                }
        })

    }

    async function handleLogoff() 
    {
        await api.post("/sair", {}, { headers:{Authorization: `Bearer ${token}`}}).then(response => {
                if (response.status == 200) {
                    setAutenticado(false)
                    setNome("")
                    setToken("")
                    history.push("/entrar", {
                        from: '/chamados/ti',
                      } as { from: string })
                }
            }).catch(error => console.log(error))
    }

    return (
        <AuthContext.Provider value={{autenticado, nome, token, handleLogin, handleLogoff}}>
            { children }
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)

    return context
}