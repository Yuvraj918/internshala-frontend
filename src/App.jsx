    import { Routes, Route } from 'react-router-dom';
    import ViewItems from './components/ViewItems.jsx';
    import AddItems from './components/AddItems.jsx';

function App() {
  

  return (
    <Routes>
          <Route path="/" element={<ViewItems />} />
           <Route path="/additems" element={<AddItems />} />
    </Routes>
  )
}

export default App
