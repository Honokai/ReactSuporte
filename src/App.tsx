import './App.css';
import { ModalContextProvider } from './Hooks/useModal';
import Roteador from './Services/Roteador';
import { AuthContextProvider } from './Hooks/useAuth';


function App() {
  return (
    <AuthContextProvider>
      <ModalContextProvider>
        <Roteador/>
      </ModalContextProvider>
    </AuthContextProvider>
  )
}

export default App;
