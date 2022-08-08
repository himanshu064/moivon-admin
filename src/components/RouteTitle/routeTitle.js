import { Helmet } from "react-helmet";

function RouteTitle({ title }) {
  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  );
}
export default RouteTitle;
