import { NavLink } from "react-router-dom";

const OutletLink = ({ path, type, linkId, name, index, className }) => {
  return (
    <NavLink
      to={{ pathname: `${path}/${linkId}` }}
      state={{ id: linkId.toString(), name: name, type: type }}
      className={`outlet-link outlet ${className}`}
      id={"link-" + index}
      key={"link-" + index}
      style={{ textDecoration: "none" }}
    >
      {name}
    </NavLink>
  );
};

export default OutletLink;
