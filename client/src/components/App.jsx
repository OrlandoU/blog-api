import '../assets/stylesheets/App.css';
import { Routes, Route, HashRouter } from 'react-router-dom'
import Home from './Home/Home';
import { useEffect, useState } from 'react';
import {UserContext} from '../Contexts/UserContext';

function App() {
  const jwtToken = useState()
  const user = useState()


  const fetchToken = () => {

  }

  useEffect(() => {

  }, [])

  return (
    <div className="App">
      <UserContext.Provider value={user}>
        <nav>
          <section className="logo"></section>
          <ul className="nav-links"></ul>
        </nav>
        <HashRouter>
          <Routes>
            <Route path='/' element={<Home />} />
          </Routes>
        </HashRouter>
      </UserContext.Provider>
    </div>
  );
}

export default App;
