import clsx from "clsx";
import { forwardRef } from "react";

type ButtonVariant = "outline" | "solid" | "ghost";

interface ButtonOptions {
  /**
   * Button display variants
   * @default "solid"
   * @type ButtonVariant
   */
  variant?: ButtonVariant;
}

type Ref = HTMLButtonElement;

export type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> &
  ButtonOptions;

const getVariant = (variant: ButtonVariant) => {
  switch (variant) {
    case "solid":
      return " bg-[#eafe63] text-[#0b2938] text-sm rounded-full px-6 py-2 flex-shrink-0";
    case "outline":
      return " bg-[#eafe63] text-[#0b2938] text-sm rounded-full px-6 py-2 flex-shrink-0";
    case "ghost":
      return " bg-[#eafe63] text-[#0b2938] text-sm rounded-full px-6 py-2 flex-shrink-0";
    default:
      return undefined;
  }
};

const Button = forwardRef<Ref, ButtonProps>((props, ref) => {
  const {
    variant = "solid",
    type = "button",
    className,
    children,
    ...rest
  } = props;

  const merged = clsx("btn focus:outline-none", getVariant(variant), className);

  return (
    <button type={type} ref={ref} className={merged} {...rest}>
      {children}
    </button>
  );
});

Button.displayName = "Button";
export default Button;
