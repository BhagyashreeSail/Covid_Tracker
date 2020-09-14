import React, { useState, useEffect } from 'react';
import './App.css';
import { FormControl,
  MenuItem,
  Select,
  Card,
  CardContent
} from '@material-ui/core';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import { sortData, prettyPrintStat} from './util';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css"

function App() {
  const [countries, setCountries]=useState([]);
  const [country, setCountry]=useState('worldwide');
  const [countryInfo, setCountryInfo]=useState({});
  const [tableData, setTableData]=useState([]);
  const [mapCenter,setMapCenter]=useState({lat:34.80746,lng:-40.4796});
  const [mapZoom,setMapZoom]=useState(3);
  const[mapCountries,setMapCountries]=useState([]);
  const[caseType,setCaseType]=useState("cases");


  useEffect(() =>{ 
  fetch("https://disease.sh/v3/covid-19/all")
  .then(response => response.json())
  .then((data) => {
    setCountryInfo(data)
  })
  },[])

  //State=writing variable in react
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

        const sortedData= sortData(data);
        setTableData(sortedData);
        setMapCountries(data);
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

      if(CountryCode!=='worldwide'){
        setMapCenter([data.countryInfo.lat,data.countryInfo.long]);
      }
      else{
        
      setMapCenter([34.80746,-40.4796]);
      }
      setMapZoom(4);
    })
  };
  // console.log("Country info",countryInfo)
  return (
    <div className="app">
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
            active={caseType==="cases"}
            onClick={(e) => setCaseType("cases")}
            isRed
            title="Coronavirus cases" 
            cases={prettyPrintStat(countryInfo.todayCases)} 
            total={prettyPrintStat(countryInfo.cases)}
            />
          <InfoBox 
            active={caseType==="recovered"}
            onClick={(e) => setCaseType("recovered")}
            title="Recovered" 
            cases={prettyPrintStat(countryInfo.todayRecovered)} 
            total={prettyPrintStat(countryInfo.recovered)}
            />
          <InfoBox 
            active={caseType==="deaths"}
            onClick={(e) => setCaseType("deaths")}
            isRed
            title="Deaths" 
            cases={prettyPrintStat(countryInfo.todayDeaths)} 
            total={prettyPrintStat(countryInfo.deaths)}
            />
      </div>
      
      <Map 
      caseType={caseType}
      countries={mapCountries}
      center={mapCenter}
      zoom={mapZoom}
      />
      </div>
      
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases By Country</h3>
          <Table countries={tableData}/>
          <h3 className="app__graphTitle">WorldWide new {caseType}</h3>
          <LineGraph className="app__graph"caseType={caseType}/>
        </CardContent>
      </Card>

      </div>
  );
}

export default App;
