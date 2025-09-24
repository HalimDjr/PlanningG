import { ClipLoader } from "react-spinners";

export const Loader = () => {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <ClipLoader
        size={30}
        className="text-primary_purpule flex justify-center items-center w-full h-full"
      />
    </div>
  );
};
