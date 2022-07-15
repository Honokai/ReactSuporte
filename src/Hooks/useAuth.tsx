import { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import { ApiService } from "../Services/Api";
import { useLocation } from 'react-router-dom'

interface AuthContextData {
    autenticado: boolean
    nome: string
    handleLogin: (email: string, password: string) => void
    handleLogoff: () => void
    handleRegistration: (name: string, email: string, password: string, confirmationPassword: string) => void
    validationError: string
    token: string
    history: any
}

interface AuthProviderProps {
    children: React.ReactNode
}

interface RegistrationData {
    name: string
    email: string
    password: string
    confirmationPassword: string
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthContextProvider({ children }: AuthProviderProps) {
    const location = useLocation()
    const [ autenticado, setAutenticado ] = useState<boolean>(false)
    const [ nome, setNome ] = useState<string>("")
    const [ token, setToken ] = useState<string>("")
    const [ validationError, setValidationError ] = useState('')
    
    const history = useHistory();
    let api = ApiService

    useEffect(function () {
        api.get('/csrf-cookie')

        handleTokenExpiration(localStorage.getItem('s_acc'))
    },[])

    async function handleLogin(email: string, password: string )
    {
        await api.post("/login", {
                email,
                password
            }, { withCredentials: true}).then(response => {
                if (response.status == 200) {
                    setValidationError("")
                    setAutenticado(true)
                    setNome(response.data.nome)
                    localStorage.setItem("s_acc", response.data.token.toString())
                    setToken(response.data.token.toString())
                    history.push("/chamados/ti", {
                        from: '/entrar',
                        } as { from: string })
                } else {
                    setValidationError(response.data.mensagem)
                }
        })

    }

    async function handleTokenExpiration(token: string|null)
    {
        if(token) {
            await api.get("/user", {
                headers : {
                    Authorization: `Bearer ${token}`
                }
            }).then( r => {
                setToken(token)
                setAutenticado(true)
                setNome(r.data.nome)
            }).catch(r => {
                //está expirado
                if (r.status == 401) {
                    history.push('/entrar', {
                        from: location.pathname
                    })
                }
            })
        } else {
            history.push('/entrar', {
                from: location.pathname
            })
        }
    }

    async function handleRegistration(name: string, email: string, password: string, confirmationPassword: string)
    {
        await api.post("/register", 
            {name, email, password, confirmationPassword},
            { withCredentials: true}
        ).then(response => {
            if (response.status == 200) {
                setAutenticado(true)
                setNome(response.data.nome)
                localStorage.setItem("s_acc", response.data.token.toString())
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
        <AuthContext.Provider value={{autenticado, nome, token, handleLogin, handleLogoff, history, handleRegistration, validationError}}>
            { children }
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)

    return context
}