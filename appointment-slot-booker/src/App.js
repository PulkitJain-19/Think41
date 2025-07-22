import React, { useState, useEffect } from 'react';
import './index.css';

function generateSlots() {
  const slots = [];
  let start = 9 * 60;
  const end = 17 * 60;
  while (start < end) {
    const hours = String(Math.floor(start / 60)).padStart(2, '0');
    const minutes = String(start % 60).padStart(2, '0');
    slots.push(`${hours}:${minutes}`);
    start += 30;
  }
  return slots;
}

function App() {
  const [selectedDate, setSelectedDate] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [adminInput, setAdminInput] = useState('');

  const allSlots = generateSlots();

  const handleSlotBooking = (slot) => {
    if (!bookedSlots.includes(slot)) {
      const updated = [...bookedSlots, slot];
      setBookedSlots(updated);
      setConfirmationMessage(`✅ Appointment booked for ${slot} on ${selectedDate}`);
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setBookedSlots([]);
    setConfirmationMessage('');
  };

  const handleAdminBooking = () => {
    const time = adminInput.trim();
    const isValidFormat = /^\d{2}:\d{2}$/.test(time);
    if (!isValidFormat) {
      alert("❌ Please enter a valid time in HH:mm format.");
      return;
    }
    if (!allSlots.includes(time)) {
      alert("❌ Invalid slot time. Must be between 09:00 and 17:00 in 30-minute intervals.");
      return;
    }
    if (bookedSlots.includes(time)) {
      alert("❌ Slot already booked.");
      return;
    }
    setBookedSlots([...bookedSlots, time]);
    setConfirmationMessage(`✅ Admin pre-booked slot at ${time} on ${selectedDate}`);
    setAdminInput('');
  };

  useEffect(() => {
    if (confirmationMessage) {
      const timer = setTimeout(() => setConfirmationMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [confirmationMessage]);

  return (
    <div>
      <h2>Appointment Slot Booker</h2>
      <label>Select a date: </label>
      <input type="date" value={selectedDate} onChange={handleDateChange} />
      {selectedDate && (
        <>
          <h3>Available Slots for {selectedDate}</h3>
          <div>
            {allSlots.map((slot) => (
              <button
                key={slot}
                onClick={() => handleSlotBooking(slot)}
                disabled={bookedSlots.includes(slot)}
                style={{
                  backgroundColor: bookedSlots.includes(slot) ? 'gray' : 'green',
                  color: 'white',
                }}
              >
                {slot}
              </button>
            ))}
          </div>
        </>
      )}
      {confirmationMessage && (
        <div style={{ marginTop: '10px', color: 'green', fontWeight: 'bold' }}>
          {confirmationMessage}
        </div>
      )}
      <div style={{ marginTop: '20px' }}>
        <h4>Admin: Pre-book a Slot</h4>
        <input
          type="text"
          placeholder="e.g. 11:30"
          value={adminInput}
          onChange={(e) => setAdminInput(e.target.value)}
        />
        <button onClick={handleAdminBooking}>Pre-book</button>
      </div>
    </div>
  );
}

export default App;
