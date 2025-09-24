import { Suspense } from "react";
import { Loader } from "../_components/loader";

import Etudiant from "./etudiant";

const EtudiantPage = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Etudiant />;
    </Suspense>
  );
};

export default EtudiantPage;
