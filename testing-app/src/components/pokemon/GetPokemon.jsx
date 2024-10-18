import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom'

export const GetPokemon = () => {
    const { id } = useParams()
    const [data, setData] = useState([])
    useEffect(() => {
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, {
            method: 'GET'
        }).then(response => response.json())
        .then(result => {
            setData(result)
        });
    }, [])
    return (
        
        <>
            <table className="table table responsive">
                <thead>
                    <tr>
                        <th>Número</th>
                        <th>Nombre</th>
                        <th>Habilidades</th>
                    </tr>
                </thead>
                <tbody>
                    <tr key={data.id}>
                        <td>{data.id}</td>
                        <td>{data.name}</td>
                        <td>{data.abilities && data.abilities.map((obj, index) => (
                            <div key={index}>
                                {obj.ability.name}
                            </div>
                        ))}</td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}