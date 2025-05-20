import {BrowserRouter,Route,Routes} from 'react-router-dom'
import './App.css'
import { Navigate } from 'react-router-dom'
import HomePage from '../pages/HomePage'

function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Navigate replace to="homepage"/>}/>
          <Route path="homepage" element={<HomePage />} />



        </Routes>
      
      
      </BrowserRouter>
    
    </>
  )
}

export default App
