
import React, { useState, useEffect } from "react"
import {
    useParams
  } from "react-router-dom";
import './Force.css';

const HtmlToReactParser = require('html-to-react').Parser;

function Force() {
    const [force, setForce] = useState([])
    const [stopSearchData, setStopSearchData] = useState([])
    const [filteredStopSearchData, setFilteredStopSearchData] = useState([])
    const [description, setDescription] = useState('')
    const [date, setDate] = useState('')
    const [month, setMonth] = useState('')
    const [selectedSearchType, setSelectedSearchType] = useState('')
    const { forceId } = useParams();

    const fetchStopSearchData = (date, selectedSearchType = '') => {

      fetch('https://data.police.uk/api/stops-force?force=' + forceId + '&date=' + date)
        .then(response => {
          return response.json()
        })
        .then(data => {

          // Sets total data to be filtered later
          setStopSearchData(data)

          // Sets filtered data by searchType
          if(selectedSearchType !== '') {
            data = data.filter((row) => {
              return row.type === selectedSearchType;
            })
          }

          setFilteredStopSearchData(data)
        })
        .catch(function(error) {
          console.log('Request failed', error);
        });

    }

    // Fetches general info for chosen Police Force
    const fetchForce = () => {
      fetch('https://data.police.uk/api/forces/' + forceId)
        .then(response => {
          return response.json()
        })
        .then(data => {
              setForce(data)

              // Parses html from description to display in code
              const htmlToReactParser = new HtmlToReactParser();
              const reactHtml = htmlToReactParser.parse(data.description);

              setDescription(reactHtml)
        })
    }

    // Fetches filtered stop and search data by searchType
    const fetchFilteredStopAndSearchData = (selectedSearchType) => {

      let newData = []

      if(selectedSearchType !== '') {
        newData = stopSearchData.filter((row) => {
          return row.type === selectedSearchType;
        })
      }

      setFilteredStopSearchData(newData)
    }

    // Sets current month, fetches force info & makes initial stop and search request
    useEffect(() => {
      setSelectedMonth('today')
      fetchForce()
      fetchStopSearchData()
    }, [])

    // Sets the selected or current month
    const setSelectedMonth = (dateString = null) => {

      let d;

      if(dateString === 'today') {
        d = new Date();
      } else {
        d = new Date(dateString);
      }

      let m = d.getMonth() + 1;

      if(m < 10) {
        m = '0' + m
      }

      let y = d.getFullYear();
      let date = y + '-' + m;

      setDate(date)
      setMonth(d.toLocaleString('default', { month: 'long' }))
    }

    // Changes date & updates API calls
    const changeDate = (event) => {
      setDate(event.target.value)
      setSelectedMonth(event.target.value)
      fetchStopSearchData(event.target.value, selectedSearchType)
    };

    // Changes searchType & updates API calls
    const changeSearchType = (event) => {
      setSelectedSearchType(event.target.value)

      if(event.target.value === '') {
        setFilteredStopSearchData(stopSearchData)
      } else {
        fetchFilteredStopAndSearchData(event.target.value)
      }

    };

  return (
    <div className="container">
      <div className="force-data-container">
        <h1>{force.name}</h1>
        <div>{description}</div>
        <p>Website Url: <a href={force.url}>{force.url}</a></p>
        <p>Telephone: <a href={`tel:+44${force.telephone}`}>{force.telephone}</a></p>
      </div>

      <div>
        <p className="force-data-title">Stop & Search Data this year</p>

        <div className="filter-container">
          <div>
            <label htmlFor="date">Month:</label>
            <select onChange={changeDate} value={date} id="date">
              <option value="2023-08">August 2023</option>
              <option value="2023-07">July 2023</option>
              <option value="2023-06">June 2023</option>
              <option value="2023-05">May 2023</option>
              <option value="2023-04">April 2023</option>
              <option value="2023-03">March 2023</option>
              <option value="2023-02">February 2023</option>
              <option value="2023-01">January 2023</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="searchType">Search Type:</label>
            <select onChange={changeSearchType} value={selectedSearchType} id="searchType">
              <option value="" defaultValue>All</option>
              <option value="Person search">Person search</option>
              <option value="Vehicle search">Vehicle search</option>
            </select>
          </div>
       
        </div>

        
      </div>
      <div>
        {filteredStopSearchData.length < 1 &&        
          <p>No data found for {month}.</p>
        }
        {filteredStopSearchData.length > 0 && (
          
          <div>
            <p>{filteredStopSearchData.length} values found</p>

            <ul className="force-item__list">
              {filteredStopSearchData.map((data, index) => (
                  <li key={index} className="force-item">
                      <p>
                        <span className="force-item__heading">Type: </span>
                        {data.type}
                      </p>
                      <p>
                        <span className="force-item__heading">Object of Search: </span>
                        {data.object_of_search}
                      </p>
                      <p>
                        <span className="force-item__heading">Legislation: </span>
                        {data.legislation}
                      </p>
                      <p>
                        <span className="force-item__heading">Outcome: </span>
                        {data.outcome}
                      </p>
                  </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Force;
