import { Route, Routes } from "react-router-dom";
import FlightSearch from "./Components/Ticket";
import Hero from "./Components/Hero";
import MyItineary from "./Components/MyItineary";
import Admin from "./Components/Admin";
import OAuth2SuccessPage from "./Components/OAuth2SuccessPage";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Hero />}></Route>
        <Route path="/oauth2-success" element={<OAuth2SuccessPage />} />
        <Route path="/myitineary" element={<MyItineary></MyItineary>}></Route>
        <Route path="/admin" element={<Admin />}></Route>
        <Route path="/ticket" element={<FlightSearch />}></Route>
      </Routes>
    </>
  );
}

export default App;
