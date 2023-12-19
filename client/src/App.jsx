import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import LoginPage from "./scenes/loginPage/loginPage.jsx";
import HomePage from "./scenes/homePage/homePage.jsx";
import NavBar from "./scenes/navBar/navBar.jsx";
import CalendarPage from "./scenes/calendarPage/calendarPage";
import RecipesPage from "./scenes/recipesPage/recipesPage.jsx";
import PantryPage from "./scenes/pantryPage/pantryPage.jsx";
import GroceryPage from "./scenes/groceryPage/groceryPage.jsx";
import { useSelector } from "react-redux";
import { CssBaseline } from "@mui/material";

function App() {
  const isAuth = Boolean(useSelector((state) => state.token));

  return (
    <div className="app">
      <BrowserRouter>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          {/* <Route
            path='/home'
            element={isAuth ? <HomePage /> : <Navigate to='/' />}
          /> */}
          <Route
            exact
            path="/home"
            element={
              <>
                <NavBar />
                <HomePage />
              </>
            }
          />
          <Route
            exact
            path="/calendar"
            element={
              <>
                <NavBar />
                <CalendarPage />
              </>
            }
          />
          <Route
            exact
            path="/recipes"
            element={
              <>
                <NavBar />
                <RecipesPage />
              </>
            }
          />
          <Route
            exact
            path="/pantry"
            element={
              <>
                <NavBar />
                <PantryPage />
              </>
            }
          />
          <Route
            exact
            path="/grocery"
            element={
              <>
                <NavBar />
                <GroceryPage />
              </>
            }
          />

          <Route
            path="/profile/:userId"
            element={isAuth ? <HomePage /> : <Navigate to="/home" />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
