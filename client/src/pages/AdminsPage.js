import React, {} from "react";
import { useNavigate} from "react-router-dom";
import profileImg from "../static/picture2.png";

// Creates the homepage of the application
function AdminsPage() {
 
  const navigate = useNavigate();

  // Changes the text for the button if the user has logged in.
  function displayButton() {
    
    const element = document.getElementById("Welcome-header");
    if (sessionStorage.getItem("email") !== null) {
      if (element !== null) {
        element.textContent = "ADMIN";
      }
      return "Add a new client";
    } else {
      if (element !== null) {
        element.textContent = "Welcome. We are here to help you.";
      }
      return "Login";
    }
  }
  function displayButton1() {
    
    const element = document.getElementById("Welcome-header");
    if (sessionStorage.getItem("email") !== null) {
      if (element !== null) {
        element.textContent = "ADMIN";
      }
      return "Add a new pet";
    } else {
      if (element !== null) {
        element.textContent = "Welcome. We are here to help you.";
      }
      return "Login";
    }
  }

  // Changes the action of the main button if the user is logged in or not.
  function buttonAction() {
   
    if (sessionStorage.getItem("email") !== null) {
      navigate("/AddClient");
    } else {
      navigate("/LogIn");
    }
  }

  function buttonAction1() {
   
    if (sessionStorage.getItem("email") !== null) {
      navigate("/AddPet");
    } else {
      navigate("/LogIn");
    }
  }

  // Returns user profile if the user is logged in.

if (sessionStorage.getItem("token")) {
  return (
    <div id="globaldiv">
    <div id="background">
      <h3 id="Welcome-header">Hi, Admin</h3>
      <h4>{sessionStorage.getItem("email")}</h4>
      <button className="btn btn-info" onClick={() => buttonAction()}>
        {" "}
        {displayButton()}
      </button>
      <button className="btn btn-info" onClick={() => buttonAction1()}>
        {" "}
        {displayButton1()}
      </button>
    </div>
    <div className="container" style={{ marginTop: "30px" }}>
      <div className="main-body">
        <div className="row">
          <div className="col-md-6">
            <div id="userprofile">
              <img src={profileImg} alt="User Profile" width={400}/>
              <p>Name</p>
              <p>email</p>
            </div>
          </div>
        
        </div>
      </div>
    </div>
  </div>
  
  );
} 
}

export default AdminsPage;
