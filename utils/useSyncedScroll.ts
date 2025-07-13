import { useScroll } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useLenis } from "lenis/react"

export const useSyncedScroll = () => {
  const scroll = useScroll()
  const lenis = useLenis()

  useFrame(() => {
    if (lenis && scroll) {
      // Convert Lenis progress (0-1) to ScrollControls pages
      const scrollProgress = lenis.progress * 10 // 10 = pages count
      scroll.el.scrollTop = scrollProgress * scroll.el.scrollHeight
    }
  })
}