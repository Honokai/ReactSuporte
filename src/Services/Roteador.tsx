import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import ListaChamados from "../Componentes/ListaChamados";
import Login from "../Componentes/Login";
import { useAuth } from "../Hooks/useAuth";

function Roteador() 
{
    const { autenticado } = useAuth()

    useEffect(function () {
        console.log(autenticado, "context")
    },[])

    return (
        <Switch>
            {autenticado ? (
                <Route path="/chamados/:setor">
                    <ListaChamados/>
                </Route>
            ) : 
            (
                <React.Fragment>
                    <Route exact path="/">
                    <h1>Tester</h1>
                    </Route>
                    <Route path="/entrar">
                        <Login/>
                    </Route>
                </React.Fragment>
            )
            }
            
        </Switch>
    )
}

export default Roteador