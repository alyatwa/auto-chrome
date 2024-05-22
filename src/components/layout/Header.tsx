import { useGlobalContext } from "../../store/chromeStore";
import { constants } from "../../utils/constants";
import Button from "../UI/Button";

const Header = () => {
  const { setPage, page } = useGlobalContext();
  return (
    <section className="p-2.5 w-full h-[50px] border-b border-solid border-[#0b2938] bg-white rounded-t-xl">
      <div className="flex flex-row justify-between h-full w-full items-center text-xs text-[#0b2938]">
        {page == "home" ? (
          <div> </div>
        ) : (
          <Button
            onClick={() => setPage("home")}
            variant="rounded"
            style={{ backgroundImage: "url('/images/back.png')" }}
            className="bg-[length:19px_19px] inline-flex justify-center items-center"
          />
        )}
        <Button
          onClick={() => window.open(constants.base_url, "_blank")}
          variant="rounded"
          style={{ backgroundImage: "url('/images/user.png')" }}
          className=" inline-flex justify-center items-center"
        />
      </div>
    </section>
  );
};
export default Header;
