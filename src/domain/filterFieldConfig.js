export const FIELD_CONFIG = [
  {
    key: "drive_thru",
    label: "Drive-Thru Available",
    filterIconKeys: [],
    showInFilter: true,
    showInFeatureModal: true,
    labelKind: "static"
  },
  {
    key: "lunch",
    label: "Open for Lunch",
    filterIconKeys: ["utensils", "clock"],
    showInFilter: true,
    showInFeatureModal: true,
    labelKind: "static"
  },
  {
    key: "homemade_pierogies",
    label: "Homemade Pierogies !!!",
    filterIconKeys: [],
    showInFilter: true,
    showInFeatureModal: true,
    labelKind: "static"
  },
  {
    key: "alcohol",
    label: "Serves Alcohol",
    filterIconKeys: ["beerMugEmpty"],
    showInFilter: true,
    showInFeatureModal: true,
    labelKind: "static"
  },
  {
    key: "take_out",
    label: "Takeout Available",
    filterIconKeys: ["bagShopping"],
    showInFilter: true,
    showInFeatureModal: true,
    labelKind: "static"
  },
  {
    key: "handicap",
    label: "Accessible",
    filterIconKeys: ["wheelchair"],
    showInFilter: true,
    showInFeatureModal: true,
    labelKind: "static"
  },
  {
    key: "AshWednesday",
    label: "Open Ash Wednesday",
    filterIconKeys: ["plus"],
    showInFilter: true,
    showInFeatureModal: true,
    labelKind: "static"
  },
  {
    key: "GoodFriday",
    label: "Open Good Friday",
    filterIconKeys: ["plus"],
    showInFilter: true,
    showInFeatureModal: true,
    labelKind: "static"
  },
  {
    key: "publish",
    label: "Show only those verified for {year}.",
    filterIconKeys: [],
    showInFilter: true,
    showInFeatureModal: false,
    labelKind: "publishYear"
  }
];

export const FILTER_FIELD_CONFIG = FIELD_CONFIG.filter((field) => field.showInFilter);

export const FEATURE_BOOLEAN_FIELD_CONFIG = FIELD_CONFIG.filter((field) => field.showInFeatureModal);

export const FILTER_KEYS = FILTER_FIELD_CONFIG.map((field) => field.key);

export function getFieldLabel(field, options = {}) {
  if (field.labelKind === "publishYear") {
    const year = options.year || new Date().getFullYear();
    return field.label.replace("{year}", `${year}`);
  }

  return field.label;
}
