import { Suspense } from "react";
import { Loader } from "@/components/loader";
import { Calendar } from "./calendrier";

const ThemesPage = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Calendar />;
    </Suspense>
  );
};

export default ThemesPage;
