import { Suspense } from "react";
import { Loader } from "../_components/loader";

import Enseignant from "./enseignant";

const EnsPage = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Enseignant />;
    </Suspense>
  );
};

export default EnsPage;
