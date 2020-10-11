const NameLink = ({ id, name }) => (
  <a
    class="wineName button"
    target={"_blank"}
    href={"https://alko.fi/tuotteet/" + id}
  >
    {name}
  </a>
);

export const Wine = ({ wine, starAmount }) => (
  <div
    className={
      (starAmount === 5 ? "fiveStars" : "fourStars") + " wine " + wine.Tyyppi
    }
    key={wine.Numero}
  >
    <NameLink name={wine.Nimi} id={wine.Numero} />
    <br />
    <span className={wine.Tyyppi} />
    {starAmount !== 5 ? <span /> : <span class="fiveStarsSpan" />}
    <span class="price">{wine.Hinta}€</span>
    <span class="italic">{wine.Luonnehdinta ? wine.Luonnehdinta : ""}</span>
    {/* {wine.Pakkaustyyppi} */}
  </div>
);
