import Image from "next/image";
interface NotFoundProps {
  header: string;
  paragraph: string;
  src?: string;
}

export const NothingFound = ({ header, paragraph, src }: NotFoundProps) => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center ">
      <Image
        src={src || "/search-magnifying.png"}
        height={130}
        width={130}
        alt="nothing-found"
      />
      <h1 className="text-xl md:text-xl text-foreground font-bold p-2">
        {header}
      </h1>
      <p className=" text-muted-foreground">{paragraph}</p>
    </div>
  );
};
