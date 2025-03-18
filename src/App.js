import logo from './logo.svg';
import './App.css';
import Employees from './components/Employees';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Profile from './components/Profile';
import ApplyLeave from './components/ApplyLeave';
import SubordinateLeaveHistory from './components/SubordinatesPendingLeave';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Employees/>} />
        <Route path='/profile' element={<Profile/>} />
        <Route path='/applyleave' element={<ApplyLeave/>} />
        <Route path='/subordinateleave' element={<SubordinateLeaveHistory/>} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
