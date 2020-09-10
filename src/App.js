import React, { useState, useEffect } from 'react';
import './App.css';
import {
  FormControl,
  Select,
  MenuItem  
} from '@material-ui/core';
import InfoBox from "./InfoBox";

function App() {
  const [countries, setCountries]=useState([]);
  const [country, setCountry]=useState('worldwide');
  const [countryInfo, setCountryInfo]=useState({});

  useEffect(() =>{ 
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then((data) => {
      setCountryInfo(data)
    })
    },[])

  useEffect(() =>{
    //Code inside this will execute once the app/component is loaded and also when the countries variable changes
    //async ==> send a request to server and wait for it ,do something with info

    const getContriesData=async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data)=>{
        const countries = data.map((country) => (
          {
            name:country.country, //United State, India
            value:country.countryInfo.iso2 //US, IN
          }
        ));

        setCountries(countries);
      });
    };
    getContriesData();
  },[countries]);

  const onCountryChange=async(event) => {
    const CountryCode=event.target.value;
    setCountry(CountryCode);

    const url=CountryCode ==='worldwide' ? 
    'https://disease.sh/v3/covid-19/all' : 
    `https://disease.sh/v3/covid-19/countries/${CountryCode}`
    
    await fetch(url).then(response => response.json())
    .then(data => {
      setCountry(CountryCode);
      setCountryInfo(data);

      })
  };

  return (
    <div className="App">
      <div className="app_left">
      <div className="app__header">
      <h1>COVID-19 Tracker</h1>
      <FormControl className="app__dropdown" >
        <Select varial="outlines"
        onChange={onCountryChange} 
        value={country}>
          <MenuItem value="worldwide">WorldWide</MenuItem>
          {
            countries.map((country) =>
          <MenuItem value={country.value}>{country.name}</MenuItem>)
          }
        </Select>
      </FormControl>
      </div>

      <div className="app__stats">
          <InfoBox
            title="Coronavirus cases" 
            cases={countryInfo.todayCases} 
            total={countryInfo.cases}
            />
          <InfoBox 
            title="Recovered" 
            cases={countryInfo.todayRecovered} 
            total={countryInfo.recovered}
            />
          <InfoBox
            title="Deaths" 
            cases={countryInfo.todayDeaths} 
            total={countryInfo.deaths}
            />
      </div>
      
      
      </div>
    </div>
  );
}

export default App;
