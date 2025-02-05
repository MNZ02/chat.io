import ChatWindow from "../components/ChatWindow";
import Sidebar from "../components/Sidebar";

export default function Homepage() {

    return (
        <div className="flex">

            <Sidebar />
            <ChatWindow />

        </div>
    )
}