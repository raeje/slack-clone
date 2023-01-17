import React from "react";
import { useLocation } from "react-router-dom";

const Loading = () => {
  const location = useLocation();
  const { state } = location;

  return (
    <section className="loading-page">
      <h1 className="loading-header">{state.header}</h1>
      <span className="loading-message">{state.message}</span>
    </section>
  );
};

export default Loading;
