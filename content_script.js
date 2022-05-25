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
  if (textColorMenu == null) {
    textColorMenu = getColorPickerMenuAfterFirstClick(isFg);
  }

  const key = getObjectKey(tabId);
  chrome.storage.local.get(key, items => {
    const data = items[key];
    removeRecentColorsSection(textColorMenu, isFg);
    insertRecentColorsSectionIntoMenu(textColorMenu, isFg ? data.recentColorsFg : data.recentColorsBg, isFg);
  })
}

const getColorPickerMenuAfterFirstClick = (isFg) => {
  const colorPickerMenus = document.getElementsByClassName("docs-colormenuitems");
  if (colorPickerMenus.length == 0) {
    console.log("Color picker menus still haven't been populated")
    return;
  }
  const colorMenu = colorPickerMenus.length == 1 ? colorPickerMenus[0] : colorPickerMenus[1];
  
  // mark the menu for future retrieval
  const menuId = isFg ? ID_COLOR_MENU_FG : ID_COLOR_MENU_BG;
  colorMenu.setAttribute("id", menuId);

  return colorMenu;
}

const removeRecentColorsSection = (colorMenu, isFg) => {
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
  title.textContent = "RECENT COLORS";

  headerElement.appendChild(innert);
  innert.appendChild(title);
  colorMenu.insertBefore(headerElement, firstChild);

  // insert color cells section
  const palleteElement = document.createElement("div");
  palleteElement.setAttribute("class", "docs-material-colorpalette docs-colormenuitems-custom-palette");
  palleteElement.setAttribute("id", isFg ? ID_RECENT_COLORS_PALLETE_FG : ID_RECENT_COLORS_PALLETE_BG);

  const innerTable = document.createElement("table");
  innerTable.setAttribute("class", "docs-material-colorpalette-table");
  innerTable.setAttribute("roleclass", "grid");
  innerTable.setAttribute("cellspacingclass", "0");
  innerTable.setAttribute("cellpaddingclass", "0");

  const tbody = document.createElement("tbody");
  tbody.setAttribute("class", "docs-material-colorpalette-body");

  const row = document.createElement("tr");
  row.setAttribute("class", "docs-material-colorpalette-row");
  row.setAttribute("role", "row");

  palleteElement.appendChild(innerTable);
  innerTable.appendChild(tbody);
  tbody.appendChild(row);

  for (let i = 0; i < recentColors.length; i++) {
    const cell = document.createElement("td");
    cell.setAttribute("class", "docs-material-colorpalette-cell");
    cell.setAttribute("id", `docs-material-colorpalette-cell-${i}`);
    cell.setAttribute("role", "gridcell");

    const color = document.createElement("div");
    color.setAttribute("class", "docs-material-colorpalette-colorswatch docs-material-colorpalette-colorswatch-dark");
    color.setAttribute("style", `background-color: ${recentColors[i]}`);

    cell.appendChild(color);
    row.appendChild(cell);
  }

  colorMenu.insertBefore(palleteElement, firstChild);
}

  