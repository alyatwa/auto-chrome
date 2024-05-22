import { forwardRef } from "react";

type Ref = HTMLButtonElement;
export type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const BackButton = forwardRef<Ref, ButtonProps>((props, ref) => {
  const { className, children, ...rest } = props;

  return (
    <button
      ref={ref}
      {...rest}
      className="absolute z-20 flex justify-center top-6 left-6 hover:none bg-[#eafe62] w-[40px] h-[40px] rounded-full bg-no-repeat bg-center bg-[length:22px_22px] btn focus:outline-none border-none"
      style={{ backgroundImage: "url('/images/back.png')" }}
    />
  );
});
BackButton.displayName = "BackButton";
export default BackButton;
