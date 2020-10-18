import { useState, useRef } from "preact/hooks";

import "../style/filterdropdown.scss";

export const FilterDropdown = ({
  list,
  placeholder,
  onselect,
  containerClassName,
  inputClassName,
  ulClassName,
  liClassName
}) => {
  const [inputStr, setInputStr] = useState("");

  const [dropDownHidden, setDropDownHidden] = useState(true);
  const inputRef = useRef(null);

  const onFilterInput = (str) => setInputStr(str);

  const visibleList = list.filter((item) =>
    item.toLowerCase().includes(inputStr.toLowerCase())
  );

  return (
    <div
      className={
        (containerClassName ? containerClassName + " " : "") +
        " dropdown_container"
      }
    >
      <input
        ref={inputRef}
        className={
          "chosen-value" +
          // (dropDownHidden ? " notselectable" : "") +
          (inputClassName ? " " + inputClassName : "")
        }
        oninput={(evt) => onFilterInput(evt.target.value)}
        type="text"
        value={inputStr}
        onclick={(evt) => {
          dropDownHidden ? false : inputRef.current.blur();
          setDropDownHidden(!dropDownHidden);
        }}
        placeholder={
          placeholder === undefined ? "Filter and select" : placeholder
        }
      />
      {inputStr ? (
        <button
          class="clearbutton chosen-value"
          onclick={(_) => (
            setInputStr(""), setDropDownHidden(false), inputRef.current.focus()
          )}
        >
          ⌫
        </button>
      ) : (
        false
      )}
      <ul
        className={
          "value-list" +
          (!dropDownHidden ? " open" : "") +
          (ulClassName ? " " + ulClassName : "")
        }
      >
        {visibleList.map((el) => (
          <li
            className={liClassName ? liClassName : ""}
            key={el}
            onclick={(_) => {
              onselect(el);
              setInputStr(el);
              setDropDownHidden(true);
            }}
          >
            {el}
          </li>
        ))}
      </ul>
    </div>
  );
};
