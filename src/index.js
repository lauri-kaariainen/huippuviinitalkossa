// Must be the first import
if (process.env.NODE_ENV === "development") {
  // Must use require here as import statements are only allowed
  // to exist at top-level.
  require("preact/debug");
}
import { render, Fragment } from "preact";
import {
  // useReducer,
  useState,
  // useCallback,
  // useRef,
  useEffect
} from "preact/hooks";
import { FilterDropdown } from "./components/FilterDropdown.js";
import { Wine } from "./components/Wine";
import "./style/style.scss";
const F = Fragment;

const orderWines = (wines) =>
  wines.slice().sort((a, b) => (a.Nimi > b.Nimi ? 1 : -1));

function Wines() {
  const [orderByPrice, setOrderByPrice] = useState(true);
  const [showFourStarsWines, setShowFourStarsWines] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [fiveStarWines, setFiveStarWines] = useState([]);
  const [fourStarWines, setFourStarWines] = useState([]);
  // const [currentName, setCurrentName] = useState("");
  const [alkoList, setAlkoList] = useState([]);
  const [currentAlko, setCurrentAlko] = useState("");
  const [scrollPos, setScrollPos] = useState(0);
  const [visibleDrinkType, setVisibleDrinkType] = useState("all");
  const [lastClickedWine, setLastClickedWine] = useState("");
  const [winesWithDetailsVisible, setWinesWithDetailsVisible] = useState([]);

  const persistState = (wineNum) =>
    sessionStorage.setItem(
      "state",
      JSON.stringify({
        orderByPrice,
        showFourStarsWines,
        filterText,
        fiveStarWines,
        fourStarWines,
        currentAlko,
        alkoList,
        scrollPos: parseInt(-document.body.getBoundingClientRect().y),
        visibleDrinkType: visibleDrinkType,
        lastClickedWine: wineNum,
        winesWithDetailsVisible
      })
    );
  const loadState = (_) => {
    try {
      const loadedState = JSON.parse(sessionStorage.getItem("state"));

      setOrderByPrice(loadedState.orderByPrice);
      setShowFourStarsWines(loadedState.showFourStarsWines);
      setFilterText(loadedState.filterText);
      setFiveStarWines(loadedState.fiveStarWines);
      setFourStarWines(loadedState.fourStarWines);
      setCurrentAlko(loadedState.currentAlko);
      setAlkoList(loadedState.alkoList);
      setScrollPos(loadedState.scrollPos);
      setVisibleDrinkType(loadedState.visibleDrinkType);
      setLastClickedWine(loadedState.lastClickedWine);
      setWinesWithDetailsVisible(loadedState.winesWithDetailsVisible);
      return true;
    } catch (e) {
      console.log(
        "error loading persisted state, fresh loading probably happened"
      );
      return false;
    }
  };

  useEffect(() => {
    console.log("use-effect run");
    if (alkoList.length) {
      console.log("running scrollPos and returning from use-effect");
      // window.scroll(0, scrollPos)
      window.location.hash = lastClickedWine;
      return;
    }
    if (!loadState()) {
      fetch("//lauri.space/getbestwinesfromalko/alko")
        .then((res) => res.json())
        .then((json) => setAlkoList(json));
      console.log("fresh load");
    } else {
      console.log("state loaded from sessionstorage");
    }
  }, [lastClickedWine]);

  // useEffect(
  //   () =>
  //     fetch("//lauri.space/getbestwinesfromalko/alko")
  //       .then((res) => res.json())
  //       .then((json) => setAlkoList(json)),
  //   []
  // );

  const fetchFiveStarWines = (alkoName) =>
    fetch(
      "//lauri.space/getbestwinesfromalko/alko/" + encodeURIComponent(alkoName)
    )
      .then((res) => res.json())
      .then((json) => setFiveStarWines(json));

  const fetchFourStarWines = (alkoName) =>
    fetch(
      "//lauri.space/getbestwinesfromalko/alko/fourstars/" +
        encodeURIComponent(alkoName)
    )
      .then((res) => res.json())
      .then((json) => setFourStarWines(json));

  const wineFilter = (filterText, wine) => {
    //console.log(wine);
    return filterText.length
      ? wine.Nimi.toLowerCase().includes(filterText.toLowerCase()) ||
          (!wine.Luonnehdinta
            ? false
            : wine.Luonnehdinta.toLowerCase().includes(
                filterText.toLowerCase()
              )) ||
          wine.Pakkaustyyppi.toLowerCase().includes(filterText.toLowerCase()) ||
          wine.Tyyppi.toLowerCase().includes(filterText.toLowerCase())
      : true;
  };

  const orderedWines = showFourStarsWines
    ? orderWines(fiveStarWines.concat(fourStarWines))
    : orderWines(fiveStarWines);

  return (
    <div>
      <h1>Huippuviinit</h1>
      <FilterDropdown
        list={alkoList}
        placeholder={"valitse alko"}
        initialValue={currentAlko}
        onselect={(name) => {
          setCurrentAlko(name);
          fetchFiveStarWines(name);
          if (showFourStarsWines) fetchFourStarWines(name);
          setWinesWithDetailsVisible([]);
        }}
        containerClassName={"alkoinputcontainer"}
        inputClassName={"alkoinput"}
        ulClassName={""}
        liClassName={"alkoli"}
      />
      {/* <input class="alkoinput" value={"Konalassa"} /> */}
      <input
        type="text"
        value={filterText}
        oninput={(ev) => {
          setFilterText(ev.target.value);
        }}
        placeholder="filter"
        className={"filterinput"}
      />
      <span class="filterLineText">Järjestä:</span>
      <button
        className={"filterButton" + (orderByPrice ? " active" : "")}
        onclick={(_) => setOrderByPrice(!orderByPrice)}
      >
        {orderByPrice ? <span>€</span> : <span>abc</span>}
      </button>
      <button
        className={
          "filterButton filterButtonStars" +
          (showFourStarsWines ? " active" : "")
        }
        onclick={(_) => {
          if (!showFourStarsWines) fetchFourStarWines(currentAlko);
          setShowFourStarsWines(!showFourStarsWines);
        }}
      >
        {showFourStarsWines ? <span>5 & 4</span> : <span>5</span>}
        <span aria-label="stars" role="img">
          ⭐
        </span>
      </button>
      <button
        className={
          "filterButton filterButtonStars" +
          (visibleDrinkType === "all" ? " active" : "")
        }
        onclick={(_) => {
          if (visibleDrinkType === "all") setVisibleDrinkType("wines");
          else if (visibleDrinkType === "wines")
            setVisibleDrinkType("sparkling");
          else setVisibleDrinkType("all");
        }}
      >
        {visibleDrinkType === "all" ? (
          <span>🍷🍾</span>
        ) : visibleDrinkType === "wines" ? (
          <span>🍷</span>
        ) : (
          <span>🍾</span>
        )}
      </button>
      {(orderByPrice
        ? orderedWines
            .slice()
            .sort((a, b) => parseFloat(a.Litrahinta) - parseFloat(b.Litrahinta))
        : orderedWines
      )
        .filter(wineFilter.bind(null, filterText))
        .filter((wine) =>
          visibleDrinkType === "all"
            ? true
            : visibleDrinkType === "sparkling"
            ? wine.Tyyppi.match(/kuohu/i)
            : wine.Tyyppi.match(/puna/i) || wine.Tyyppi.match(/valko/i)
        )
        .map((wine) => (
          <Wine
            starAmount={wine.Stars}
            wine={wine}
            key={wine.Numero}
            detailsVisible={
              !!(winesWithDetailsVisible.indexOf(wine.Numero) !== -1)
            }
            alkoLinkOnClick={(_) => persistState(wine.Numero)}
            onClick={(_) =>
              winesWithDetailsVisible.indexOf(wine.Numero) !== -1
                ? setWinesWithDetailsVisible(
                    winesWithDetailsVisible.filter((num) => num !== wine.Numero)
                  )
                : setWinesWithDetailsVisible(
                    winesWithDetailsVisible.concat(wine.Numero)
                  )
            }
          />
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
