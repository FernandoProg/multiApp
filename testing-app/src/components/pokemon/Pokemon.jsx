import { useNavigate } from "react-router-dom";

export const Pokemon = () => {
    const navigate = useNavigate()
    return (
        <>
            <form method="get" onSubmit={(e) => {navigate(`/pokemon/${e.target.id.value}`)}}>
                <div className="input-group">
                    <span className="input-group-text" id="basic-addon1">ID del pokemon</span>
                    <input type="number" name="id" className="form-control"/>
                    <button type="submit" className="form-control">Buscar</button>
                </div>
            </form>
            
        </>
    );
};