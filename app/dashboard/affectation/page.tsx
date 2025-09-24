import { Suspense } from "react";
import { Loader } from "../_components/loader";
import { Affectation } from "./affectation";

const AffectationPage = () => {
  return (
    <Suspense fallback={<Loader />}>
      <main className="w-full max-h-screen p-4">
        <Affectation />
      </main>
    </Suspense>
  );
};

export default AffectationPage;
