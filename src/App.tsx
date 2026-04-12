import { useState } from 'react'
import bgImg from './assets/MMdraft.png'
import './App.css'

// Local host by "npm run dev" in terminal, then open http://localhost:5173/ in browser to view app
function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
// API Caller
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert("Please enter a name")
      return
    }

    try {
      setLoading(true)

      const response = await fetch(
        `https://api.scryfall.com/cards/search?q=name:"${encodeURIComponent(
          searchQuery.trim()
        )}"&unique=art&include_variations=true`
      )

      if (!response.ok) {
        throw new Error("API request failed")
      }

      const data = await response.json()
      console.log("API Response:", data)

      setResult(data)
    } catch (error) {
      console.log(error)
      alert("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }


// Actual Page

  return (
    <div className="app">

      {/* HEADER IMAGE */}
      <div className="banner">
        <img src={bgImg} className="bannerImage" alt="banner" />
      </div>

      {/* SEARCH */}
      <div className="searchContainer">

        <h2>INPUT CARD NAME</h2>


        <input
          type="text"
          placeholder="Enter a name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch()
          }}
          className="searchInput"
        />

      </div>
        
      <div className="searchNspin">
        {!loading && <button className="searchButton" onClick={handleSearch}>
          Search
        </button>}
        {loading && <div className="spinner"></div>} {/*Spinner*/}
      </div>





      {/* DISPLAY CARDS */}
      <div className="results">

        {result?.data?.map((card: any) => (
          <div key={card.id} className="cardContainer">

            <h3>{card.name}</h3>

            {card.card_faces ? (
              card.card_faces.map((face: any, index: number) => (
                <img
                  key={index}
                  src={face.image_uris.normal}
                  className="cardImage"
                />
              ))
            ) : (
              <img
                src={card.image_uris.normal}
                className="cardImage"
              />
            )}

            <div className="PriceContainer">
              <a
                href={card.purchase_uris?.tcgplayer}
                target="_blank"
                rel="noopener noreferrer"
              >
                {card.prices.usd_foil
                  ? `$${card.prices.usd_foil}`
                  : card.prices.usd
                  ? `$${card.prices.usd}`
                  : 'N/A'}
              </a>
            </div>
          </div>
        ))}

      </div>
    </div>
  )
}

export default App