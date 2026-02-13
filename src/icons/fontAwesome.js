import { icon } from "@fortawesome/fontawesome-svg-core";
import {
  faBagShopping,
  faBars,
  faBeerMugEmpty,
  faCheck,
  faChevronLeft,
  faChevronRight,
  faCircleExclamation,
  faCircleQuestion,
  faClock,
  faCode,
  faDatabase,
  faEnvelope,
  faFilter,
  faLocationArrow,
  faMagnifyingGlass,
  faMinus,
  faPlus,
  faQuestion,
  faSpinner,
  faUpDownLeftRight,
  faUtensils,
  faWheelchair,
  faXmark
} from "@fortawesome/free-solid-svg-icons";

export {
  faBagShopping,
  faBars,
  faBeerMugEmpty,
  faCheck,
  faChevronLeft,
  faChevronRight,
  faCircleExclamation,
  faCircleQuestion,
  faClock,
  faCode,
  faDatabase,
  faEnvelope,
  faFilter,
  faLocationArrow,
  faMagnifyingGlass,
  faMinus,
  faPlus,
  faQuestion,
  faSpinner,
  faUpDownLeftRight,
  faUtensils,
  faWheelchair,
  faXmark
};

export function iconHtml(iconDefinition, options = {}) {
  return icon(iconDefinition, options).html.join("");
}
