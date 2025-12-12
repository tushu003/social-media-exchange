"use client";
import { useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { IoIosSend } from "react-icons/io";
import EmojiPicker from "emoji-picker-react";

export const MessageInput = ({ sendMessage, message, setMessage }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const onEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    sendMessage(e);
    setShowEmojiPicker(false);
  };

  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-100 py-4 px-6">
      <form onSubmit={handleSubmit} className="relative flex items-end gap-2">
        <div className="relative flex-1">
          <div className="absolute left-4 bottom-4 z-10">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <BsEmojiSmile className="h-5 w-5" />
            </button>
            {showEmojiPicker && (
              <div className="absolute bottom-12 left-0">
                <div className="shadow-lg rounded-lg">
                  <EmojiPicker onEmojiClick={onEmojiClick} />
                </div>
              </div>
            )}
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="w-full min-h-[100px] max-h-[200px] pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#20b894] focus:ring-1 focus:ring-[#20b894] focus:outline-none resize-none text-gray-700 placeholder:text-gray-400 transition-all duration-200"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#20b894 #f3f4f6'
            }}
          />
        </div>
        <button
          type="submit"
          disabled={!message.trim()}
          className="h-12 px-6 bg-[#20b894] text-white rounded-xl font-medium flex items-center gap-2 hover:bg-[#1a9678] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#20b894] transition-all duration-200 self-end cursor-pointer"
        >
          <span>Send</span>
          <IoIosSend className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};
