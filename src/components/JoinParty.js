import React from "react";
import { useNavigate } from "react-router-dom";

export default function JoinParty() {
  const navigate = useNavigate();
  console.log(window.location);
  return (
    <div>
      <p>🎉 Join 🎉</p>
    </div>
  );
}
