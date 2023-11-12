import { Wrapper } from "@googlemaps/react-wrapper";
import { useRef, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import NavBar from "./navBar"; // Import the NavBar component


import "./Map.css"
const apiKey = "AIzaSyDu9piaKLUafIii0mOo_4kBWireBuBD9c8"
const mapID = "cffb0fc5ff2ba235"

const listingData = [
    {
      listId: "asdgAWEDASf23Ey",
      sellerId: "sdasdgWERf",
      position: { lat: 51.0688630579, lng: -114.119499522 },
      supplying: 200,
      rate: 2,
      email: "seller1@example.com"
    },
    {
      listId: "asdgdsdAWEDASf23Ey",
      sellerId: "sdasdgWdsdgERf",
      position: { lat: 39.901996392 , lng: 116.38833178 },
      supplying: 424,
      rate: 4,
      email: "seller2@example.com"
    },
    {
      listId: "asdgdsdAWEDASf23Ey",
      sellerId: "sdasdgWdsdgERf",
      position: { lat: 51.0520, lng: -114.0653 }, // Calgary, Alberta
      supplying: 300,
      rate: 3,
      email: "seller3@example.com"
    },
    {
      listId: "asdgdsdAWEDASf23Ey",
      sellerId: "sdasdgWdsdgERf",
      position: { lat: 51.0486, lng: -114.0708 }, // Calgary, Alberta
      supplying: 150,
      rate: 5,
      email: "seller4@example.com"
    },
    {
      listId: "asdgdsdAWEDASf23Ey",
      sellerId: "sdasdgWdsdgERf",
      position: { lat: 51.0710, lng: -114.1996 }, // Calgary, Alberta
      supplying: 400,
      rate: 4,
      email: "seller5@example.com"
    }
  ];


export default function Map() {
    return (
      <Wrapper
        apiKey= {apiKey}
        version="beta"
        libraries={["marker"]}
      >
        <NavBar />
        <MyMap />
      </Wrapper>
    );
  }


  const mapOptions = {
    mapId: mapID,
    center: { lat: 51.078621, lng: -114.136719 },
    zoom: 10,
    disableDefaultUI: true,
  };

  function MyMap() {
    const [map, setMap] = useState();
    const ref = useRef();
  
    useEffect(() => {
      setMap(new window.google.maps.Map(ref.current, mapOptions));
    }, []);
  
    return (
      <>
      <div id ="map_Container"> 

        <div ref={ref} id="map"  />
        {map && <Listings map = {map}/>}
      </div>
      </>
    );
    
  }

  function Listings({ map }) {
    const [data, setData] = useState([]);
  
    useEffect(() => {
      // Simulating fetching data asynchronously
      // Replace this with your actual data fetching logic
      const fetchData = async () => {
        // Simulated data for demonstration
        const fakeData = [
          {
            listId: "asdgAWEDASf23Ey",
            sellerId: "sdasdgWERf",
            position: { lat: 51.0688630579, lng: -114.119499522 },
            supplying: 200,
            rate: 2,
            email: "seller1@example.com"
          },
          {
            listId: "asdgdsdAWEDASf23Ey",
            sellerId: "sdasdgWdsdgERf",
            position: { lat: 39.901996392, lng: 116.38833178 },
            supplying: 424,
            rate: 4,
            email: "seller2@example.com"
          },
          {
            listId: "asdgdsdAWEDASf23Ey",
            sellerId: "sdasdgWdsdgERf",
            position: { lat: 51.0520, lng: -114.0653 },
            supplying: 300,
            rate: 3,
            email: "seller3@example.com"
          },
          {
            listId: "asdgdsdAWEDASf23Ey",
            sellerId: "sdasdgWdsdgERf",
            position: { lat: 51.0486, lng: -114.0708 },
            supplying: 150,
            rate: 5,
            email: "seller4@example.com"
          },
          {
            listId: "asdgdsdAWEDASf23Ey",
            sellerId: "sdasdgWdsdgERf",
            position: { lat: 51.0710, lng: -114.1996 },
            supplying: 400,
            rate: 4,
            email: "seller5@example.com"
          }
        ];
  
        setData(fakeData);
      };
  
      fetchData();
    }, []);
  
    return (
      <>
        {data.map((item, index) => (
          <Marker
            key={index}
            map={map}
            position={item.position}
            email={item.email}
            supplying={item.supplying}
            rate={item.rate}
          />
        ))}
      </>
    );
  }


  function Marker({ map, position, email, supplying, rate }) {
    const markerRef = useRef(null);
  
    useEffect(() => {
      // Function to handle the contact button click
      window.openContactForm = function () {
        // Replace this with your actual logic to open the contact form
        console.log(`Opening contact form for ${email}`);
      };
  
      if (!markerRef.current) {
        markerRef.current = new window.google.maps.Marker({
          position,
          map,
        });
  
        const infowindow = new window.google.maps.InfoWindow({
          content: `
            <div>
              <h2>Email: ${email}</h2>
              <p>Supplying: ${supplying} Watt</p>
              <p>Rate: $${rate} /Watts</p>
              <button hover="openContactForm()">Contact Seller</button>
            </div>
          `,
        });
  
        markerRef.current.addListener('click', () => {
          infowindow.open(map, markerRef.current);
        });
      }
    }, [map, position, email, supplying, rate]);
  
    useEffect(() => {
      // Update marker position if necessary
      if (markerRef.current) {
        markerRef.current.setPosition(position);
      }
    }, [position]);
  
    return null;
  }
  
