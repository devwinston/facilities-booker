import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { MdDelete } from "react-icons/md";

import { auth, db } from "../config/firebase.config";
import Spinner from "../components/Spinner";

const Home = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
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

    const getBookings = async (user) => {
      try {
        const q = query(
          collection(db, "bookings"),
          where("uid", "==", user.uid),
          orderBy("date")
        );
        const snapshot = await getDocs(q);

        let bookings = [];
        snapshot.forEach((doc) =>
          bookings.push({
            id: doc.id,
            data: doc.data(),
          })
        );

        setBookings(bookings);
        setLoading(false);
        setError("");
      } catch (error) {
        setBookings([]);
        setLoading(false);
        setError(error.message);
      }
    };

    onAuthStateChanged(auth, (user) => {
      if (user) getBookings(user);
      else navigate("/signin");
    });
    // eslint-disable-next-line
  }, []);

  const handleClick = (facility) => {
    navigate(`/facility/${facility}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Confirm delete?")) {
      await deleteDoc(doc(db, "bookings", id));

      const updatedBookings = bookings.filter((booking) => booking.id !== id);
      setBookings(updatedBookings);
    }
  };

  const handleSignout = async () => {
    await auth.signOut();
    navigate("/signin");
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="home">
      <button onClick={handleSignout}>Sign Out</button>
      <h1>Announcements</h1>
      <div className="announcements">
        <p>1. For any enquiries, please call 6888 8888.</p>
        <p>2. To report any defects, please call 6777 7777.</p>
        <p>
          3. The Gymnasium will be closed for renovations from 12 - 15 Feb 24.
        </p>
      </div>

      <h1>Your Bookings</h1>
      {bookings.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Facility</th>
              <th>Location</th>
              <th>Timeslot</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking, index) => (
              <tr key={index}>
                <td>
                  <p>
                    {new Date(booking.data.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "2-digit",
                    })}
                  </p>
                </td>
                <td>
                  <p>
                    {booking.data.facility.charAt(0).toUpperCase() +
                      booking.data.facility.slice(1)}
                  </p>
                </td>
                <td>
                  <p>{booking.data.location}</p>
                </td>
                <td>
                  {booking.data.timeslot.map((timeslot, index) => (
                    <p key={index}>
                      {timeslot} - {timeslot + 1}
                    </p>
                  ))}
                </td>
                <td>
                  <MdDelete
                    className="delete"
                    onClick={() => handleDelete(booking.id)}
                    size={25}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No bookings available.</p>
      )}
      {error && <p>{error}</p>}

      <h1>Book Facility</h1>
      <div className="grid">
        <div className="item" onClick={() => handleClick("barbeque")}>
          <h2>Barbeque Pit</h2>
        </div>
        <div className="item" onClick={() => handleClick("clubhouse")}>
          <h2>Clubhouse</h2>
        </div>
        <div className="item" onClick={() => handleClick("gymnasium")}>
          <h2>Gymnasium</h2>
        </div>
        <div className="item" onClick={() => handleClick("squash")}>
          <h2>Squash Court</h2>
        </div>
        <div className="item" onClick={() => handleClick("tennis")}>
          <h2>Tennis Court</h2>
        </div>
      </div>
    </div>
  );
};

export default Home;
