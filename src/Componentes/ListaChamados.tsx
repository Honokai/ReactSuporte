import { Pagination } from "@mui/material"
import { Box } from "@mui/system"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useAuth } from "../Hooks/useAuth"
import { useModal } from "../Hooks/useModal"
import { ApiService } from "../Services/Api"
import Conteudo from "./Conteudo"
import ModalFrame from "./ModalFrame"
import Tabela from "./Tabela"

export interface chamadoProps {
    id: number
    solicitante: string
    solicitacao: string
    status: number
    setor:	{
        id: number
        nome: string
    }
    subcategoria: {
        id: number
        nome: string
    }
    transferencias: {
        id: number
        setor_origem: string
    }
    created_at:	Date
    updated_at: Date
    respostas: respostaProps[]
    editar: boolean
}

interface respostaProps {
    id: number
    conteudo: string
    chamado_id: number
    usuario: {
        name: string
    }
    created_at: Date
}

const estilo = {
    margem: '0.5rem',
    corFundo: "#ffffff"
} as const

function ListaChamados() {
    const { token } = useAuth()
    const {aberto, handleModal, modalData} = useModal();

    const { setor } = useParams<{setor: string}>();

    const [chamados, setChamados] = useState<chamadoProps[]>([])
    
    const [ paginas, setPaginas ] = useState<number>(0)
    
    async function atualizarChamados(page?: number) {
        let url = `/chamados/${setor}`

        if(page) {
            url += `?page=${page}`
        }

        ApiService.get(url, { headers: {
            Authorization: `Bearer ${token}`
        }}).then(response => {
            setChamados(response.data.data)
            setPaginas(response.data.meta.last_page)
        })
        .catch(error => console.log(error))
    }

    useEffect(() => {
        atualizarChamados()
    },[])

    return (
        <Conteudo>
            <Tabela data={chamados}/>
            <ModalFrame estaAberto={aberto} controleModal={() => handleModal(false, null)} data={modalData} atualizar={atualizarChamados}/>
            <Box my={1}>
                {paginas ? (
                    <Pagination count={paginas} color="primary" onChange={(event, page) => {
                        atualizarChamados(page)
                    }}/>
                ) : ""}
            </Box>
        </Conteudo>
    )
}

export default ListaChamados