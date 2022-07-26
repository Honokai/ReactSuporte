import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField, Tooltip } from '@mui/material';
import { chamadoProps } from './ListaChamados';
import { useModal } from '../Hooks/useModal';
import { ApiService } from '../Services/Api';
import { useAuth } from '../Hooks/useAuth';

const style = {
    position: 'absolute' as 'absolute',
    display: 'flex',
    flex: '1',
    flexDirection: "column",
    overflow: "hidden",
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50rem',
    maxHeight: '80%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    color: "gray",
    borderRadius: '0.3rem'
};

export interface ModalFrameData {
    id: number
    nome: string
    solicitacao: string
    conteudo: string
    setor: number
    localizacao: number
    categoria: number
}

interface ModalFrameProps {
    estaAberto: boolean
    data: chamadoProps|null|undefined
    controleModal: (x: boolean) => void
    atualizar: () => void
}

function ModalFrame({estaAberto, controleModal, data, atualizar}: ModalFrameProps) {
    const {aberto, handleModal, setModalData} = useModal()
    const { token, nome } = useAuth()
    const [solicitacao, setSolicitacao] = React.useState<string>('');
    const [anexos, setAnexos] = React.useState<File[]>();
    const [trocarCategoria, setTrocarCategoria ] = React.useState(false);
    const [localizacao, setLocalizacao] = React.useState<number|string>('');
    const [localizacoes, setLocalizacoes] = React.useState<{id: string, identificacao: string}[]|null>();
    const [setor, setSetor] = React.useState<number|string>('');
    const [categoria, setCategoria] = React.useState<number|string>('');
    const [subcategorias, setSubCategorias] = React.useState<{id: string, nome: string, categoria_id: number, subcategorianome: string}[]>();
    const [setores, setSetores] = React.useState<{id: string, nome: string}[]|null>();
    
    const headers = {Authorization: `Bearer ${token}`}
    const headerAnexo = {Authorization: `Bearer ${token}`, 'Content-Type': "multipart/form-data"}
    let api = ApiService
    
    async function recursos ()
    {
        await api.get(`/subcategorias`, {headers})
        .then(response => {
            setSubCategorias(response.data)
        }).catch(error => console.log(error))

        await api.get(`/setores`, {headers})
        .then(response => {
            setSetores(response.data)
        }).catch(error => console.log(error))

        await api.get(`/localizacoes`, {headers})
        .then(response => {
            setLocalizacoes(response.data)
        }).catch(error => console.log(error))
    }

    React.useEffect( () => {
        setSolicitacao('')
        setLocalizacao('')
        setSetor('')
        setCategoria('')
        recursos()
        data ? setTrocarCategoria(false) : setTrocarCategoria(true)
    }, [data])
    
    const handleResposta = () => {
        var formData = new FormData()
        if (anexos && anexos?.length > 0) {
            console.log("entrei")
            anexos.forEach(file => {
                formData.append("anexo[]", file)
            })
            formData.set('_method', 'POST')
            formData.set('chamado', data?.id.toString() ?? "")
            formData.set('solicitacao', solicitacao)
        }
        console.log(formData.entries())
        api.post("/respostas", anexos && anexos?.length > 0 ? 
            {formData} :
            {
                chamado: data?.id,
                solicitacao
            } , { 
            headers: anexos && anexos.length > 0 ? 
                headerAnexo :
                headers
            }
        ).then(response => {
            if (response.status === 201) {
                handleModal(false) 
                setModalData(null)
                atualizar()
            }
        })
    }

    const handleTransferenciaCategoria = async (x = true) => {
        setCategoria('')
        setTrocarCategoria(x)

        await api.get(`/subcategorias?exceto=${data?.subcategoria.id}`, {headers})
        .then(response => {
            setSubCategorias(response.data)
        }).catch(error => console.log(error))
    }

    const submitData = async () => {
        await api.post('/chamado', {
            solicitante: nome,
            solicitacao,
            subcategoria_id: categoria,
            setorOrigem_id: setor
        }, {headers, withCredentials: true}).then(response => {
            if (response.status === 201 ) {
                handleModal(false) 
                setModalData(null)
                atualizar()
            } else {
                alert(response.status)
            }
        }).catch(error => alert(error))
    }

    async function transferirChamado()
    {
        await api.post('/transferencia', {
            chamado: data?.id,
            categoriaDestino: categoria
        }, {
            headers,
            withCredentials: true
        }).then(r => {
            if (r.status == 200) {
                atualizar()
            }
        }).catch(e => {
            console.log(e)
        })
    }

    return (
        <Modal
            key="torch"
            open={aberto}
            onClose={controleModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style} key="teste">
                <Grid container spacing={2}>
                    <Grid item xs={4} gap={2}>
                        <Box sx={{color: "secondary.darker"}}>
                            <Typography id="modal-modal-title" variant="h5" component="h2">
                                {data?.id ? `Ticket #${data.id}`: "Novo chamado"}
                            </Typography>
                            <Typography id="modal-modal-title" component="h4">
                                Solicitante: {data?.solicitante ?? nome}
                            </Typography>
                        </Box>
                        <Box my={2}>
                            <FormControl fullWidth margin='dense' >
                                <InputLabel id="localizacao-label">Localização</InputLabel>
                                <Select
                                    size='small'
                                    labelId="localizacao-label"
                                    id="localizacao"
                                    disabled={data?.setor.nome  ? true : false }
                                    value={data?.setor.id  ?? localizacao}
                                    label="Localizacao"
                                    onChange={(event) => setLocalizacao(parseInt(event.target.value.toString()))}
                                >
                                    {localizacoes?.map(item => {
                                        return (
                                            <MenuItem value={item.id}>{item.identificacao}</MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth margin='dense' >
                                <InputLabel id="setor-select">Setor</InputLabel>
                                <Select
                                    size='small'
                                    labelId="setor-select"
                                    id="setor"
                                    disabled={data?.setor.id ? true : false }
                                    value={ data?.setor.id  ? data.setor.id  : setor}
                                    label="Setor"
                                    onChange={(event) => setSetor(parseInt(event.target.value.toString())) }
                                >
                                    <MenuItem value="" disabled={true}/>
                                    {setores?.map((item) => {
                                        return (
                                            <MenuItem value={item.id}>{item.nome}</MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth margin='dense' >
                                <InputLabel id="categoria-select">Categoria</InputLabel>
                                <Tooltip title="Clique duas vezes para transferir" arrow>
                                    <Select
                                        size='small'
                                        labelId="categoria-select"
                                        id="categoria"
                                        disabled={!trocarCategoria}
                                        value={!trocarCategoria && data?.subcategoria.id ? data.subcategoria.id : categoria}
                                        label="Categoria"
                                        onDoubleClick={(e) => {
                                            handleTransferenciaCategoria()
                                        }}
                                        onChange={(event) => setCategoria(event.target.value)}
                                    >
                                        <MenuItem value="" disabled={true}>Selecione a categoria</MenuItem>
                                        {subcategorias?.map(item => {
                                            return (
                                                <MenuItem value={item.id}>{item.subcategorianome}</MenuItem>
                                            )
                                        })}
                                    </Select>
                                </Tooltip>
                                
                                {trocarCategoria && data ? (
                                    <FormControl fullWidth margin='dense' >
                                        <Button onClick={() => {
                                            if(categoria) {
                                                console.log(categoria)
                                                transferirChamado()
                                            } else {
                                                alert('selecione uma categoria')
                                            }
                                        }}
                                        variant="contained">
                                            Transferir
                                        </Button>
                                    </FormControl>
                                ) : ''}
                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid item xs={8}>
                        {
                            data && data?.editar ? (
                                <>
                                <Box sx={{padding: "0.8rem"}}>
                                    <TextField
                                        fullWidth
                                        id="filled-multiline-flexible"
                                        label="Resposta"
                                        multiline
                                        minRows={3}
                                        value={solicitacao}
                                        onChange={(event) => setSolicitacao(event.target.value)}
                                    />
                                    <Button variant='contained' component="label">
                                            Anexar
                                            <input type="file" multiple onChange={(e) => {
                                                let arquivos: File[] = []
                                                let name = ""

                                                if (e.currentTarget.files) {
                                                    Array.from(e.currentTarget.files).forEach(file => {
                                                        name += ` ${file.name}`
                                                        arquivos.push(file)
                                                    })
                                                }

                                                setAnexos(arquivos)

                                                if (e.currentTarget.parentElement?.nextElementSibling) {
                                                    e.currentTarget.parentElement.nextElementSibling.innerHTML = name
                                                }
                                                
                                            }} style={{"display": "none"}}/>
                                    </Button>
                                    <span></span>
                                </Box>
                                </>
                            ) : ""
                        }
                        <Box sx={{maxHeight: '400px', overflow: "auto"}}>
                            {
                                data?.respostas ? data.respostas.map(resposta => {
                                    return (
                                        <Box sx={{padding: "0.8rem"}}>
                                            <Paper elevation={2} sx={{p: "1rem"}}>
                                                <Grid sx={{whiteSpace: "pre-wrap"}} item xs zeroMinWidth>
                                                    {resposta.conteudo}
                                                </Grid>
                                            </Paper>
                                            <Typography sx={{color: "secondary.darker"}} align="right">
                                                {resposta.usuario.name} às {new Date(resposta.created_at).toLocaleString("br")}
                                            </Typography>
                                        </Box>
                                    )
                                }) : ""
                            }
                            {
                                data?.solicitacao ? (
                                    <Box sx={{padding: "0.8rem"}}>
                                        <Paper sx={{p: "1rem"}}>
                                                <Grid sx={{whiteSpace: "pre-wrap"}} justifyContent="left" item xs zeroMinWidth>
                                                    {data.solicitacao}
                                                </Grid>
                                        </Paper>
                                        <Typography sx={{color: "secondary.darker"}} align="right">
                                            {data.solicitante} às {new Date(data.created_at).toLocaleString("br")}
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Box sx={{padding: "0.8rem"}}>
                                        <TextField
                                            fullWidth
                                            id="filled-multiline-flexible"
                                            label="Solicitação"
                                            multiline
                                            minRows={8}
                                            value={solicitacao}
                                            onChange={(event) => setSolicitacao(event.target.value)}
                                        />
                                    </Box>
                                )
                            }
                        </Box>
                    </Grid>
                </Grid>
                <Box textAlign="center" sx={{margin: '0.5rem 0 0 0'}}>
                    <Button onClick={() => {
                        data ? handleResposta() : submitData()
                        }} variant="contained">{data?.id ? 'Enviar' : 'Criar solicitação'}</Button>
                </Box>
            </Box>
        </Modal>
    )
}

export default ModalFrame