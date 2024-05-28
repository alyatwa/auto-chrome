/// <reference types="chrome" />

type LogoProps = {
  className: string;
  id: string;
  title: string;
};

function Logo({ className, id, title }: LogoProps) {
  return (
    <div className={className} id={id}>
      <h1 className="text-red-600">{title}</h1>
    </div>
  );
}

export default Logo;
