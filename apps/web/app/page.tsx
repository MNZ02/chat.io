import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";
import { MessageCircle, Moon, Sun, Search } from 'lucide-react'

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

        <div className="w-1/3 bg-gray-100 shadow-2xl m-1">
          <div className="h-20 flex items-center p-2 justify-between">


            <div className="w-10 h-10 bg-gray-600 flex items-center justify-center rounded-full">
              <h1 className="text-white font-semibold p-4 ">AD</h1>
            </div>

            <div className="flex gap-3">

              <MessageCircle />
              <Moon />

            </div>

          </div>

          <div className="flex gap-2 mt-3 bg-gray-200 p-2 ml-2 mr-2 rounded-md">
            <Search className="text-gray-600" />

            <input type="text" placeholder="Search" className="text-gray-600 outline-none" />
          </div>
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
