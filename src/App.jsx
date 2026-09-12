import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout.jsx';
import HomePage from './Pages/HomePage/HomePage.jsx';

import MoviesPage from './Pages/MoviesPage/MoviesPage';

import MovieInformationPage from './Pages/MovieInformationPage/MovieInformationPage.jsx';

import BookingPage from './Pages/BookingPage/BookingPage.jsx';

import SignInPage from './Pages/SignInPage/SignInPage.jsx';

import ProfilePage from "./pages/ProfilePage/ProfilePage";

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

        <Route path="/movies/:slug" element={<Layout />}>
          <Route index element={<MovieInformationPage />} />
        </Route>

        <Route path="/tickets/:slug/:date/:time" element={<Layout />}>
          <Route index element={<BookingPage />} />
        </Route>

        <Route path="/sign-in" element={<Layout />}>
          <Route index element={<SignInPage />} />
        </Route>
        
        <Route path="/profile" element={<Layout />}>
          <Route index element={<ProfilePage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
