import { render, Fragment } from "preact";
import {
  useReducer,
  useState,
  useCallback,
  useRef,
  useEffect
} from "preact/hooks";
import "./style/style.scss";
// import fiveStarWines from "./konala5starwines.json";
// import fourStarWines from "./konala4starwines.json";

const F = Fragment;

// const orderedFourStarWines = fourStarWines
//   .slice()
//   .sort((a, b) => (a[1] > b[1] ? 1 : -1));

`EurPerLAlkohol: 0
Hinta: 39.99
Litrahinta: 53.19
Luonnehdinta: "Corvina, Rondinella, Molinara,"
Nimi: "Masi Costasera Amarone Classico 2015"
Numero: 455887
Pakkaustyyppi: "Täyteläinen, tanniininen, viikunainen, karhunvatukkainen, herukkainen, mustapippurinen, hennon kanelinen, kevyen nahkainen, yrttinen"
ProsAlkohol: "luonnonkorkki"
Pullokoko: 0.75
Tyyppi: "punaviinit"`;
` [
  0"448847",
  1"Domaine Bousquet Ameri Single Vineyard 2015",
  2"0.75",
  3"32.90",
  4"43.73", 
  5"punaviinit",
  6"Malbec, Cabernet Sauvignon, Syrah, Merlot, ",
  7"Täyteläinen, tanniininen, tumman kirsikkainen, karpaloinen, tummasuklainen, mustapippurinen, tamminen, tasapainoinen",
  8"luonnonkorkki",
  "0"
],`;
const NameButton = ({ id, name }) => (
  <button
    class="wineName"
    onclick={() => (window.location = "https://alko.fi/tuotteet/" + id)}
  >
    {name}
  </button>
);

const Wine = ({ wine, starAmount }) => (
  <div
    className={
      (starAmount === 5 ? "fiveStars" : "fourStars") + " wine " + wine.Tyyppi
    }
    key={wine.Numero}
  >
    <NameButton name={wine.Nimi} id={wine.Numero} />
    <br />
    <span className={wine.Tyyppi} />
    {starAmount !== 5 ? <F /> : <span class="fiveStarsSpan" />}
    <span class="price">{wine.Hinta}€</span>
    <span class="italic">{wine.Luonnehdinta ? wine.Luonnehdinta : ""}</span>
    {wine.Pakkaustyyppi}
  </div>
);

function Wines() {
  const [orderByPrice, setOrderByPrice] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [fiveStarWines, setFiveStarWines] = useState([]);

  useEffect(
    () =>
      fetch("//lauri.space/getbestwinesfromalko/alko/konala")
        .then(res => res.json())
        .then(json => setFiveStarWines(json)),
    []
  );

  const orderedFiveStarWines = fiveStarWines
    .slice()
    .sort((a, b) => (a.Nimi > b.Nimi ? 1 : -1));

  const wineFilter = (filterText, wine) =>
    filterText.length
      ? wine.Nimi.toLowerCase().includes(filterText.toLowerCase()) ||
        (!wine.Luonnehdinta
          ? false
          : wine.Luonnehdinta.toLowerCase().includes(
              filterText.toLowerCase()
            )) ||
        wine.Pakkaustyyppi.toLowerCase().includes(filterText.toLowerCase()) ||
        wine.ProsAlkohol.toLowerCase().includes(filterText.toLowerCase())
      : true;

  useEffect(() => {
    // Update the document title using the browser API
    document.title = `5 Star Wines`;
  });

  return (
    <div>
      <input
        type="text"
        value={filterText}
        oninput={ev => {
          setFilterText(ev.target.value);
        }}
        placeholder="filter"
      />
      <span>Järjestä:</span>
      <button
        className={"filterButton" + (orderByPrice ? " active" : "")}
        onclick={_ => setOrderByPrice(!orderByPrice)}
      >
        €
      </button>
      {(orderByPrice
        ? orderedFiveStarWines
            .slice()
            .sort((a, b) => parseFloat(a.Litrahinta) - parseFloat(b.Litrahinta))
        : orderedFiveStarWines
      )
        .filter(wineFilter.bind(null, filterText))
        .map(wine => (
          <Wine starAmount={5} wine={wine} />
        ))}
    </div>
  );
}

function App() {
  return (
    <F>
      <h1>Huippuviinit Konalassa</h1>
      <Wines />
    </F>
  );
}

if (typeof window !== "undefined") {
  render(<App />, document.getElementById("root"));
}
