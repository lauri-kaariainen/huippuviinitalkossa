const NameLink = ({id, name, onClick}) => (
  <a
    class="wineName button"
    // target={"_blank"}
    href={"https://alko.fi/tuotteet/" + id}
    onClick={onClick}
  >
    {name}
  </a>
);

export const Wine = ({wine, starAmount, onClick}) => (
  <div
    id={wine.Numero}
    className={
      (starAmount === 5 ? "fiveStars" : "fourStars") + " wine " + wine.Tyyppi
    }
    key={wine.Numero}
  >
    <NameLink name={wine.Nimi} id={wine.Numero} onClick={onClick} />
    <br />
    <span className={wine.Tyyppi} />
    {starAmount !== 5 ? <span /> : <span class="fiveStarsSpan" />}
    <span class="price">{wine.Hinta}€</span>
    <span class="italic">{wine.Luonnehdinta ? wine.Luonnehdinta : ""}</span>
    {/* {wine.Pakkaustyyppi} */}
  </div>
);
