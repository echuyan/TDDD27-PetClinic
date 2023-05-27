import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./MakeAppointment.module.css"; 
import { format, addDays,addHours, isWeekend, isWithinInterval } from 'date-fns';

function MakeAppointment() {
  const navigate = useNavigate();
  const { email } = useParams();

  const [userPetsData, setPetData] = useState([]);
  const [doctorsData, setDoctorsData] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

 useEffect(() => {
    // Fetch user's pets data
    const fetchPetsData = async () => {
      try {
        const response = await fetch('http://localhost:3000/Users/GetPets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: email,
          }),
        });
        const data = await response.json();
        setPetData(data.pets);
      } catch (error) {
        console.error('Error fetching user pets data:', error);
      }
    };

    // Fetch doctors data
    const fetchDoctorData = async () => {
      try {
        const response = await fetch('http://localhost:3000/Users/GetAllDoctors');
        const data = await response.json();
        setDoctorsData(data);
      } catch (error) {
        console.error('Error fetching doctors data:', error);
      }
    };

    fetchPetsData();
    fetchDoctorData();
  }, [email]);



 const handleSubmit = async (e) => {
    e.preventDefault();
    e.preventDefault();
  const petId = document.getElementById("pet").value;
 
  const doctorId = document.getElementById("doctor").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
 
  const datetimeString = `${date} ${time}`;
  const datetimeStart = new Date(datetimeString);
  const formattedDatetimeStart = datetimeStart.toISOString().slice(0, 19).replace("T", " ");
  const datetimePlusOneHour = new Date(datetimeStart.getTime() + (60 * 60 * 1000));
  const formattedDatetimePlusOneHour = datetimePlusOneHour.toISOString().slice(0, 19).replace("T", " ");
 
  const formData = {
    petId,
    doctorId,
    datetimeStart: formattedDatetimeStart,
    datetimePlusOneHour: formattedDatetimePlusOneHour,
  };

  console.log(formData);
  try {
   
    const response = await fetch("http://localhost:3000/Pets/MakeAppointment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      navigate("/OwnersPage");
    } else {
      const errorData = await response.json();
      console.error("Failed to create appointment:", errorData.error);
    }
  } catch (error) {
    console.error("Error creating appointment:", error);
  }
    navigate('/OwnersPage');
  };

  const handleBackButtonClick = () => {
    navigate('/OwnersPage');
  };

  const handleDateChange = (e) => {
    const selected = new Date(e.target.value);
    const selectedFormatted = format(selected, 'yyyy-MM-dd');
  
    setSelectedDate(selectedFormatted);
    setSelectedTime('');
  };
  
  const isWeekendDay = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday has index 0, Saturday has index 6
  };
  

  const generateTimeOptions = () => {
    const startTime = new Date();
    startTime.setHours(8, 0, 0); // Set the start of working time to 8 am
    const endTime = new Date();
    endTime.setHours(17, 0, 0); // Set the end  of working time to 5 pm

    const options = [];
    let currentTime = startTime;

    while (currentTime <= endTime) {
      options.push(format(currentTime, 'HH:mm'));
      currentTime = addHours(currentTime, 1);
    }

    return options;
  };

  const timeOptions = generateTimeOptions();

  return (
    <div className={styles.container}>
      <h1>Make an appointment to a doctor.</h1>
      <h2>Please choose a doctor, a pet, and a desired time of the visit.</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles['form-group']}>
          <label htmlFor="pet">Pet:</label>
          <select id="pet" required>
            {userPetsData.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="doctor">Doctor:</label>
          <select id="doctor" required>
            {doctorsData.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.firstname}
              </option>
            ))}
          </select>
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            onChange={handleDateChange}
            required
            value={selectedDate}
            min={format(new Date(), 'yyyy-MM-dd')}
            max={format(addDays(new Date(), 365), 'yyyy-MM-dd')}
            onInvalid={(e) => {
              e.target.setCustomValidity('Please select a valid date.');
            }}
            onBlur={(e) => {
              e.target.setCustomValidity('');
            }}
          />
        </div>

        {selectedDate && isWeekendDay(new Date(selectedDate)) && (
          <div className={styles['form-group']}>
            <p>Weekend days are not available for selection.</p>
          </div>
        )}
        {selectedDate && !isWeekend(new Date(selectedDate)) && (
          <div className={styles['form-group']}>
            <label htmlFor="time">Time:</label>
            <select id="time" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} required>
              <option value="">Select a time</option>
              {timeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}
        <button type="submit" className={styles['submit-button']}>
          Save Changes
        </button>
        <button type="button" className={styles['back-button']} onClick={handleBackButtonClick}>
          Back
        </button>
      </form>
    </div>
  );
}

export default MakeAppointment;