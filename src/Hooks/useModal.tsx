import axios from "axios";
import react, { createContext, useContext, useState } from "react";
import { chamadoProps } from "../Componentes/ListaChamados";
import { ApiService } from "../Services/Api";
import { useAuth } from "./useAuth";

interface ModalContextProviderProps {
    children: React.ReactNode
}

interface ModalContextData {
    aberto: boolean
    handleModal: (option: boolean, id?: number|null, chamados?: chamadoProps[]) => void
    modalData: chamadoProps|null|undefined
    setModalData: (param: chamadoProps|null) => void
}

const ModalContext = createContext<ModalContextData>({} as ModalContextData)

export function ModalContextProvider({children} : ModalContextProviderProps) {
    const { token } = useAuth()
    const [aberto, setAberto] = useState(false)
    const [modalData, setModalData] = useState<chamadoProps|null|undefined>(null);

    const getChamado = async (id: number) => {
        await ApiService.get(`http://api.teste.com/api/chamado/${id}`, { headers: {
            Authorization: `Bearer ${token}`
        }}).then(response => {
            console.log(response.data)
            setModalData(response.data.data)
        }).catch(e => console.log(e))
    }

    function handleModal(option: boolean, id?: number|null) {
        if (id) {
            getChamado(id)

            setAberto(option)
        } else {
            setModalData(null)
            setAberto(option)
        }
    }

    return (
        <ModalContext.Provider value={{aberto, handleModal, modalData, setModalData}}>
            {children}
        </ModalContext.Provider>
    )
}

export function useModal() {
    const context = useContext(ModalContext)

    return context
}
