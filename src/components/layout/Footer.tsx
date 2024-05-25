import { useGlobalContext } from "../../store/chromeStore";
import { constants } from "../../utils/constants";

function Footer() {
  const { user, auth } = useGlobalContext();

  return (
    <footer className="p-2.5 w-full h-[50px] border-t border-solid border-[#0b2938] bg-white rounded-b-xl">
      <div className="flex flex-row justify-between h-full w-full items-center text-xs text-[#0b2938]">
        {auth ? (
          <>
            <p className="">User: {user?.name}</p>
            {user?.plan.name == "pro" ? (
              <p className="">Current Plan: {user?.plan.name}</p>
            ) : (
              <a
                href={constants.base_url}
                target="_blank"
                className=" text-[#0b2938]"
              >
                Upgrade
              </a>
            )}{" "}
          </>
        ) : (
          <div className="inline-flex gap-4  ">
            <a
              href={constants.login_url}
              target="_blank"
              className=" text-[#0b2938]"
            >
              Login
            </a>

            <a
              href={constants.register_url}
              target="_blank"
              className=" text-[#0b2938]"
            >
              Register
            </a>
          </div>
        )}
      </div>
    </footer>
  );
}

export default Footer;
