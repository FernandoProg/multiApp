import { useEffect, useState } from "react"

const DB_URI = 'http://127.0.0.1:5000'

export const Cars = () => {
    const [data, setData] = useState([])
    const [method, setMethod] = useState('POST')
    const [modelo, setModelo] = useState('')
    const [patente, setPatente] = useState('')
    const [ruedas, setRuedas] = useState('')
    const [id, setId] = useState('')

    const getCars = () => {
        fetch(`${DB_URI}/cars`, {
            method: 'GET'
        })
        .then(res => res.json())
        .then(info => {
            setData(info.cars)
        })
    }

    useEffect(() => {
        getCars()
    }, [])

    const HandleSubmit = (e) => {
        e.preventDefault()
        if(method == 'POST'){
            fetch(`${DB_URI}/car`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "patente": e.target.patente.value,
                    "modelo": e.target.modelo.value,
                    "ruedas": e.target.ruedas.value,
                    "usuario_id": 5
                })
            })
            .then(res => res.json())
            .then(() => {
                getCars()
                setId('')
                setModelo('')
                setPatente('')
                setRuedas('')
            })
        }else if(method == 'PATCH'){
            fetch(`${DB_URI}/car/${e.target.id.value}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'modelo': e.target.modelo.value,
                    'patente': e.target.patente.value,
                    'ruedas': e.target.ruedas.value
                })
            })
            .then(res => res.json())
            .then(() => {
                getCars()
                setId('')
                setModelo('')
                setPatente('')
                setRuedas('')
                setMethod('POST')
            })
        }
    }

    const EditMode = async (e, id) => {
        e.preventDefault()
        setMethod('PATCH')
        const res = await fetch(`${DB_URI}/car/${id}`, {
            method: 'GET'
        })
        const ans = await res.json()
        setId(id)
        setModelo(ans.modelo)
        setPatente(ans.patente)
        setRuedas(ans.ruedas)
    }

    const deleteMode = (e, id) => {
        e.preventDefault()
        if(confirm('Estas seguro de querer eliminarlo?')){
            fetch(`${DB_URI}/car/${id}`, {
                method: 'DELETE'
            })
            .then(res => res)
            .then(() => {
                getCars()
                window.alert('Eliminado con exito')
            })
        }
    }

    return (
        <>
            <table className="table table-responsive">
                <thead>
                    <tr>
                        <th>id</th>
                        <th>modelo</th>
                        <th>patente</th>
                        <th>ruedas</th>
                        <th>dueño</th>
                        <th>Opciones</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((elem) => (
                            <tr key={elem.id}>
                                <td>{elem.id}</td>
                                <td>{elem.modelo}</td>
                                <td>{elem.patente}</td>
                                <td>{elem.ruedas}</td>
                                <td>{elem.dueño}</td>
                                <td><a className="btn btn-warning" onClick={(e) => {EditMode(e, elem.id)}} href="">Edit</a> <a className="btn btn-danger" onClick={(e) => {deleteMode(e, elem.id)}} href="">Delete</a></td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            <div className="row m-0 justify-content-center text-center">
                <div className="col-3">
                    <span className="fs-1 fw-bold text-center">Autos</span>
                <form method="POST" onSubmit={HandleSubmit}>
                    <input type="text" name="id" value={id} onChange={e => {setId(e.target.value)}} className="form-control ms-1" disabled/>
                    <div className="input-group mb-2">
                        <label htmlFor="modelo">Modelo</label>
                        <input type="text" name="modelo" value={modelo} onChange={e => {setModelo(e.target.value)}} className="form-control ms-1"/>
                    </div>
                    <div className="input-group mb-2">
                        <label htmlFor="patente">Patente</label>
                        <input type="text" name="patente" value={patente} onChange={e => {setPatente(e.target.value)}} className="form-control ms-1"/>
                    </div>
                    <div className="input-group mb-2">
                        <label htmlFor="ruedas">Ruedas</label>
                        <input type="number" name="ruedas" value={ruedas} onChange={e => {setRuedas(e.target.value)}} className="form-control ms-1"/>
                    </div>
                    <div className="input-group mb-2">
                        <label htmlFor="dueño">Dueño</label>
                        <input type="text" name="dueño" className="form-control ms-1" disabled/>
                    </div>
                    <button className="btn btn-success" type="submit">{method && method=='POST' ? 'Crear' : 'Actualizar'}</button>
                </form>
                </div>
            </div>
        </>
    )
}