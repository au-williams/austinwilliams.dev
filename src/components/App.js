import "./App.css";
import { GOOGLE_ANALYTICS_MEASUREMENT_ID } from "../_config.json";
import Animator from "./Animator";
import Content from "./Content";
import HoverButton from "./HoverButton";
import React, { useEffect, useRef } from "react";
import ReactGA from 'react-ga4';

export default function App() {
  const ref = useRef(null);

  useEffect(() => {
    ReactGA.initialize(GOOGLE_ANALYTICS_MEASUREMENT_ID);
    ReactGA.send("pageview");
  });

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
