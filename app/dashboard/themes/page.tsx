import { Suspense } from "react";
import { Loader } from "../_components/loader";
import { Themes } from "./themes";

const ThemesPage = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Themes />;
    </Suspense>
  );
};

export default ThemesPage;
