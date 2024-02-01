import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import { auth, db } from "../config/firebase.config";
import Spinner from "../components/Spinner";

const Facility = () => {
  const { facility } = useParams();
  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [timeslot, setTimeslot] = useState([]);
  const [available, setAvailable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("useEffect fired");

    onAuthStateChanged(auth, (user) => {
      if (!user) navigate("/signin");
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    console.log("useEffect fired");

    const getTimeslots = async () => {
      if (date && location) {
        setTimeslot([]);

        try {
          setAvailable([]);
          setLoading(true);
          setError("");

          const q = query(
            collection(db, "bookings"),
            where("facility", "==", facility),
            where("date", "==", date),
            where("location", "==", location)
          );
          const snapshot = await getDocs(q);

          let timeslots = [];
          snapshot.forEach((doc) => timeslots.push(...doc.data().timeslot));

          let availableTimeslots = Array.from(
            { length: end - start },
            (_, index) => start + index
          );
          availableTimeslots = availableTimeslots.filter(
            (timeslot) => !timeslots.includes(timeslot)
          );

          setAvailable(availableTimeslots);
          setLoading(false);
          setError("");
        } catch (error) {
          setAvailable([]);
          setLoading(false);
          setError(error.message);
        }
      }
    };

    getTimeslots();
    // eslint-disable-next-line
  }, [date, location]);

  let details;
  if (facility === "barbeque")
    details = { title: "Barbeque Pit", locations: 2, start: 8, end: 20 };
  else if (facility === "clubhouse")
    details = { title: "Clubhouse", locations: 5, start: 8, end: 22 };
  else if (facility === "gymnasium")
    details = { title: "Gymnasium", locations: 2, start: 8, end: 20 };
  else if (facility === "squash")
    details = { title: "Squash Court", locations: 2, start: 8, end: 20 };
  else if (facility === "tennis")
    details = { title: "Tennis Court", locations: 2, start: 8, end: 20 };
  const { title, locations, start, end } = details;

  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Singapore",
  });

  const handleLocation = (value) => {
    if (location === value) setLocation("");
    else setLocation(value);
  };

  const handleTimeslot = (value) => {
    const isChecked = timeslot.includes(value);

    if (isChecked) setTimeslot(timeslot.filter((item) => item !== value));
    else setTimeslot([...timeslot, value]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (location && timeslot.length > 0) {
      try {
        setLoading(true);
        setError("");

        const booking = {
          uid: auth?.currentUser?.uid,
          facility,
          date,
          location,
          timeslot: timeslot.sort((a, b) => a - b),
          timestamp: serverTimestamp(),
        };

        await addDoc(collection(db, "bookings"), booking);
        setLoading(false);
        setError("");
        navigate("/");
      } catch (error) {
        setLoading(false);
        setError(error.message);
      }
    } else {
      window.alert("Please select location and timeslots.");
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="facility">
      <button onClick={() => navigate("/")}>Back</button>
      <h1>{title}</h1>
      <form onSubmit={handleSubmit}>
        <h2>Select Date</h2>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min={today}
          required
        />

        <h2>Select Location</h2>
        {!date && <p>Please select date.</p>}
        {date &&
          Array.from({ length: locations }, (_, index) => (
            <div key={index}>
              <label>
                <input
                  type="checkbox"
                  value={index + 1}
                  checked={location === index + 1}
                  onChange={() => handleLocation(index + 1)}
                />
                {index + 1}
              </label>
            </div>
          ))}

        <h2>Available Timeslots</h2>
        {!(date && location) && <p>Please select date and location.</p>}
        {date &&
          location &&
          available &&
          available.map((t, index) => (
            <div key={index}>
              <label>
                <input
                  type="checkbox"
                  value={t}
                  checked={timeslot.includes(t)}
                  onChange={() => handleTimeslot(t)}
                />
                {t} - {t + 1}
              </label>
            </div>
          ))}

        <button className="book-button" type="submit">
          Book
        </button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Facility;
