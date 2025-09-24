import { Suspense } from "react";
import { Loader } from "../_components/loader";

import Salle from "./salle";

const EnsPage = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Salle />;
    </Suspense>
  );
};

export default EnsPage;
