import React, { useEffect } from 'react';

const App = () => {
  useEffect(() => {
    import('@/utils/index.js');
  }, []);

  return (
    <div className="wrapper">
      <div className="context-menu" id="contextMenu"></div>

      <div className="locations-container" id="locations-container" data-ship="">
        <img
          src="/images/locationImages/PhobosUnexplored.jpg"
          className="PhobosUnexplored location"
          name="Phobos"
          data-row="1"
          data-column="1"
          alt="Phobos"
        />
        <img
          src="/images/locationImages/MarsFlyby.jpg"
          className="MarsFlyby location"
          name="Mars FlyBy"
          data-row="1"
          data-column="2"
          alt="Mars FlyBy"
        />
        <img
          src="/images/locationImages/Ceres-unexplored.jpg"
          className="Ceres-unexplored location"
          name="Ceres"
          data-row="1"
          data-column="3"
          alt="Ceres"
        />
        <img
          src="/images/locationImages/VenusOrbit.jpg"
          className="VenusOrbit location"
          name="Venus Orbit"
          data-row="1"
          data-column="4"
          alt="Venus Orbit"
        />
        <img
          src="/images/locationImages/VenusUnexplored.jpg"
          className="VenusUnexplored location"
          name="Venus"
          data-row="1"
          data-column="5"
          alt="Venus"
        />
        <img
          src="/images/locationImages/MarsUnexplored.jpg"
          className="MarsUnexplored location"
          name="Mars"
          data-row="2"
          data-column="1"
          alt="Mars"
        />
        <img
          src="/images/locationImages/LunarOrbit.jpg"
          className="LunarOrbit location"
          name="Lunar Orbit"
          data-row="3"
          data-column="4"
          alt="Lunar Orbit"
        />
        <img
          src="/images/locationImages/MarsOrbit.jpg"
          className="MarsOrbit location"
          name="Mars Orbit"
          data-row="2"
          data-column="2"
          alt="Mars Orbit"
        />
        <img
          src="/images/locationImages/InnerPlanetsTransferWithMercury.jpg"
          className="InnerPlanetsTransferWithMercury location"
          name="Inner Planets Transfer"
          data-row="2"
          data-column="3"
          alt="Inner Planets Transfer"
        />
        <img
          src="/images/locationImages/VenusFlyby.jpg"
          className="VenusFlyby location"
          name="Venus FlyBy"
          data-row="2"
          data-column="4"
          alt="Venus FlyBy"
        />
        <img
          src="/images/locationImages/Earthorbit.jpg"
          className="Earthorbit location"
          name="Earth Orbit"
          data-row="3"
          data-column="3"
          alt="Earth Orbit"
        />
        <img
          src="/images/locationImages/MoonUnexplored.jpg"
          className="MoonUnexplored location"
          name="Moon"
          data-row="3"
          data-column="5"
          alt="Moon"
        />
        <img
          src="/images/locationImages/MercuryFlyby.jpg"
          className="MercuryFlyby location"
          name="Mercury FlyBy"
          data-row="4"
          data-column="1"
          alt="Mercury FlyBy"
        />
        <img
          src="/images/locationImages/MercuryOrbit.jpg"
          className="MercuryOrbit location"
          name="Mercury Orbit"
          data-row="4"
          data-column="2"
          alt="Mercury Orbit"
        />
        <img
          src="/images/locationImages/SuborbitalFlightUnexplored.jpg"
          className="SuborbitalFlightUnexplored location"
          name="Suborbital Flight"
          data-row="4"
          data-column="3"
          alt="Suborbital Flight"
        />
        <img
          src="/images/locationImages/LunarFlyBy.jpg"
          className="LunarFlyBy location"
          name="Lunar FlyBy"
          data-row="4"
          data-column="4"
          alt="Lunar FlyBy"
        />
        <img
          src="/images/locationImages/MercuryUnexplored.jpg"
          className="MercuryUnexplored location"
          name="Mercury"
          data-row="5"
          data-column="2"
          alt="Mercury"
        />
        <img
          src="/images/locationImages/Earth.jpg"
          className="Earth location"
          name="Earth"
          data-row="5"
          data-column="3"
          alt="Earth"
        />
        <img
          src="/images/locationImages/SolarRadiationUnexplored.jpg"
          className="SolarRadiationUnexplored location"
          name="Solar Radiation"
          alt="Solar Radiation"
        />

        <div className="buttons-location location">
          <button id="create-new-ship-btn" className="btn btn-primary create-new-ship-btn">
            DOCK NEW SHIP
          </button>
          <button className="btn btn-secondary create-new-ship-btn">
            ASSEMBLE NEW SHIP
          </button>
          <button className="btn btn-success create-new-ship-btn">
            CLAIM OBJECTIVE
          </button>
        </div>

        <div className="ships-container"></div>

        <div className="ship-icon-container">
          {/* <img
            src="/images/otherImages/nave2.png"
            className="shipImg"
            alt="Ship"
          /> */}
        </div>
      </div>
    </div>
  );
};

export default App; 