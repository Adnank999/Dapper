"use client"

import type React from "react"
import { useState, useEffect } from "react"
import OutputTerminal from "../OutputTerminal"
import TerminalComponent from "../TerminalComponent"

interface KeyProps {
  children: React.ReactNode
  className?: string
  width?: string
  onClick?: () => void
  isPressed?: boolean
  keyCode?: string
  randomColor?: string
}

const Key = ({ children, className = "", width = "w-12", onClick, isPressed, keyCode, randomColor }: KeyProps) => {
  return (
    <button
      className={`
        ${width} h-12 rounded-lg border border-white/20 
        bg-white/5 backdrop-blur-md
        font-medium text-sm
        transition-all duration-150 ease-out
        hover:bg-white/10 hover:border-white/30 hover:shadow-lg
        hover:shadow-cyan-500/20
        active:scale-95 active:bg-white/15
        ${isPressed ? "bg-white/20 border-cyan-500/70 shadow-lg shadow-cyan-500/30 scale-95" : ""}
        ${className}
      `}
      onClick={onClick}
      style={{
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <span 
        className="font-semibold transition-all duration-300"
        style={{ 
          color: randomColor,
          textShadow: `0 0 10px ${randomColor}40`
        }}
      >
        {children}
      </span>
    </button>
  )
}

export default function GlowingKeyboard() {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set())
  const [inputText, setInputText] = useState("Coding is SuperFun")
  const [keyColors, setKeyColors] = useState<{ [key: string]: string }>({})

  // Generate random colors for keys
  const generateRandomColor = () => {
    const colors = [
      '#ff0000', '#ff4500', '#ffa500', '#ffff00', '#adff2f', '#00ff00',
      '#00ffff', '#0080ff', '#0000ff', '#8000ff', '#ff00ff', '#ff1493',
      '#ff69b4', '#ff6347', '#ffd700', '#98fb98', '#87ceeb', '#dda0dd',
      '#f0e68c', '#ffb6c1', '#20b2aa', '#87cefa', '#778899', '#b0c4de',
      '#ff7f50', '#6495ed', '#40e0d0', '#ee82ee', '#90ee90', '#f5deb3'
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  // Initialize random colors for all keys
  useEffect(() => {
    const allKeys = [
      '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'backspace',
      'tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'delete',
      'capslock', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'enter',
      'shiftleft', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'comma', 'period', 'shiftright',
      'fn', 'control', 'option', 'cmd', 'space', 'cmd2', 'arrowleft', 'arrowup', 'arrowdown', 'arrowright'
    ]
    
    const colors: { [key: string]: string } = {}
    allKeys.forEach(key => {
      colors[key] = generateRandomColor()
    })
    setKeyColors(colors)

    // Update colors every 3 seconds for animation effect
    const interval = setInterval(() => {
      const newColors: { [key: string]: string } = {}
      allKeys.forEach(key => {
        newColors[key] = generateRandomColor()
      })
      setKeyColors(newColors)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Key mapping for keyboard events
  const keyMap: { [key: string]: string } = {
    'Digit1': '1', 'Digit2': '2', 'Digit3': '3', 'Digit4': '4', 'Digit5': '5',
    'Digit6': '6', 'Digit7': '7', 'Digit8': '8', 'Digit9': '9', 'Digit0': '0',
    'KeyQ': 'Q', 'KeyW': 'W', 'KeyE': 'E', 'KeyR': 'R', 'KeyT': 'T',
    'KeyY': 'Y', 'KeyU': 'U', 'KeyI': 'I', 'KeyO': 'O', 'KeyP': 'P',
    'KeyA': 'A', 'KeyS': 'S', 'KeyD': 'D', 'KeyF': 'F', 'KeyG': 'G',
    'KeyH': 'H', 'KeyJ': 'J', 'KeyK': 'K', 'KeyL': 'L',
    'KeyZ': 'Z', 'KeyX': 'X', 'KeyC': 'C', 'KeyV': 'V', 'KeyB': 'B',
    'KeyN': 'N', 'KeyM': 'M',
    'Space': 'space',
    'Backspace': 'backspace',
    'Enter': 'enter',
    'Tab': 'tab',
    'CapsLock': 'capslock',
    'ShiftLeft': 'shiftleft',
    'ShiftRight': 'shiftright',
    'ControlLeft': 'control',
    'AltLeft': 'option',
    'MetaLeft': 'cmd',
    'MetaRight': 'cmd2',
    'Comma': 'comma',
    'Period': 'period',
    'ArrowLeft': 'arrowleft',
    'ArrowRight': 'arrowright',
    'ArrowUp': 'arrowup',
    'ArrowDown': 'arrowdown',
  }

  const handleKeyPress = (key: string, displayValue?: string) => {
    const newPressed = new Set(pressedKeys)
    newPressed.add(key)
    setPressedKeys(newPressed)

    // Handle special keys
    if (key === "backspace") {
      setInputText((prev) => prev.slice(0, -1))
    } else if (key === "space") {
      setInputText((prev) => prev + " ")
    } else if (key === "enter") {
      setInputText((prev) => prev + "\n")
    } else if (key === "tab") {
      setInputText((prev) => prev + "    ")
    } else if (displayValue) {
      setInputText((prev) => prev + displayValue)
    }

    // Remove pressed state after animation
    setTimeout(() => {
      setPressedKeys((prev) => {
        const updated = new Set(prev)
        updated.delete(key)
        return updated
      })
    }, 150)
  }

  // Handle physical keyboard input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const mappedKey = keyMap[event.code]
      if (mappedKey) {
        event.preventDefault()
        
        if (mappedKey === 'backspace') {
          handleKeyPress('backspace')
        } else if (mappedKey === 'space') {
          handleKeyPress('space', ' ')
        } else if (mappedKey === 'enter') {
          handleKeyPress('enter')
        } else if (mappedKey === 'tab') {
          handleKeyPress('tab')
        } else if (mappedKey === 'comma') {
          handleKeyPress('comma', ',')
        } else if (mappedKey === 'period') {
          handleKeyPress('period', '.')
        } else if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].includes(mappedKey)) {
          handleKeyPress(mappedKey, mappedKey)
        } else if (mappedKey.length === 1) {
          // Letter keys
          const displayChar = event.shiftKey ? mappedKey.toUpperCase() : mappedKey.toLowerCase()
          handleKeyPress(mappedKey, displayChar)
        } else {
          // Other keys (modifiers, arrows, etc.)
          handleKeyPress(mappedKey)
        }
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      const mappedKey = keyMap[event.code]
      if (mappedKey) {
        setPressedKeys((prev) => {
          const updated = new Set(prev)
          updated.delete(mappedKey)
          return updated
        })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  const numberRow = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]
  const topRow = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"]
  const middleRow = ["A", "S", "D", "F", "G", "H", "J", "K", "L"]
  const bottomRow = ["Z", "X", "C", "V", "B", "N", "M"]

  return (
    <div className="bg-transparent flex flex-col items-start justify-center">
      <div className="mb-8 w-full max-w-2xl">
        {/* <div 
          className="border border-white/20 rounded-lg p-4 min-h-[120px]"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          <div className="text-white/70 text-sm mb-2">Output:</div>
          <div className="text-white font-mono text-lg whitespace-pre-wrap break-words">
            {inputText || "Start typing..."}
          </div>
        </div> */}
        {/* <OutputTerminal inputText={inputText} /> */}
        <TerminalComponent inputText={inputText}/>
      </div>

      <div 
        className="p-6 rounded-2xl border border-white/20 shadow-2xl mx-auto max-w-3xl"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
      >
        {/* Number Row */}
        <div className="flex gap-2 mb-3 justify-center">
          {numberRow.map((num) => (
            <Key 
              key={num} 
              onClick={() => handleKeyPress(num, num)} 
              isPressed={pressedKeys.has(num)}
              keyCode={`Digit${num}`}
              randomColor={keyColors[num]}
            >
              {num}
            </Key>
          ))}
          <Key
            width="w-16"
            onClick={() => handleKeyPress("backspace")}
            isPressed={pressedKeys.has("backspace")}
            className="text-xs"
            keyCode="Backspace"
            randomColor={keyColors['backspace']}
          >
            ⌫
          </Key>
        </div>

        {/* Top Row */}
        <div className="flex gap-2 mb-3 justify-center">
          <Key 
            width="w-16" 
            className="text-xs"
            onClick={() => handleKeyPress("tab")}
            isPressed={pressedKeys.has("tab")}
            keyCode="Tab"
            randomColor={keyColors['tab']}
          >
            tab
          </Key>
          {topRow.map((letter) => (
            <Key
              key={letter}
              onClick={() => handleKeyPress(letter, letter.toLowerCase())}
              isPressed={pressedKeys.has(letter)}
              keyCode={`Key${letter}`}
              randomColor={keyColors[letter]}
            >
              {letter}
            </Key>
          ))}
          <Key 
            width="w-16" 
            className="text-xs"
            randomColor={keyColors['delete']}
          >
            delete
          </Key>
        </div>

        {/* Middle Row */}
        <div className="flex gap-2 mb-3 justify-center">
          <Key 
            width="w-20" 
            className="text-xs"
            onClick={() => handleKeyPress("capslock")}
            isPressed={pressedKeys.has("capslock")}
            keyCode="CapsLock"
            randomColor={keyColors['capslock']}
          >
            caps lock
          </Key>
          {middleRow.map((letter) => (
            <Key
              key={letter}
              onClick={() => handleKeyPress(letter, letter.toLowerCase())}
              isPressed={pressedKeys.has(letter)}
              keyCode={`Key${letter}`}
              randomColor={keyColors[letter]}
            >
              {letter}
            </Key>
          ))}
          <Key
            width="w-20"
            onClick={() => handleKeyPress("enter")}
            isPressed={pressedKeys.has("enter")}
            className="text-xs"
            keyCode="Enter"
            randomColor={keyColors['enter']}
          >
            return
          </Key>
        </div>

        {/* Bottom Row */}
        <div className="flex gap-2 mb-3 justify-center">
          <Key 
            width="w-24" 
            className="text-xs"
            onClick={() => handleKeyPress("shiftleft")}
            isPressed={pressedKeys.has("shiftleft")}
            keyCode="ShiftLeft"
            randomColor={keyColors['shiftleft']}
          >
            shift
          </Key>
          {bottomRow.map((letter) => (
            <Key
              key={letter}
              onClick={() => handleKeyPress(letter, letter.toLowerCase())}
              isPressed={pressedKeys.has(letter)}
              keyCode={`Key${letter}`}
              randomColor={keyColors[letter]}
            >
              {letter}
            </Key>
          ))}
          <Key 
            width="w-12" 
            onClick={() => handleKeyPress("comma", ",")} 
            isPressed={pressedKeys.has("comma")}
            keyCode="Comma"
            randomColor={keyColors['comma']}
          >
            ,
          </Key>
          <Key 
            width="w-12" 
            onClick={() => handleKeyPress("period", ".")} 
            isPressed={pressedKeys.has("period")}
            keyCode="Period"
            randomColor={keyColors['period']}
          >
            .
          </Key>
          <Key 
            width="w-24" 
            className="text-xs"
            onClick={() => handleKeyPress("shiftright")}
            isPressed={pressedKeys.has("shiftright")}
            keyCode="ShiftRight"
            randomColor={keyColors['shiftright']}
          >
            shift
          </Key>
        </div>

        {/* Space Row */}
        <div className="flex gap-2 justify-center">
          <Key 
            width="w-12" 
            className="text-xs"
            randomColor={keyColors['fn']}
          >
            fn
          </Key>
          <Key 
            width="w-16" 
            className="text-xs"
            onClick={() => handleKeyPress("control")}
            isPressed={pressedKeys.has("control")}
            keyCode="ControlLeft"
            randomColor={keyColors['control']}
          >
            control
          </Key>
          <Key 
            width="w-16" 
            className="text-xs"
            onClick={() => handleKeyPress("option")}
            isPressed={pressedKeys.has("option")}
            keyCode="AltLeft"
            randomColor={keyColors['option']}
          >
            option
          </Key>
          <Key
            width="w-20"
            onClick={() => handleKeyPress("cmd")}
            isPressed={pressedKeys.has("cmd")}
            className="text-xs border-cyan-500/50 shadow-md shadow-cyan-500/20"
            keyCode="MetaLeft"
            randomColor={keyColors['cmd']}
          >
            ⌘ cmd
          </Key>
          <Key 
            width="w-64" 
            onClick={() => handleKeyPress("space", " ")} 
            isPressed={pressedKeys.has("space")}
            keyCode="Space"
            randomColor={keyColors['space']}
          >
            {" "}
          </Key>
          <Key
            width="w-20"
            onClick={() => handleKeyPress("cmd2")}
            isPressed={pressedKeys.has("cmd2")}
            className="text-xs"
            keyCode="MetaRight"
            randomColor={keyColors['cmd2']}
          >
            ⌘ cmd
          </Key>
          <Key 
            width="w-16" 
            className="text-xs"
            randomColor={keyColors['option']}
          >
            option
          </Key>
          <Key 
            width="w-12" 
            className="text-xs"
            onClick={() => handleKeyPress("arrowleft")}
            isPressed={pressedKeys.has("arrowleft")}
            keyCode="ArrowLeft"
            randomColor={keyColors['arrowleft']}
          >
            ←
          </Key>
          <div className="flex flex-col gap-1">
            <Key 
              width="w-12" 
              className="h-6 text-xs"
              onClick={() => handleKeyPress("arrowup")}
              isPressed={pressedKeys.has("arrowup")}
              keyCode="ArrowUp"
              randomColor={keyColors['arrowup']}
            >
              ↑
            </Key>
            <Key 
              width="w-12" 
              className="h-6 text-xs"
              onClick={() => handleKeyPress("arrowdown")}
              isPressed={pressedKeys.has("arrowdown")}
              keyCode="ArrowDown"
              randomColor={keyColors['arrowdown']}
            >
              ↓
            </Key>
          </div>
          <Key 
            width="w-12" 
            className="text-xs"
            onClick={() => handleKeyPress("arrowright")}
            isPressed={pressedKeys.has("arrowright")}
            keyCode="ArrowRight"
            randomColor={keyColors['arrowright']}
          >
            →
          </Key>
        </div>
      </div>

    </div>
  )
}
