import { Suspense } from "react";
import { Loader } from "../_components/loader";

import Binomes from "./binome";

const BinomePage = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Binomes />;
    </Suspense>
  );
};

export default BinomePage;
