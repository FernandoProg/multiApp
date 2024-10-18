import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Pokemon } from './components/pokemon/Pokemon.jsx';
import { GetPokemon } from './components/pokemon/GetPokemon.jsx';
import { Cars } from './components/cars/Cars.jsx';
import { Navbar } from './components/Navbar.jsx';
import { Landing } from './components/landing.jsx';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import './App.css';

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <div>
          <Routes>
            <Route path='/' element={<Landing />}></Route>
            <Route path='/pokemon' element={<Pokemon />}></Route>
            <Route path='/pokemon/:id' element={<GetPokemon />}></Route>
            <Route path='/cars' element={<Cars />}></Route>
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
