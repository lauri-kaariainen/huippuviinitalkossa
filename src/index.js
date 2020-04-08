import { render, Fragment } from "preact";
import {
  useReducer,
  useState,
  useCallback,
  useRef,
  useEffect
} from "preact/hooks";
import "./style/style.scss";
import fiveStarWines from "./konala5starwines.json";
import fourStarWines from "./konala4starwines.json";

const F = Fragment;

const orderedFiveStarWines = fiveStarWines
  .slice()
  .sort((a, b) => (a[1] > b[1] ? 1 : -1));
const orderedFourStarWines = fourStarWines
  .slice()
  .sort((a, b) => (a[1] > b[1] ? 1 : -1));

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
      (starAmount === 5 ? "fiveStars" : "fourStars") + " wine " + wine[5]
    }
    key={wine[0]}
  >
    <NameButton name={wine[1]} id={wine[0]} />
    <br />
    <span className={wine[5]} />
    {starAmount !== 5 ? <F /> : <span class="fiveStarsSpan" />}
    <span class="price">{wine[3]}€</span>
    {wine[6] + " " + wine[7]}
  </div>
);

function Wines() {
  const [orderByPrice, setOrderByPrice] = useState(false);
  const [filterText, setFilterText] = useState("");

  const wineFilter = (filterText, wine) =>
    filterText.length
      ? wine[1].toLowerCase().includes(filterText.toLowerCase()) ||
        wine[6].toLowerCase().includes(filterText.toLowerCase()) ||
        wine[7].toLowerCase().includes(filterText.toLowerCase()) ||
        wine[8].toLowerCase().includes(filterText.toLowerCase())
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
            .sort((a, b) => parseFloat(a[4]) - parseFloat(b[4]))
        : orderedFiveStarWines
      )
        .filter(wineFilter.bind(null, filterText))
        .map(wine => (
          <Wine starAmount={5} wine={wine} />
        ))}
      {(orderByPrice
        ? orderedFourStarWines
            .slice()
            .sort((a, b) => parseFloat(a[4]) - parseFloat(b[4]))
        : orderedFourStarWines
      )
        .filter(wineFilter.bind(null, filterText))
        .map(wine => (
          <Wine starAmount={4} wine={wine} />
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
