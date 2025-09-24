import { Suspense } from "react";
import { Loader } from "@/components/loader";
import { Statistics } from "./_components/statistics";

const ThemesPage = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Statistics />;
    </Suspense>
  );
};

export default ThemesPage;
