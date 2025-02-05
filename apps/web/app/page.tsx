"use client"
import Image, { type ImageProps } from "next/image";

import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import Login from "./login/page";
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
      <Login />

    </div>
  );
} 