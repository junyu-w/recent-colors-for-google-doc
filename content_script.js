const KEY_PREFIX = "google_doc_tab"
const getObjectKey = tabId => `${KEY_PREFIX}:${tabId}`;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case "MESSAGE_TYPE_TAB_STATUS":
      if (message.tabStatus === "complete") {
        insertNewColorSections(message.tabId);
      }
      break;

    default:
      console.error("Invalid message type ", message.type)
      break;
  }
  sendResponse({ status: "DONE" });
})


const ID_RECENT_COLORS_HEADER_FG = "recent-colors-header-fg";
const ID_RECENT_COLORS_HEADER_BG = "recent-colors-header-bg";
const ID_RECENT_COLORS_PALLETE_FG = "recent-colors-pallete-fg";
const ID_RECENT_COLORS_PALLETE_BG = "recent-colors-pallete-bg";
const ID_COLOR_MENU_FG = "fg-color-picker-menu";
const ID_COLOR_MENU_BG = "bg-color-picker-menu";


const insertNewColorSections = tabId => {
  // google doc's color menu items are not static but dynamically appended to DOM upon clicking the color icons
  // therefore only append element when after the first click event
  const textColorButton = document.getElementById("textColorButton");
  const bgColorButton = document.getElementById("bgColorButton");

  textColorButton.addEventListener("click", (element, event) => {
    refreshRecentColorsSection(tabId, true);
  })

  bgColorButton.addEventListener("click", (element, event) => {
    refreshRecentColorsSection(tabId, false);
  })
}

const refreshRecentColorsSection = (tabId, isFg) => {
  const menuId = isFg ? ID_COLOR_MENU_FG : ID_COLOR_MENU_BG;
  let textColorMenu = document.getElementById(menuId);
  if (textColorMenu === null) {
    textColorMenu = getColorPickerMenuAfterFirstClick(isFg);
  }

  const key = getObjectKey(tabId);
  chrome.storage.local.get(key, items => {
    const data = items[key];
    removeRecentColorsSection(isFg);
    insertRecentColorsSectionIntoMenu(textColorMenu, isFg ? data.recentColorsFg : data.recentColorsBg, isFg);
  })
}

const getColorPickerMenuAfterFirstClick = (isFg) => {
  const colorPickerMenus = document.getElementsByClassName("docs-colormenuitems");
  if (colorPickerMenus.length === 0) {
    console.log("Color picker menus still haven't been populated")
    return;
  }
  const colorMenu = colorPickerMenus.length === 1 ? colorPickerMenus[0] : colorPickerMenus[1];
  
  // mark the menu for future retrieval
  const menuId = isFg ? ID_COLOR_MENU_FG : ID_COLOR_MENU_BG;
  colorMenu.setAttribute("id", menuId);

  return colorMenu;
}

const removeRecentColorsSection = (isFg) => {
  let header;
  let pallete;
  if (isFg) {
    header = document.getElementById(ID_RECENT_COLORS_HEADER_FG);
    pallete = document.getElementById(ID_RECENT_COLORS_PALLETE_FG);
  } else {
    header = document.getElementById(ID_RECENT_COLORS_HEADER_BG);
    pallete = document.getElementById(ID_RECENT_COLORS_PALLETE_BG);
  }

  if (header != null) {
    header.remove();
  }
  if (pallete != null) {
    pallete.remove();
  }
}

const insertRecentColorsSectionIntoMenu = (colorMenu, recentColors, isFg) => {
  const firstChild = colorMenu.firstChild;

  // insert header section
  const headerElement = document.createElement("div");
  headerElement.setAttribute("class","goog-menuitem colormenuitems-custom-header-add-button");
  headerElement.setAttribute("id", isFg ? ID_RECENT_COLORS_HEADER_FG : ID_RECENT_COLORS_HEADER_BG);
  
  const innert = document.createElement("div");
  innert.setAttribute("class", "goog-menuitem-content");

  const title = document.createElement("div");
  title.setAttribute("class", "docs-colormenuitems-custom-header");
  title.textContent = "RECENT COLORS (HOVER ONLY)";

  headerElement.appendChild(innert);
  innert.appendChild(title);
  colorMenu.insertBefore(headerElement, firstChild);

  // insert color cells section
  const palleteElement = document.createElement("div");
  palleteElement.setAttribute("class", "docs-material-colorpalette docs-colormenuitems-custom-palette");
  palleteElement.setAttribute("id", isFg ? ID_RECENT_COLORS_PALLETE_FG : ID_RECENT_COLORS_PALLETE_BG);

  const innerTable = document.createElement("table");
  innerTable.setAttribute("class", "docs-material-colorpalette-table");
  innerTable.setAttribute("role", "grid");
  innerTable.setAttribute("cellspacing", "0");
  innerTable.setAttribute("cellpadding", "0");

  const tbody = document.createElement("tbody");
  tbody.setAttribute("class", "docs-material-colorpalette-body");

  const row = document.createElement("tr");
  row.setAttribute("class", "docs-material-colorpalette-row");
  row.setAttribute("role", "row");

  palleteElement.appendChild(innerTable);
  innerTable.appendChild(tbody);
  tbody.appendChild(row);

  for (let i = 0; i < recentColors.length; i++) {
    const hexColor = recentColors[i];
    const rgbColor = `rgb(${hexColorToRgb(hexColor).join(", ")})`;

    const cell = document.createElement("td");
    cell.setAttribute("class", "docs-material-colorpalette-cell");
    cell.setAttribute("id", `docs-material-colorpalette-cell-${i}`);
    cell.setAttribute("role", "gridcell");

    cell.addEventListener("mouseenter", (el, event) => {
      cell.setAttribute("class", "docs-material-colorpalette-cell goog-control-hover docs-material-colorpalette-cell-hover");
      toggleHighlightMatchingColorCell(colorMenu, rgbColor, "on");
    })
    cell.addEventListener("mouseleave", (el, event) => {
      cell.setAttribute("class", "docs-material-colorpalette-cell");
      toggleHighlightMatchingColorCell(colorMenu, rgbColor, "off");
    })

    const color = document.createElement("div");
    color.setAttribute("class", "docs-material-colorpalette-colorswatch docs-material-colorpalette-colorswatch-border docs-material-colorpalette-colorswatch-dark");
    color.setAttribute("style", `background-color: ${hexColor}`);
    color.setAttribute("title", `Recent color ${hexColor}`);

    color.addEventListener("click", (el, event) => {
      const matchingColorEl = colorMenu.querySelector(`[style=\"background-color: ${rgbColor}; user-select: none;\"]`);
    })  

    cell.appendChild(color);
    row.appendChild(cell);
  }

  colorMenu.insertBefore(palleteElement, firstChild);
}

/**
 * Toggle to highlight the matching color cell with a pacman animation
 */
const toggleHighlightMatchingColorCell = (colorMenu, rgbColor, toggleOnOrOff) => {
  const matchingColorEl = colorMenu.querySelector(`[style=\"background-color: ${rgbColor}; user-select: none;\"]`);
  const classList = matchingColorEl.getAttribute("class").split(" ");
  
  // TODO: dynamically set pacman mouth background color based on the cell color
  const selectedCls = "pacman";

  if (toggleOnOrOff === "on") {
    if (!classList.includes(selectedCls)) {
      classList.push(selectedCls);

      const pacmanMouth = document.createElement("div");
      pacmanMouth.setAttribute("class", "pacman-mouth");
      matchingColorEl.appendChild(pacmanMouth);
    }
  } else if (toggleOnOrOff === "off") {
    if (classList.includes(selectedCls)) {
      classList.splice(classList.indexOf(selectedCls), 1);

      const pacmanMouthEl = document.getElementsByClassName("pacman-mouth")[0];
      pacmanMouthEl.remove();
    }
  }

  matchingColorEl.setAttribute("class", classList.join(" "));
}

const hexColorToRgb = (hexColor) => {
  if (hexColor.length != 7) {
    return null;
  }
  const colorDigits = hexColor.slice(1, hexColor.length);

  var aRgbHex = colorDigits.match(/.{1,2}/g);
  var aRgb = [
    parseInt(aRgbHex[0], 16),
    parseInt(aRgbHex[1], 16),
    parseInt(aRgbHex[2], 16)
  ];
  return aRgb;
}
