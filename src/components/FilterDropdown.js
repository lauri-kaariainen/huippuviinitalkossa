import { useState, useRef } from "preact/hooks";

import "../style/filterdropdown.scss";

export const FilterDropdown = ({
  list,
  placeHolder,
  onselect,
  inputClassName,
  ulClassName,
  liClassName,
  clearWord
}) => {
  const [inputStr, setInputStr] = useState("");

  const [dropDownHidden, setDropDownHidden] = useState(true);
  const inputRef = useRef(null);

  const onFilterInput = str => setInputStr(str);

  const visibleList = list.filter(item =>
    item.toLowerCase().includes(inputStr.toLowerCase())
  );

  return (
    <div class="dropdown_container">
      <input
        ref={inputRef}
        className={
          "chosen-value" +
          // (dropDownHidden ? " notselectable" : "") +
          (inputClassName ? " " + inputClassName : "")
        }
        oninput={evt => onFilterInput(evt.target.value)}
        type="text"
        value={inputStr}
        onclick={evt => {
          dropDownHidden ? false : inputRef.current.blur();
          setDropDownHidden(!dropDownHidden);
        }}
        placeholder={
          placeHolder === undefined ? "Filter and select" : placeHolder
        }
      />
      <ul
        className={
          "value-list" +
          (!dropDownHidden ? " open" : "") +
          (ulClassName ? " " + ulClassName : "")
        }
      >
        {[clearWord].concat(visibleList).map(el => (
          <li
            className={liClassName ? liClassName : ""}
            key={el}
            onclick={_ => {
              if (el === clearWord) {
                setInputStr("");
                inputRef.current.focus();
              } else {
                onselect(el);
                setInputStr(el);
                setDropDownHidden(true);
              }
            }}
          >
            {el}
          </li>
        ))}
      </ul>
    </div>
  );
};
