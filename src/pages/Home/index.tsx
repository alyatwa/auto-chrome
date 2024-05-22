import { useApps } from "../../hooks/useApps";

const Home = () => {
  const { apps } = useApps();
  return (
    <div className="flex flex-col gap-6 justify-center items-center w-full h-full">
      <div className="grid grid-cols-2 justify-center gap-6">
        {apps.map((app) => (
          <div
            key={app.name}
            onClick={app.disabled ? () => null : () => app.handleClick()}
            className={`flex flex-col gap-2 items-center cursor-pointer select-none ${
              app.disabled ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            {" "}
            <div className="inline-flex justify-center items-center bg-[#eafe63] w-20 h-20 rounded-xl">
              <img src={app.img} alt={app.label} className="w-10 h-10" />
            </div>
            <span className="text-[#0b2938] text-xs">{app.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
