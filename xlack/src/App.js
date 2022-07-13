
import './App.css';
import Header from './components/Header';
import styled from 'styled-components';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";


function App() {
  return (
    <div className="App">
      <Router>
      <>
      <Header/>
      <Appbody>
        <Sidebar/>
        <Routes>
          <Route exact path="/" element={<Chat></Chat>}>
            {/* Chat */}
            
          </Route>
        </Routes>
      </Appbody>
       
      </>
    </Router>
    </div>
  );
}

export default App;

const Appbody=styled.div`
  display:flex;
  height:100vh;
`;