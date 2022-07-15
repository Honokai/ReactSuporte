import { createTheme, Theme, ThemeProvider } from "@mui/material";
import { createContext, useContext, useEffect, useState } from "react"

interface TemaContextData {
    alterarTema: () => void
}

interface ModalContextProps {
    children: React.ReactNode
}

const TemaContext = createContext<TemaContextData>({} as TemaContextData);

export const TemaContextProvider = ({children}: ModalContextProps) => {

    useEffect(() => {
      localStorage.getItem("tema") == "light" ?? alterarTema()
    }, [])
    
    const [tema, setTema] = useState<Theme>(localStorage.getItem("tema")  == "light" ? Tema.light : Tema.dark)

    function alterarTema() {
        let value: "light"|"dark" = "light"

        if(localStorage.getItem("tema") == "light") {
            localStorage.setItem("tema", "dark")
            value = "dark"
        } else {
            localStorage.setItem("tema", "light")
            value = "light"
        }
        setTema(Tema[value])
    }

    return (
        <TemaContext.Provider value={{alterarTema}}>
            <ThemeProvider theme={tema}>
                {children}
            </ThemeProvider>
        </TemaContext.Provider>
    )
}

const Tema = {
    light: createTheme({
        palette: {
          mode: 'light',
          secondary: {
            main: '#135FD4',
          }
        },
    }),
    dark: createTheme({
        palette: {
          mode: 'dark',
        },
    })
}

export function useTema() {
    const context = useContext(TemaContext)

    return context
}