import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { chamadoProps } from './ListaChamados';
import { useModal } from '../Hooks/useModal';

interface TabelaProps {
  data: chamadoProps[]
}

export default function Tabela(props: TabelaProps) {
  const {handleModal} = useModal()
  return (
    <TableContainer component={Paper}>
      <Table  aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{fontWeight: "bolder"}}>Chamado #</TableCell>
            <TableCell align="left">Solicitante</TableCell>
            <TableCell align="left">Setor</TableCell>
            <TableCell align="left">Abertura</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data.map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 }, ':hover': {cursor: "pointer", background: "rgba(0,0,0,0.3)"} }}
              onClick={() => handleModal(true, row.id, props.data) }
            >
              <TableCell component="th" scope="row">
                #{row.id.toString()}/{new Date(row.created_at).getFullYear()}
              </TableCell>
              <TableCell component="th" scope="row">
                {row.solicitante}
              </TableCell>
              <TableCell align="left">{row.setor.nome}</TableCell>
              <TableCell align="left">{new Date(row.created_at).toLocaleString("br")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
