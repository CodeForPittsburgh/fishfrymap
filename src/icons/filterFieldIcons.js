import {
  faBagShopping,
  faBeerMugEmpty,
  faChurch,
  faClock,
  faUtensils,
  faWheelchair,
  faKitchenSet,
  faFire,
  faCar
} from "@fortawesome/free-solid-svg-icons";

export const FILTER_FIELD_ICON_LOOKUP = {
  bagShopping: faBagShopping,
  beerMugEmpty: faBeerMugEmpty,
  church: faChurch,
  clock: faClock,
  utensils: faUtensils,
  wheelchair: faWheelchair,
  kitchenSet: faKitchenSet,
  fire: faFire,
  car: faCar
};

export function getFilterFieldIcon(iconKey) {
  return FILTER_FIELD_ICON_LOOKUP[iconKey] || null;
}

export function getPrimaryFilterFieldIcon(field) {
  if (!field?.filterIconKeys?.length) {
    return null;
  }

  return getFilterFieldIcon(field.filterIconKeys[0]);
}
