import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Layout from "./Layout.jsx";

import HomePage
  from "./Pages/HomePage/HomePage.jsx";

import MoviesPage
  from "./Pages/MoviesPage/MoviesPage";

import MovieInformationPage
  from "./Pages/MovieInformationPage/MovieInformationPage.jsx";

import BookingPage
  from "./Pages/BookingPage/BookingPage.jsx";

import SignInPage
  from "./Pages/SignInPage/SignInPage.jsx";

import ProfilePage
  from "./Pages/ProfilePage/ProfilePage";

import SignUpPage
  from "./Pages/SignUpPage/SignUpPage.jsx";

import AIPage
  from "./Pages/AIPage/AIPage.jsx";


function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={<Layout />}
        >
          <Route
            index
            element={<HomePage />}
          />
        </Route>


        {/* MOVIES */}
        <Route
          path="/movies"
          element={<Layout />}
        >
          <Route
            index
            element={<MoviesPage />}
          />
        </Route>


        {/* MOVIE INFORMATION */}
        <Route
          path="/movies/:slug"
          element={<Layout />}
        >
          <Route
            index
            element={
              <MovieInformationPage />
            }
          />
        </Route>


        {/* BOOKING */}
        <Route
          path="/tickets/:slug/:showtimeId/:date/:time"
          element={<Layout />}
        >
          <Route
            index
            element={<BookingPage />}
          />
        </Route>


        {/* SIGN IN */}
        <Route
          path="/sign-in"
          element={<Layout />}
        >
          <Route
            index
            element={<SignInPage />}
          />
        </Route>


        {/* SIGN UP */}
        <Route
          path="/sign-up"
          element={<Layout />}
        >
          <Route
            index
            element={<SignUpPage />}
          />
        </Route>


        {/* PROFILE */}
        <Route
          path="/profile"
          element={<Layout />}
        >
          <Route
            index
            element={<ProfilePage />}
          />
        </Route>


        {/* AI MOVIE RECOMMENDATIONS */}
        <Route
          path="/ai"
          element={<Layout />}
        >
          <Route
            index
            element={<AIPage />}
          />
        </Route>

      </Routes>

    </BrowserRouter>
  );
}


export default App;