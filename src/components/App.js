import "./App.css";
import Animator from "./Animator";
import Content from "./Content";
import HoverButton from "./HoverButton";
import React, { useRef } from "react";

export default function App() {
  const ref = useRef(null);

  return (
    <>
      <div className="viewport-wrapper">
        <Animator/>
        <HoverButton toRef={ref}/>
      </div>
      <Content isRef={ref}/>
    </>
  );
}
