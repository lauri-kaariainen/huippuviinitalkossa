import { render, Fragment } from "preact";
import {
  useReducer,
  useState,
  useCallback,
  useRef,
  useEffect
} from "preact/hooks";
import { FilterDropdown } from "./components/FilterDropdown.js";
import "./style/style.scss";
const F = Fragment;

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
  const [alkoList, setAlkoList] = useState([]);

  useEffect(
    () =>
      // (fetch("//lauri.space/getbestwinesfromalko/alko/konala")
      //   .then(res => res.json())
      //   .then(json => setFiveStarWines(json)),
      fetch("//lauri.space/getbestwinesfromalko/alko")
        .then(res => res.json())
        .then(json => setAlkoList(json)),
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

  return (
    <div>
      <h1>
        Huippuviinit
        <FilterDropdown
          list={alkoList}
          placeHolder={"valitse alko"}
          onselect={result =>
            fetch(
              "//lauri.space/getbestwinesfromalko/alko/" +
                encodeURIComponent(result)
            )
              .then(res => res.json())
              .then(json => setFiveStarWines(json))
          }
          inputClassName={"alkoinput"}
          ulClassName={""}
          liClassName={"alkoli"}
          clearWord={"Tyhjennä"}
        />
        {/* <input class="alkoinput" value={"Konalassa"} /> */}
      </h1>
      <input
        type="text"
        value={filterText}
        oninput={ev => {
          setFilterText(ev.target.value);
        }}
        placeholder="filter"
        className={"filterinput"}
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
      <Wines />
    </F>
  );
}

if (typeof window !== "undefined") {
  render(<App />, document.getElementById("root"));
}
