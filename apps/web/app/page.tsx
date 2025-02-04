"use client"
import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";
import { MessageCircle, Moon, Sun, Search, Archive } from 'lucide-react'
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import Login from "./Login/page";
import { useState } from "react";

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
      <div className="flex">

        <Sidebar />
        <ChatWindow />

      </div>
    </div>
  );
} 