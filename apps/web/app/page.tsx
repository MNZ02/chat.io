import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";
import { MessageCircle, Moon, Sun, Search, Archive } from 'lucide-react'

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


const chats = [
  { id: 1, name: "Alice Johnson", lastMessage: "Sure, let's meet at 3 PM", time: "10:30 AM", unread: 2, mood: "sun" },
  {
    id: 2,
    name: "Bob Smith",
    lastMessage: "Did you see the latest update?",
    time: "Yesterday",
    unread: 0,
    mood: "cloud",
  },
  { id: 3, name: "Charlie Brown", lastMessage: "Thanks for your help!", time: "Yesterday", unread: 0, mood: "zap" },
  {
    id: 4,
    name: "Diana Prince",
    lastMessage: "Can we reschedule our meeting?",
    time: "Tuesday",
    unread: 1,
    mood: "moon",
  },
  // Add more chat entries as needed
]

export default function Home() {
  return (
    <div>
      <div className="flex">

        <div className="w-1/3 bg-gray-100 shadow-2xl m-1">
          <div className="h-20 flex items-center p-2 justify-between">

            {/* Header */}

            <div className="w-10 h-10 bg-gray-200 flex items-center justify-center rounded-full mx-3 cursor-pointer">
              <h1 className="text-gray-700 font-semibold p-4 ">AD</h1>
            </div>

            <div className="flex gap-3">
              {/* Message Icon */}
              <button className="relative group p-2 rounded-full transition duration-300">
                <span className="absolute inset-0 bg-gray-300 rounded-full scale-0 group-hover:scale-100 cursor-pointer"></span>
                <MessageCircle className="relative w-6 h-6 text-gray-600 cursor-pointer" />
              </button>

              {/* Moon Icon */}
              <button className="relative group p-2 rounded-full transition duration-300">
                <span className="absolute inset-0 bg-gray-300 rounded-full scale-0 group-hover:scale-100"></span>
                <Moon className="relative w-6 h-6 text-gray-600 cursor-pointer" />
              </button>
            </div>


          </div>
          {/* Search bar */}
          <div className="flex gap-2 mt-3 bg-gray-200 p-2 ml-2 mr-2 rounded-md">
            <Search className="text-gray-600" />

            <input type="text" placeholder="Search" className="text-gray-600 outline-none" />
          </div>


          {/* Archive */}
          <div className="flex items-center gap-2 p-3 mx-4 mt-2 rounded-md hover:bg-gray-200 cursor-pointer" >
            <Archive className="text-green-400" />
            <p className="text-center text-green-400 ml-2">
              Archived
            </p>
          </div>


          {/* User */}
          <div className="flex-1 overflow-y-auto mt-2">
            <div className="flex items-center p-3 mx-4 my-1 rounded-md hover:bg-gray-200 cursor-pointer">

              <div className="w-10 h-10 bg-gray-200 flex items-center justify-center rounded-full">
                <h1 className="text-gray-600 font-semibold p-4 ">AD</h1>
              </div>

              <div className="flex-1 ml-3">
                <div className="flex justify-between">

                  <h2 className="font-semibold text-gray-800">Angi Dey</h2>
                  <span className="text-xs text-gray-500">10:00pm</span>
                </div>
                <p className="text-sm text-gray-600 truncate">This is a message</p>
              </div>
            </div>

          </div>
        </div>

        {/* Right chat window */}

        <div className="flex flex-col justify-center items-center bg-gray-100 h-screen w-2/3">
          <h1 className="text-3xl">Whatsapp Web</h1>
          <h2 className="text-lg p-4">Send and receive messages without keeping your phone online.
            Use WhatsApp on up to 4 linked devices and 1 phone at the same time.</h2>
        </div>
      </div>
    </div>
  );
} 