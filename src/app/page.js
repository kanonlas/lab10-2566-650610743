"use client";
import { UserCard } from "@/components/UserCard";
import { cleanUser } from "@/libs/cleanUser";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

export default function RandomUserPage() {
  //user = null or array of object
  const [users, setUsers] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [genAmount, setGenAmount] = useState(1); // อยากได้กี่คน
  const [isfirstload, setisfirstload] = useState(true);

  useEffect(() => {
    if (isfirstload) {
      setisfirstload(false); // ทำให้ไม่เอาค่าว่างเปล่าเขียน storage
      return;
    }
    const firstTrue = JSON.stringify(genAmount);
    localStorage.setItem("index", firstTrue);
  }, [genAmount]);

  useEffect(() => {
    const stramount = localStorage.getItem("index"); // get ข้อมูล in storage
    if (stramount === null) {
      setGenAmount();
      return;
    }
    const loadedindex = JSON.parse(stramount); //แปลง string เป็น object //error all code เพราะ มีการใช้ null โดยไม่ได้ check
    setGenAmount(loadedindex);
  }, []);

  const generateBtnOnClick = async () => {
    setIsLoading(true);
    const resp = await axios.get(
      `https://randomuser.me/api/?results=${genAmount}`
    );
    setIsLoading(false);
    const users = resp.data.results.map((n) => cleanUser(n)); //user เป็น array
    setUsers(users);

    //Your code here
    //Process result from api response with map function. Tips use function from /src/libs/cleanUser
    //Then update state with function : setUsers(...)
  };

  return (
    <div style={{ maxWidth: "700px" }} className="mx-auto">
      <p className="display-4 text-center fst-italic m-4">Users Generator</p>
      <div className="d-flex justify-content-center align-items-center fs-5 gap-2">
        Number of User(s)
        <input
          className="form-control text-center"
          style={{ maxWidth: "100px" }}
          type="number"
          onChange={(e) => setGenAmount(e.target.value)}
          value={genAmount}
        />
        <button className="btn btn-dark" onClick={generateBtnOnClick}>
          Generate
        </button>
      </div>
      {isLoading && (
        <p className="display-6 text-center fst-italic my-4">Loading ...</p>
      )}
      {users &&
        !isLoading &&
        users.map((n, index) => (
          <UserCard
            key={index}
            name={n.name}
            imgUrl={n.imgUrl}
            address={n.address}
            email={n.email}
          ></UserCard>
        ))}
    </div>
  );
}
