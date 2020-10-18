import { useState, useEffect } from "preact/hooks";

const NameLink = ({ id, name, onClick }) => (
  <a
    class="wineName button"
    // target={"_blank"}
    href={"https://alko.fi/tuotteet/" + id}
    onClick={onClick}
  >
    {name}
  </a>
);

const Details = ({ id, name }) => {
  const [detailsData, setDetailsData] = useState(null);

  useEffect(
    (_) =>
      detailsData
        ? false
        : fetch("https://lauri.space/alko-product-api/products/" + id)
            .then((e) => e.json())
            .then((json) => setDetailsData(json.data)),
    [id, detailsData]
  );

  return (
    <div class="wineDetails">
      <img
        alt={name}
        src={
          "https://images.alko.fi/images/cs_srgb,f_auto,t_products/cdn/" +
          id +
          "/a.jpg"
        }
      />
      {detailsData && detailsData.attributes ? (
        <span>
          <span>{detailsData.attributes.country}</span>
          <br />
          <span>{detailsData.attributes.grapes}</span>
          <br />
          <span>{detailsData.attributes.closure}</span>
          <br />
          <span>{detailsData.attributes.size}l</span>
          <br />
        </span>
      ) : (
        <span>Ei tietoja saatavilla</span>
      )}
    </div>
  );
};

export const Wine = ({
  wine,
  starAmount,
  onClick,
  detailsVisible,
  alkoLinkOnClick
}) => {
  // const [detailsVisible, setDetailsVisible] = useState(false);

  return (
    <div
      id={wine.Numero}
      className={
        (starAmount === 5 ? "fiveStars" : "fourStars") + " wine " + wine.Tyyppi
      }
      key={wine.Numero}
    >
      <NameLink name={wine.Nimi} id={wine.Numero} onClick={alkoLinkOnClick} />
      <br />
      <span className={wine.Tyyppi} />
      {starAmount !== 5 ? <span /> : <span class="fiveStarsSpan" />}
      <span class="price">{wine.Hinta}€</span>
      <span onClick={onClick} class="italic">
        {wine.Luonnehdinta ? wine.Luonnehdinta : ""}
      </span>
      {detailsVisible ? <span /> : <span>(...)</span>}
      {detailsVisible ? (
        <Details id={wine.Numero} name={wine.Nimi} />
      ) : (
        <span />
      )}
      {/* {wine.Pakkaustyyppi} */}
    </div>
  );
};
