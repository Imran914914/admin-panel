"use client";
import React, { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import EmojiPicker from "emoji-picker-react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { Trash2 } from "lucide-react";
import { fetchUsers, fetchMessages } from "@/shared/Api/dashboard";
import { Button } from "react-bootstrap";
import { Smile } from "lucide-react";
import Pageheader from "@/shared/layout-components/page-header/pageheader";


const Chat: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<string[]>([]);
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const [users, setUsers] = useState<[]>([]);
  const userMessanger = useSelector((state: any) => state?.auth?.user);
  
  const socket: Socket = io("http://localhost:8080", {
    query: { userId:userMessanger?._id },
  });
  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("register", userMessanger?._id);
    });

    socket.on("chat:initial", (initialMessages: any[]) => {
      setMessages(initialMessages);
    });
  
    socket.on("chat:newMessage", (message: any) => {
      setMessages((prevMessages) => [message, ...prevMessages.slice(0, 9)]);
    });
  
    socket.on("messageRemoved", (messageId: string) => {
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message._id !== messageId) // Filter using MongoDB _id
      );
    });
  
    return () => {
      socket.off("chat:initial");
      socket.off("chat:newMessage");
      socket.off("messageRemoved");
    };
  }, []);


  useEffect(() => {
    const getUsers = async () => {
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers);
    };

    getUsers();
  }, []);

  useEffect(() => {
    const getMessages = async () => {
      const fetchedMessages = await fetchMessages();
      setMessages(fetchedMessages);
    };
    getMessages();
  }, []);

  const handleEmojiClick = (emojiObject: any) => {
    setNewMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setNewMessage(input);
    setCursorPosition(e.target.selectionStart || 0);
  
    // Show dropdown if '@' is typed
    const lastAtIndex = input.lastIndexOf("@");
    if (lastAtIndex !== -1 && lastAtIndex >= input.lastIndexOf(" ")) {
      const searchTerm = input.slice(lastAtIndex + 1);
      if (searchTerm) {
        const matchedUsers = users
          .filter((user: any) =>
            user.userName.toLowerCase().startsWith(searchTerm.toLowerCase())
          )
          .map((user: any) => user.userName); // Extract userName only
        setFilteredUsers(matchedUsers);
        setShowDropdown(true);
      } else {
        const allUserNames = users.map((user: any) => user.userName); // Extract all userNames
        setFilteredUsers(allUserNames);
        setShowDropdown(true);
      }
    } else {
      setShowDropdown(false);
    }
  };
  

  const handleUserSelect = (selectedUser: string) => {
    const inputBeforeCursor = newMessage.slice(0, cursorPosition);
    const inputAfterCursor = newMessage.slice(cursorPosition);
  
    const lastAtIndex = inputBeforeCursor.lastIndexOf("@");
    const updatedMessage =
      inputBeforeCursor.slice(0, lastAtIndex + 1) +
      selectedUser +
      " " +
      inputAfterCursor;
  
    setNewMessage(updatedMessage);
    setShowDropdown(false);
  };
  

  const removeMessage = (messageId: string) => {
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message._id !== messageId) // Use MongoDB _id
    );
    socket.emit("removeMessage", messageId);
  };
  
  const sendMessage = () => {
    if (newMessage.trim() && userMessanger?.userName.trim()) {
      const messageData = {
        username: userMessanger?.userName,
        content: newMessage,
        timestamp: new Date().toISOString(),
      };
  
      socket.emit("chat:message", messageData); // Send message without manually assigning id
      setNewMessage("");
    }
  };

  return (
    <div className=" mt-3 flex flex-col h-screen bg-transparent">
        {/* <h2 className="text-2xl">Chat</h2>
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-blue-500 text-lg">pages</h2>
          <h2>{">>"}</h2>
          <h2 className="text-lg">Chat</h2>
        </div> */}
        <Pageheader
        Heading="Chat"
        Pages={[
          { title: "pages", active: true },
          { title: "Chat", active: false },
        ]}
        v2={false}
      />
      <div className="w-full bg-[#19191c] rounded-md shadow-md p-6">
      <div className="overflow-y-auto border border-gray-300 p-3 mb-4 h-[calc(100vh-300px)]">
          {messages.map((message, index) => (
            <div key={index} className="mb-2 flex items-center justify-between">
              <div>
                <p className="text-sm">
                  <span className="font-semibold text-blue-500">{message.username}</span>:{" "}
                  <span>
                    {message.content.split(/(\s+)/).map((word:any, i:any) =>
                      word.startsWith("@") ? (
                        <span key={i} className="text-purple-500 font-semibold">
                          {word}
                        </span>
                      ) : (
                        word
                      )
                    )}
                  </span>
                </p>
                <span className="text-xs text-gray-500">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
              {userMessanger?.admin && (
                <button
                  onClick={() => removeMessage(message._id)}
                  className="text-red-500 hover:text-red-700 text-xs ml-2"
                >
                  <Trash2 />
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="relative">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="text-3xl text-blue-500 hover:text-blue-600 transition duration-200"
            >
              <Smile/>
              {/* 😊 */}
            </button>
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={handleInputChange}
              className="w-full p-2 form-control"
            />
            <Button
              onClick={sendMessage}
              className="py-2 px-4 bg-blue-500 text-white hover:bg-blue-600 transition duration-200"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </Button>
          </div>
          {showDropdown && (
            <ul className="absolute bg-white border border-gray-300 rounded-lg w-full mt-1 max-h-40 overflow-y-auto shadow-lg z-10">
              {filteredUsers.map((username, idx) => (
                <li
                  key={idx}
                  onClick={() => handleUserSelect(username)}
                  className="px-4 py-2 hover:bg-gray-900 cursor-pointer"
                >
                  {username}
                </li>
              ))}
            </ul>
          )}
        </div>
        {showEmojiPicker && (
          <div className="absolute bottom-56 left-80">
            <EmojiPicker className="bg-black" onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
