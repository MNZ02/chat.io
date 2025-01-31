import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";

type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
};

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props;

  return (
    <>
      <Image {...rest} src={srcLight} className="imgLight" />
      <Image {...rest} src={srcDark} className="imgDark" />
    </>
  );
};

export default function Home() {
  return (
    <div>
      <div className="flex">

        <div className="w-1/3 bg-black">
          Hello World
        </div>

        <div className="flex flex-col justify-center items-center bg-gray-100 h-screen w-2/3">
          <h1 className="text-3xl">Whatsapp Web</h1>
          <h2 className="text-lg p-4">Send and receive messages without keeping your phone online.
            Use WhatsApp on up to 4 linked devices and 1 phone at the same time.</h2>
        </div>
      </div>
    </div>
  );
}
