import { TailSpin } from "react-loader-spinner";
const Loader = ({ text }) => {
  return (
    <div className="flex flex-col justify-center items-center gap-5 h-[calc(100vh-400px)]">
      <div>Loader{text}</div>
      <TailSpin height={80} width={80} radius={1} color={"#3861fb"} />
    </div>
  );
};

export default Loader;
