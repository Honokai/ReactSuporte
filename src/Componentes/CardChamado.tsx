import { Avatar, Card, CardActionArea, CardHeader, Typography} from "@mui/material";

interface CardChamadoProps {
    identificador: string
    solicitacao: string
    status: number
    abrirModal: () => void
}

const statusEnum = {
    0: "fechado"
}
const colorStatus = {
    abert: 'rgb(10,50,60)',
    1: 'rgb(100,150,60)',
    2: 'rgb(100,150,60)',
    3: 'rgb(100,150,60)'
}

const statusChamado = (status: number): string => {
    if (status == 0) {
        return 'rgb(220,200,40)'
    } else if(status == 1) {
        return 'rgb(10,50,60)'
    } else if(status == 2) {
        return 'rgb(10,50,60)'
    } else {
        return 'rgb(10,50,60)'
    }
}


function CardChamado({ identificador, solicitacao, abrirModal, status }: CardChamadoProps) {
    const estilo = {
        background: statusChamado(status),
        margin: "0.5rem"
    }
    return (
        <Card sx={estilo} key={identificador}>
            <CardActionArea onClick={abrirModal}>
                <CardHeader avatar={
                        <Avatar>
                            TI
                        </Avatar>
                    }
                title={
                    <Typography sx={{color: 'background.paper'}}>
                        {identificador}
                    </Typography>
                    } 
                subheader={
                    <Typography sx={{color: 'background.paper'}}>
                        {solicitacao}
                    </Typography>
                    }
                />
            </CardActionArea>
        </Card>
    )
}

export default CardChamado