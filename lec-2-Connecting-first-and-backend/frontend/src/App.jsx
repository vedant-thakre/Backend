import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [jokes, setJokes] = useState([]);

  const fetchJokes = async () => {
    try {
      const res = await axios.get("/api/jokes");
      console.log(res);
      setJokes(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchJokes();
  }, []);

  return (
    <>
      <h1>Dad Jokes</h1>
      <p>JOKES : {jokes.length}</p>
      {jokes &&
        jokes.map((item, index) => (
          <div
            key={item.id}
            style={{
              padding: "5px 10px",
              textAlign: "start",
              border: "1px solid gray",
              marginBottom: "10px",
              borderRadius: "5px",
            }}
          >
            <h4>{item?.name}</h4>
            <h5>{item?.joke}</h5>
          </div>
        ))}
    </>
  );
}

export default App;
