import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout.jsx';
import HomePage from './Pages/HomePage/HomePage.jsx';

import MoviesPage from './Pages/MoviesPage/MoviesPage';

import MovieInformationPage from './Pages/MovieInformationPage/MovieInformationPage.jsx';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
        </Route>

        <Route path="/movies" element={<Layout />}>
          <Route index element={<MoviesPage />} />    
        </Route>

        <Route path="/movies/:movie_name" element={<Layout />}>
          <Route index element={<MovieInformationPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
