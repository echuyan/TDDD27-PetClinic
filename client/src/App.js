import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


// Components
import Nav from "./pages/Nav.js";
import Homepage from "./pages/Homepage.js";
import SignUp from "./pages/SignUp.js";
import LogIn from "./pages/LogIn.js";
import Footer from "./pages/Footer.js";
import AddPet from  "./pages/AddPet.js";
import OwnersPage from  "./pages/OwnersPage.js";
import AdminsPage from  "./pages/AdminsPage.js";
import DoctorsPage from  "./pages/DoctorsPage.js";
import ChangePet from  "./pages/ChangePet.js";
import ChangeInfo from  "./pages/ChangeInfo.js";
import MakeAppointment from  "./pages/MakeAppointment.js";
import PetCard from  "./pages/PetCard.js";
import NewHealthRecordPage from  "./pages/NewHealthRecordPage.js";
import AddUser from  "./pages/AddUser.js";
import ResetPasswordPage from  "./pages/ResetPasswordPage.js";

// CSS-files
import "./App.css";
import "./pages/Homepage.css";
import "./pages/SignUp.css";
import "./pages/OwnersPage.css";
import "./pages/PetCard.css";
import "./pages/DoctorsPage.css";
import "./pages/AdminsPage.css";
import "./pages/Nav.css";

function App() {
  // If the user is not logged in:
  if (!sessionStorage.getItem("token")) {
    return (
      <Router>
        <div className="App">
          <Nav />
          <Routes>
           
            <Route path="/LogIn" element={<LogIn />} />
            <Route path="/SignUp" element={<SignUp />} />
            <Route path="/Home" element={<Homepage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route
              path="*"
              element={
                <main style={{ padding: "1rem" }}>
                  <p>Welcome to our clinic!</p>
                </main>
              }
            />
          </Routes>
          <Footer/>
        </div>
      </Router>
    );
  }
  // If the user is logged in:
  else {
    return (
     
        <Router>
          <div className="App">
            <Nav />
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/OwnersPage" element={<OwnersPage />} />
              <Route path="/DoctorsPage" element={<DoctorsPage />} />
              <Route path="/AdminsPage" element={<AdminsPage />} />
              <Route path="/ChangePet/:petId" element={<ChangePet />} />
              <Route path="/ChangeInfo/:email" element={<ChangeInfo />} />
              <Route path="/AddPet/:email" element={<AddPet />} />
              <Route path="/MakeAppointment/:email" element={<MakeAppointment />} />
              <Route path="/PetCard/:petId" element={<PetCard />} />
              <Route path="/PetCard/:doctorId/:petId" element={<PetCard />} />
              <Route path="/NewHealthRecordPage/:doctorId/:petId" element={<NewHealthRecordPage />} />
              <Route path="/AddUser" element={<AddUser />} />
              <Route
                path="*"
                element={
                  <main style={{ padding: "1rem" }}>
                    <p>Ooops! The page requested doesn't exist.</p>
                  </main>
                }
              />
            </Routes>
          </div>
        </Router>

    );
  }
}

export default App;
