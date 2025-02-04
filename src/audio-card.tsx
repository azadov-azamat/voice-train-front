"use client"

import React, { useState, useEffect } from "react"
import type { DataItem } from "./types"
import { MdDelete } from "react-icons/md";
import { FaPlayCircle, FaRegSave } from "react-icons/fa";
import { AiFillEdit } from "react-icons/ai";
import {Howl, Howler} from 'howler';
import { FaRegCirclePause } from "react-icons/fa6";

interface AudioCardProps {
  item: DataItem
  onSave?: (id: number, text: string, isCorrect: boolean) => void
  onDelete?: (id: number) => void
}

const baseUrl = `${import.meta.env.VITE_BACKEND_HOST}`;

export function AudioCard({ item, onSave, onDelete }: AudioCardProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [text, setText] = useState(item.text)
    const [isCorrect, setIsCorrect] = useState(item.is_correct)
    const [musicOn, setMusicOn] = useState(false);
    const [hasChanges, setHasChanges] = useState(false) 

    const sound = React.useRef(new Howl({
        src: [baseUrl + `/file/` + item.file_name.substring(6, item.file_name.length)],
        html5: true,
        onplay: () => {
          setMusicOn(true)
        },
        onpause: () => setMusicOn(false),
        onend: () => {
            setMusicOn(false)
        }
    }));

    const handleRave = () => {
        Howler.volume(0.8);
        if(musicOn === false){
            setMusicOn(true);
            // sound.play();
            sound.current.play();
            console.log("start")
        }
        if(musicOn === true) {
            setMusicOn(false);
            sound.current.stop();
            console.log("stop")
        }
    }

    const handleSave = () => {
        setIsEditing(false)
        setHasChanges(false) // Reset change detection
        onSave?.(item.id, text, isCorrect)
    }

    const handleDelete = () => {
        setIsEditing(false)
        setHasChanges(false) // Reset change detection
        onDelete?.(item.id)
    }


  // Detect changes in text or isCorrect
    useEffect(() => {
        if (text !== item.text || isCorrect !== item.is_correct) {
            setHasChanges(true)
        } else {
           setHasChanges(false)
        }
    }, [text, isCorrect, item.text, item.is_correct])

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm font-medium"
            >
              <MdDelete />
            </button>
            <h3 className="text-lg font-semibold">ID: {item.id}</h3>
        </div>
        <div className="flex items-center space-x-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isCorrect}
              onChange={(e) => setIsCorrect(e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="ml-2 text-sm text-gray-700">Is Correct: {isCorrect ? "True" : "False"}</span>
          </label>
          {(isEditing || hasChanges) && ( // Show save button if editing or has changes
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm font-medium"
            >
              <FaRegSave />
            </button>
          )}
          {!isEditing && !hasChanges && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm font-medium"
            >
              <AiFillEdit />
            </button>
          )}
        </div>
      </div>
      <div className="mb-4">
        {isEditing ? (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        ) : (
          <p className="text-gray-700">{text}</p>
        )}
      </div>
      <div className="flex items-center bg-gray-100 rounded-md p-2">
             {
                 !musicOn
                ? 
                <FaPlayCircle onClick={handleRave} size={20} />
                : 
                <FaRegCirclePause onClick={handleRave} size={20} />
                }
        <div className="flex-1 ml-4">
          <div className="h-2 bg-gray-200 rounded-full">
            <div className="h-2 bg-blue-500 rounded-full" style={{ width: "0%" }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
