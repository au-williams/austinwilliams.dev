import "./App.css";
import Animator from "./Animator";
import Description from "./Description";
import HoverButton from "./HoverButton";
import React, { useRef } from "react";

export default function App(props) {
  const descriptionRef = useRef(null);

  return (
    <>
      <div id="vh-wrapper">
        <Animator/>
        <HoverButton toRef={descriptionRef}/>
      </div>
      <Description asRef={descriptionRef}/>
    </>
  );
}
